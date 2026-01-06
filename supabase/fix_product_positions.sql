-- Product positioning helper for different stores
-- This script generates proper product positions for each store layout

-- First, let's add a store_id column to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id TEXT DEFAULT 'hm';

-- Update existing products to have store assignments
UPDATE products SET store_id = 'hm' WHERE category IN ('Electronics', 'Clothing', 'Accessories');
UPDATE products SET store_id = 'lulu' WHERE category IN ('Grocery', 'Food');
UPDATE products SET store_id = 'sephora' WHERE category IN ('Beauty', 'Cosmetics');
UPDATE products SET store_id = 'nike' WHERE category IN ('Sports', 'Athletic');
UPDATE products SET store_id = 'ikea' WHERE category IN ('Furniture', 'Home');
UPDATE products SET store_id = 'zara' WHERE category IN ('Fashion', 'Luxury');

-- Function to auto-position products on shelves for H&M
-- H&M has 9 shelves in 3x3 grid
DO $$
DECLARE
    product_record RECORD;
    shelf_index INTEGER := 0;
    product_index INTEGER := 0;
    shelf_positions INTEGER[][] := ARRAY[
        [100, 150], [550, 150], [1000, 150],
        [100, 350], [550, 350], [1000, 350],
        [100, 550], [550, 550], [1000, 550]
    ];
    x_pos INTEGER;
    y_pos INTEGER;
BEGIN
    FOR product_record IN 
        SELECT id FROM products WHERE store_id = 'hm' ORDER BY id
    LOOP
        shelf_index := (product_index / 3) + 1;
        IF shelf_index > 9 THEN shelf_index := 9; END IF;
        
        x_pos := shelf_positions[shelf_index][1] + ((product_index % 3) * 80) + 20;
        y_pos := shelf_positions[shelf_index][2] + 20;
        
        UPDATE products 
        SET position_x = x_pos, position_y = y_pos 
        WHERE id = product_record.id;
        
        product_index := product_index + 1;
    END LOOP;
END $$;

-- Similar positioning for LULU (5 long aisles)
DO $$
DECLARE
    product_record RECORD;
    aisle_index INTEGER := 0;
    product_index INTEGER := 0;
    aisle_x INTEGER[] := ARRAY[100, 400, 700, 1000, 1300];
    x_pos INTEGER;
    y_pos INTEGER;
BEGIN
    FOR product_record IN 
        SELECT id FROM products WHERE store_id = 'lulu' ORDER BY id
    LOOP
        aisle_index := (product_index / 8) + 1;
        IF aisle_index > 5 THEN aisle_index := 5; END IF;
        
        x_pos := aisle_x[aisle_index] + 40;
        y_pos := 120 + ((product_index % 8) * 70);
        
        UPDATE products 
        SET position_x = x_pos, position_y = y_pos 
        WHERE id = product_record.id;
        
        product_index := product_index + 1;
    END LOOP;
END $$;

-- ZARA positioning (6 boutique displays)
DO $$
DECLARE
    product_record RECORD;
    display_index INTEGER := 0;
    product_index INTEGER := 0;
    display_positions INTEGER[][] := ARRAY[
        [150, 150], [550, 150], [900, 150],
        [150, 400], [550, 400], [900, 400]
    ];
    x_pos INTEGER;
    y_pos INTEGER;
BEGIN
    FOR product_record IN 
        SELECT id FROM products WHERE store_id = 'zara' ORDER BY id
    LOOP
        display_index := (product_index / 3) + 1;
        IF display_index > 6 THEN display_index := 6; END IF;
        
        x_pos := display_positions[display_index][1] + ((product_index % 3) * 70) + 20;
        y_pos := display_positions[display_index][2] + 30;
        
        UPDATE products 
        SET position_x = x_pos, position_y = y_pos 
        WHERE id = product_record.id;
        
        product_index := product_index + 1;
    END LOOP;
END $$;

-- Add more products if needed
INSERT INTO products (name, description, price, category, image_url, store_id, position_x, position_y)
VALUES 
    ('Summer Dress', 'Light and breezy summer dress', 49.99, 'Fashion', NULL, 'hm', 120, 170),
    ('Denim Jeans', 'Classic blue jeans', 59.99, 'Fashion', NULL, 'hm', 200, 170),
    ('T-Shirt', 'Cotton t-shirt', 19.99, 'Fashion', NULL, 'hm', 280, 170),
    
    ('Fresh Apples', 'Organic apples', 4.99, 'Grocery', NULL, 'lulu', 140, 140),
    ('Milk', 'Fresh dairy milk', 3.49, 'Grocery', NULL, 'lulu', 140, 210),
    ('Bread', 'Whole wheat bread', 2.99, 'Grocery', NULL, 'lulu', 140, 280),
    
    ('Lipstick', 'Matte finish lipstick', 24.99, 'Beauty', NULL, 'sephora', 120, 140),
    ('Foundation', 'Full coverage foundation', 39.99, 'Beauty', NULL, 'sephora', 200, 140),
    ('Mascara', 'Volumizing mascara', 19.99, 'Beauty', NULL, 'sephora', 280, 140),
    
    ('Running Shoes', 'Professional running shoes', 129.99, 'Sports', NULL, 'nike', 120, 170),
    ('Basketball', 'Official size basketball', 29.99, 'Sports', NULL, 'nike', 200, 170),
    ('Yoga Mat', 'Non-slip yoga mat', 34.99, 'Sports', NULL, 'nike', 280, 170),
    
    ('Sofa', 'Modern 3-seater sofa', 599.99, 'Furniture', NULL, 'ikea', 150, 150),
    ('Desk', 'Ergonomic office desk', 299.99, 'Furniture', NULL, 'ikea', 550, 150),
    ('Bookshelf', '5-tier bookshelf', 149.99, 'Furniture', NULL, 'ikea', 1050, 150)
ON CONFLICT DO NOTHING;
