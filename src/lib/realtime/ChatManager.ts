import { supabase } from '../supabase/client';
import { useGameStore } from '../store/gameStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class ChatManager {
    private channel: RealtimeChannel | null = null;
    private userId: string;
    private username: string;

    constructor(userId: string, username: string) {
        this.userId = userId;
        this.username = username;
    }

    async initialize(): Promise<void> {
        // Load recent messages
        const { data: messages } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(50);

        if (messages) {
            useGameStore.getState().setChatMessages(messages);
        }

        // Subscribe to new messages
        this.channel = supabase
            .channel('chat-messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                },
                (payload) => {
                    const message = payload.new as any;
                    useGameStore.getState().addChatMessage(message);
                }
            )
            .subscribe();
    }

    async sendMessage(message: string, position?: { x: number; y: number }): Promise<void> {
        const { error } = await supabase.from('chat_messages').insert({
            user_id: this.userId,
            username: this.username,
            message,
            position_x: position?.x || null,
            position_y: position?.y || null,
        });

        if (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async cleanup(): Promise<void> {
        if (this.channel) {
            await this.channel.unsubscribe();
        }
    }
}
