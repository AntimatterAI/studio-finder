-- wavr - Super Simple Schema for Testing
-- Run this in your Supabase SQL Editor

-- Drop everything first to start clean
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.invites CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create admin_users table
CREATE TABLE public.admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invites table
CREATE TABLE public.invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    code_type TEXT NOT NULL DEFAULT 'artist',
    tier_level INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL,
    tier_level INTEGER NOT NULL DEFAULT 1,
    display_name TEXT,
    bio TEXT,
    location TEXT,
    hourly_rate DECIMAL(10,2),
    skills TEXT[],
    profile_complete BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 4.5,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple policies
CREATE POLICY "Public can read tier 1 profiles" ON public.profiles
    FOR SELECT USING (tier_level = 1 OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read invites" ON public.invites
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update invite status" ON public.invites
    FOR UPDATE USING (true);

CREATE POLICY "Admins manage everything" ON public.admin_users
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Insert test invite codes
INSERT INTO public.invites (code, code_type, tier_level) VALUES
('ART001', 'artist', 1),
('ART002', 'artist', 1),
('ART003', 'artist', 1),
('PROD001', 'producer', 1),
('PROD002', 'producer', 1),
('PROD003', 'producer', 1),
('STUDIO001', 'studio', 1),
('STUDIO002', 'studio', 1),
('STUDIO003', 'studio', 1),
('TIER2001', 'artist', 2),
('TIER3001', 'producer', 3);

-- Success message
SELECT 'Database ready! Use the invite codes above to test registration.' as status; 

   INSERT INTO public.admin_users (id, email) 
   SELECT id, email FROM auth.users WHERE email = 'paul@antimatterai.com';