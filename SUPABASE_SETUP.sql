/**
 * SUPABASE DATABASE SETUP GUIDE
 * 
 * Project ID: nckjhlqglzsljkyzhoee
 * 
 * This file contains all the SQL queries you need to run in your Supabase SQL editor
 * to set up the database schema for the Restaurant Order Dashboard.
 * 
 * Instructions:
 * 1. Go to your Supabase dashboard: https://app.supabase.com/
 * 2. Select your project: Restaurant Order Dashboard
 * 3. Go to SQL Editor
 * 4. Copy and paste EACH query below one at a time
 * 5. Click "Run" for each query
 */

-- ============================================================================
-- 1. CREATE KV STORE TABLE (for storing orders and analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS kv_store_5c1c75e3 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_5c1c75e3 (key);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_store_5c1c75e3 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write (for development)
-- NOTE: In production, implement proper authentication
CREATE POLICY "Allow public access" ON kv_store_5c1c75e3
  FOR ALL USING (true)
  WITH CHECK (true);


-- ============================================================================
-- 2. CREATE ORDERS TABLE (normalized structure)
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  pickup_type TEXT NOT NULL CHECK (pickup_type IN ('Dine-In', 'Take-Out')),
  total_price DECIMAL(10, 2) NOT NULL,
  extra_charges DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_type ON orders (pickup_type);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public access" ON orders
  FOR ALL USING (true)
  WITH CHECK (true);


-- ============================================================================
-- 3. CREATE ORDER ITEMS TABLE (items within each order)
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_food_name ON order_items (food_name);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public access" ON order_items
  FOR ALL USING (true)
  WITH CHECK (true);


-- ============================================================================
-- 4. CREATE ANALYTICS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW order_analytics AS
SELECT
  COUNT(*) as total_orders,
  SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_orders,
  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
  SUM(total_price) as total_revenue,
  SUM(CASE WHEN pickup_type = 'Dine-In' THEN 1 ELSE 0 END) as dine_in_count,
  SUM(CASE WHEN pickup_type = 'Take-Out' THEN 1 ELSE 0 END) as takeout_count,
  SUM(CASE WHEN pickup_type = 'Dine-In' THEN total_price ELSE 0 END) as dine_in_revenue,
  SUM(CASE WHEN pickup_type = 'Take-Out' THEN total_price ELSE 0 END) as takeout_revenue
FROM orders;


-- ============================================================================
-- 5. CREATE SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample order
INSERT INTO orders (order_id, customer_first_name, customer_last_name, pickup_type, total_price, status)
VALUES ('order_sample_001', 'Lasith', 'Bandara', 'Dine-In', 45.99, 'ACTIVE');

-- Insert sample order items
INSERT INTO order_items (order_id, food_name, unit_price, quantity, subtotal)
SELECT id, 'Margherita Pizza', 12.99, 2, 25.98
FROM orders WHERE order_id = 'order_sample_001';

INSERT INTO order_items (order_id, food_name, unit_price, quantity, subtotal)
SELECT id, 'Caesar Salad', 8.99, 1, 8.99
FROM orders WHERE order_id = 'order_sample_001';


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tables created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check sample data
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM order_analytics;
