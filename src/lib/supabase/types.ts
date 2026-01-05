export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    username: string
                    avatar_type: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    avatar_type?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    avatar_type?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    category: string
                    image_url: string | null
                    position_x: number
                    position_y: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    category: string
                    image_url?: string | null
                    position_x: number
                    position_y: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    category?: string
                    image_url?: string | null
                    position_x?: number
                    position_y?: number
                    created_at?: string
                }
            }
            cart_items: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    quantity?: number
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    total: number
                    status: string
                    items: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    total: number
                    status?: string
                    items: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    total?: number
                    status?: string
                    items?: Json
                    created_at?: string
                }
            }
            chat_messages: {
                Row: {
                    id: string
                    user_id: string
                    username: string
                    message: string
                    position_x: number | null
                    position_y: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    username: string
                    message: string
                    position_x?: number | null
                    position_y?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    username?: string
                    message?: string
                    position_x?: number | null
                    position_y?: number | null
                    created_at?: string
                }
            }
            user_presence: {
                Row: {
                    user_id: string
                    username: string
                    position_x: number
                    position_y: number
                    direction: string
                    is_moving: boolean
                    last_seen: string
                }
                Insert: {
                    user_id: string
                    username: string
                    position_x?: number
                    position_y?: number
                    direction?: string
                    is_moving?: boolean
                    last_seen?: string
                }
                Update: {
                    user_id?: string
                    username?: string
                    position_x?: number
                    position_y?: number
                    direction?: string
                    is_moving?: boolean
                    last_seen?: string
                }
            }
            user_activity: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string | null
                    action_type: string
                    duration: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id?: string | null
                    action_type: string
                    duration?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string | null
                    action_type?: string
                    duration?: number | null
                    created_at?: string
                }
            }
        }
    }
}
