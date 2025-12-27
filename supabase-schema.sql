-- ============================================
-- Supabase PostgreSQL Schema for waorders.com
-- ============================================
-- 
-- This script creates the core tables for the merchant store management system.
-- Run this SQL script in your Supabase SQL Editor.
--
-- Tables:
-- 1. stores - Merchant/business configuration
-- 2. products - Product catalog
-- 3. orders - Order management (optional for MVP)
-- ============================================

-- ============================================
-- 1. STORES TABLE
-- ============================================
-- Stores merchant/business configuration data
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    store_link TEXT UNIQUE NOT NULL,
    delivery_methods JSONB DEFAULT '[]'::jsonb,
    payment_methods JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on store_link for faster lookups
CREATE INDEX IF NOT EXISTS idx_stores_store_link ON stores(store_link);

-- Create index on owner_id for faster queries
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
-- Stores product catalog data
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    category TEXT,
    inventory INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on store_id for faster queries
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ============================================
-- 3. ORDERS TABLE (Optional for MVP)
-- ============================================
-- Tracks incoming orders initiated via WhatsApp
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on store_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Stores: Users can only see and modify their own stores
CREATE POLICY "Users can view their own stores"
    ON stores FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own stores"
    ON stores FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own stores"
    ON stores FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own stores"
    ON stores FOR DELETE
    USING (auth.uid() = owner_id);

-- Products: Users can only see and modify products from their stores
CREATE POLICY "Users can view products from their stores"
    ON products FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = products.store_id
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert products to their stores"
    ON products FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = products.store_id
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update products from their stores"
    ON products FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = products.store_id
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete products from their stores"
    ON products FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = products.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- Orders: Users can only see and modify orders from their stores
CREATE POLICY "Users can view orders from their stores"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = orders.store_id
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert orders to their stores"
    ON orders FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = orders.store_id
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update orders from their stores"
    ON orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = orders.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- ============================================
-- HELPER FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


