import { supabase } from '../supabase/client';
import { useGameStore } from '../store/gameStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class PresenceManager {
    private channel: RealtimeChannel | null = null;
    private userId: string;
    private username: string;
    private updateInterval: NodeJS.Timeout | null = null;
    private lastPosition: any = null;

    constructor(userId: string, username: string) {
        this.userId = userId;
        this.username = username;
    }

    async initialize(): Promise<void> {
        // Subscribe to presence channel
        this.channel = supabase.channel('store-presence');

        // Listen for presence changes
        this.channel
            .on('presence', { event: 'sync' }, () => {
                const state = this.channel!.presenceState();
                this.handlePresenceSync(state);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', leftPresences);
                leftPresences.forEach((presence: any) => {
                    useGameStore.getState().removePlayer(presence.user_id);
                });
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Track our presence
                    await this.channel!.track({
                        user_id: this.userId,
                        username: this.username,
                        position_x: 400,
                        position_y: 300,
                        direction: 'down',
                        is_moving: false,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        // Also subscribe to user_presence table for persistence
        supabase
            .channel('user_presence_db')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_presence',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const data = payload.new as any;
                        if (data.user_id !== this.userId) {
                            useGameStore.getState().updatePlayerPosition(data.user_id, data);
                        }
                    } else if (payload.eventType === 'DELETE') {
                        const data = payload.old as any;
                        useGameStore.getState().removePlayer(data.user_id);
                    }
                }
            )
            .subscribe();

        // Insert initial presence in database
        await supabase.from('user_presence').upsert({
            user_id: this.userId,
            username: this.username,
            position_x: 400,
            position_y: 300,
            direction: 'down',
            is_moving: false,
            last_seen: new Date().toISOString(),
        });

        // Load existing users
        const { data: existingUsers } = await supabase
            .from('user_presence')
            .select('*')
            .neq('user_id', this.userId);

        if (existingUsers) {
            useGameStore.getState().setOtherPlayers(existingUsers);
        }
    }

    private handlePresenceSync(state: any): void {
        const players: any[] = [];

        Object.keys(state).forEach((key) => {
            const presences = state[key];
            presences.forEach((presence: any) => {
                if (presence.user_id !== this.userId) {
                    players.push(presence);
                }
            });
        });

        // Update store with all remote players
        players.forEach((player) => {
            useGameStore.getState().updatePlayerPosition(player.user_id, player);
        });
    }

    async updatePosition(position: {
        position_x: number;
        position_y: number;
        direction: string;
        is_moving: boolean;
    }): Promise<void> {
        // Throttle updates - only send if position changed significantly
        if (this.lastPosition) {
            const dx = Math.abs(position.position_x - this.lastPosition.position_x);
            const dy = Math.abs(position.position_y - this.lastPosition.position_y);
            if (dx < 5 && dy < 5 && position.is_moving === this.lastPosition.is_moving) {
                return;
            }
        }

        this.lastPosition = position;

        // Update presence channel
        if (this.channel) {
            await this.channel.track({
                user_id: this.userId,
                username: this.username,
                ...position,
                online_at: new Date().toISOString(),
            });
        }

        // Update database
        await supabase.from('user_presence').upsert({
            user_id: this.userId,
            username: this.username,
            ...position,
            last_seen: new Date().toISOString(),
        });
    }

    async cleanup(): Promise<void> {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        if (this.channel) {
            await this.channel.untrack();
            await this.channel.unsubscribe();
        }

        // Remove from database
        await supabase.from('user_presence').delete().eq('user_id', this.userId);
    }
}
