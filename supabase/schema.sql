-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_type TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  position_x REAL,
  position_y REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User presence table (for real-time avatar positions)
CREATE TABLE public.user_presence (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  position_x REAL NOT NULL DEFAULT 400,
  position_y REAL NOT NULL DEFAULT 300,
  direction TEXT DEFAULT 'down',
  is_moving BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity table (for AI recommendations)
CREATE TABLE public.user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'view', 'hover', 'add_to_cart'
  duration INTEGER, -- time spent in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_product_id ON public.user_activity(product_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read all, but only update their own
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: Everyone can read
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Cart items: Users can only access their own cart
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can only access their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat messages: Everyone can read, authenticated users can insert
CREATE POLICY "Chat messages are viewable by everyone" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User presence: Everyone can read, users can update their own
CREATE POLICY "User presence is viewable by everyone" ON public.user_presence FOR SELECT USING (true);
CREATE POLICY "Users can insert own presence" ON public.user_presence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own presence" ON public.user_presence FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own presence" ON public.user_presence FOR DELETE USING (auth.uid() = user_id);

-- User activity: Users can only access their own activity
CREATE POLICY "Users can view own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up old chat messages (keep last 100)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_messages
  WHERE id NOT IN (
    SELECT id FROM public.chat_messages
    ORDER BY created_at DESC
    LIMIT 100
  );
END;
$$ LANGUAGE plpgsql;

-- Insert sample products
INSERT INTO public.products (name, description, price, category, image_url, position_x, position_y) VALUES
  ('Wireless Headphones', 'Premium noise-cancelling headphones', 199.99, 'Electronics', '/products/headphones.jpg', 200, 150),
  ('Smart Watch', 'Fitness tracker with heart rate monitor', 299.99, 'Electronics', '/products/smartwatch.jpg', 300, 150),
  ('Running Shoes', 'Comfortable athletic shoes', 89.99, 'Sports', '/products/shoes.jpg', 400, 150),
  ('Yoga Mat', 'Non-slip exercise mat', 29.99, 'Sports', '/products/yogamat.jpg', 500, 150),
  ('Coffee Maker', 'Programmable drip coffee maker', 79.99, 'Home', '/products/coffee.jpg', 200, 350),
  ('Blender', 'High-speed blender for smoothies', 59.99, 'Home', '/products/blender.jpg', 300, 350),
  ('Backpack', 'Durable travel backpack', 49.99, 'Accessories', '/products/backpack.jpg', 400, 350),
  ('Sunglasses', 'UV protection sunglasses', 39.99, 'Accessories', '/products/sunglasses.jpg', 500, 350),
  ('Laptop Stand', 'Ergonomic laptop stand', 34.99, 'Electronics', '/products/laptopstand.jpg', 600, 150),
  ('Water Bottle', 'Insulated stainless steel bottle', 24.99, 'Sports', '/products/waterbottle.jpg', 600, 350);
