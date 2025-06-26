-- Migration Script: Update to Artist/Producer + Studio Schema
-- Run this in your Supabase SQL Editor to update existing database

-- Step 1: Add new columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS offers_production_services BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS production_skills TEXT[],
ADD COLUMN IF NOT EXISTS musical_styles TEXT[],
ADD COLUMN IF NOT EXISTS influences TEXT[],
ADD COLUMN IF NOT EXISTS instruments TEXT[],
ADD COLUMN IF NOT EXISTS studio_rooms JSONB,
ADD COLUMN IF NOT EXISTS studio_equipment TEXT[],
ADD COLUMN IF NOT EXISTS availability JSONB,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS tracks_count INTEGER DEFAULT 0;

-- Step 2: Update role values (migrate existing data)
-- Convert 'artist' and 'producer' to 'artist_producer'
UPDATE public.profiles 
SET role = 'artist_producer' 
WHERE role IN ('artist', 'producer');

-- Step 3: Update role constraint to new values
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('artist_producer', 'studio'));

-- Step 4: Update invites table for new role types
ALTER TABLE public.invites 
DROP CONSTRAINT IF EXISTS invites_code_type_check;

ALTER TABLE public.invites 
ADD CONSTRAINT invites_code_type_check 
CHECK (code_type IN ('artist_producer', 'studio', 'admin'));

-- Update existing invite codes
UPDATE public.invites 
SET code_type = 'artist_producer' 
WHERE code_type IN ('artist', 'producer');

-- Step 5: Create new tables for enhanced functionality

-- Music tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Audio files
    audio_url TEXT NOT NULL,
    preview_url TEXT,
    
    -- Visual
    cover_image_url TEXT,
    
    -- Music details
    genre TEXT,
    subgenre TEXT,
    bpm INTEGER,
    key_signature TEXT,
    duration_seconds INTEGER,
    
    -- Release info
    release_date DATE,
    is_released BOOLEAN DEFAULT FALSE,
    streaming_links JSONB,
    
    -- Monetization
    is_for_sale BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    license_type TEXT CHECK (license_type IN ('exclusive', 'non_exclusive', 'lease', 'free')),
    
    -- Visibility
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'tier_only', 'followers_only', 'private')),
    tier_restriction INTEGER,
    
    -- Engagement
    plays_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    reposts_count INTEGER DEFAULT 0,
    
    -- Metadata
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track collaborators table
CREATE TABLE IF NOT EXISTS public.track_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(track_id, profile_id, role)
);

-- Session participants table
CREATE TABLE IF NOT EXISTS public.session_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    invited_by_id UUID REFERENCES public.profiles(id),
    role TEXT,
    status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, participant_id)
);

-- Available time slots table
CREATE TABLE IF NOT EXISTS public.available_time_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    room_name TEXT,
    
    -- Time details
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    
    -- Restrictions
    tier_restrictions INTEGER[],
    min_tier_required INTEGER DEFAULT 1,
    max_tier_allowed INTEGER DEFAULT 3,
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB,
    
    -- Metadata
    title TEXT,
    description TEXT,
    service_type TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing tables if they exist (rename posts to tracks references)
DO $$ 
BEGIN
    -- Check if posts table exists and rename references
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') THEN
        -- Rename posts to tracks for consistency
        DROP TABLE IF EXISTS public.post_likes;
        DROP TABLE IF EXISTS public.post_comments;
        
        -- Create track_likes table
        CREATE TABLE IF NOT EXISTS public.track_likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, track_id)
        );
        
        -- Create track_comments table
        CREATE TABLE IF NOT EXISTS public.track_comments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            parent_comment_id UUID REFERENCES public.track_comments(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Step 6: Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_tracks_uploader_id ON public.tracks(uploader_id);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON public.tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_visibility ON public.tracks(visibility);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON public.tracks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_is_featured ON public.tracks(is_featured);

CREATE INDEX IF NOT EXISTS idx_track_collaborators_track_id ON public.track_collaborators(track_id);
CREATE INDEX IF NOT EXISTS idx_track_collaborators_profile_id ON public.track_collaborators(profile_id);

CREATE INDEX IF NOT EXISTS idx_session_participants_booking_id ON public.session_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_participant_id ON public.session_participants(participant_id);

CREATE INDEX IF NOT EXISTS idx_available_time_slots_profile_id ON public.available_time_slots(profile_id);
CREATE INDEX IF NOT EXISTS idx_available_time_slots_start_time ON public.available_time_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_available_time_slots_is_available ON public.available_time_slots(is_available);

CREATE INDEX IF NOT EXISTS idx_profiles_offers_production ON public.profiles(offers_production_services);

-- Step 7: Create/update functions and triggers
CREATE OR REPLACE FUNCTION public.update_track_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles
        SET tracks_count = tracks_count + 1
        WHERE id = NEW.uploader_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles
        SET tracks_count = tracks_count - 1
        WHERE id = OLD.uploader_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_track_likes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tracks
        SET likes_count = likes_count + 1
        WHERE id = NEW.track_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tracks
        SET likes_count = likes_count - 1
        WHERE id = OLD.track_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for new tables
DROP TRIGGER IF EXISTS handle_tracks_updated_at ON public.tracks;
CREATE TRIGGER handle_tracks_updated_at
    BEFORE UPDATE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_track_counts ON public.tracks;
CREATE TRIGGER handle_track_counts
    AFTER INSERT OR DELETE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_track_counts();

DROP TRIGGER IF EXISTS handle_track_likes ON public.track_likes;
CREATE TRIGGER handle_track_likes
    AFTER INSERT OR DELETE ON public.track_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_track_likes();

DROP TRIGGER IF EXISTS handle_available_time_slots_updated_at ON public.available_time_slots;
CREATE TRIGGER handle_available_time_slots_updated_at
    BEFORE UPDATE ON public.available_time_slots
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Step 8: Update existing profiles with new structure
-- Set default values for artist/producers
UPDATE public.profiles 
SET 
    offers_production_services = CASE 
        WHEN hourly_rate IS NOT NULL AND hourly_rate > 0 THEN TRUE 
        ELSE FALSE 
    END,
    musical_styles = COALESCE(skills, ARRAY[]::TEXT[]),
    production_skills = CASE 
        WHEN role = 'artist_producer' AND hourly_rate IS NOT NULL THEN skills
        ELSE ARRAY[]::TEXT[]
    END,
    studio_equipment = CASE 
        WHEN role = 'studio' THEN equipment
        ELSE ARRAY[]::TEXT[]
    END
WHERE role IN ('artist_producer', 'studio');

-- For studios, move rooms data if it exists
UPDATE public.profiles 
SET studio_rooms = rooms
WHERE role = 'studio' AND rooms IS NOT NULL;

-- Step 9: Clean up old columns (optional - run only if you want to remove old data)
-- Uncomment these lines if you want to remove the old columns after migration:
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS rooms;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS posts_count;

-- Step 10: Enable RLS for new tables
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_comments ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for new tables
CREATE POLICY "Public tracks are viewable by everyone" ON public.tracks
    FOR SELECT USING (
        visibility = 'public' OR 
        (auth.uid() IS NOT NULL AND uploader_id = auth.uid())
    );

CREATE POLICY "Users can insert their own tracks" ON public.tracks
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update their own tracks" ON public.tracks
    FOR UPDATE USING (auth.uid() = uploader_id);

CREATE POLICY "Users can delete their own tracks" ON public.tracks
    FOR DELETE USING (auth.uid() = uploader_id);

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Migration completed successfully! Your database has been updated to support the new artist/producer + studio structure.';
END $$; 