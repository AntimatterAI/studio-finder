-- Updated Schema for Artist/Producer Merge and Enhanced Features

-- Create invites table with updated role types
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    code_type TEXT NOT NULL DEFAULT 'artist_producer' CHECK (code_type IN ('artist_producer', 'studio', 'admin')),
    tier_level INTEGER NOT NULL DEFAULT 1 CHECK (tier_level IN (1, 2, 3)),
    status TEXT NOT NULL CHECK (status IN ('available', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    used_by UUID REFERENCES auth.users(id),
    used_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Enhanced profiles table with merged artist/producer functionality
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT CHECK (role IN ('artist_producer', 'studio')) NOT NULL,
    tier_level INTEGER NOT NULL DEFAULT 1 CHECK (tier_level IN (1, 2, 3)),
    display_name TEXT,
    bio TEXT,
    location TEXT,
    
    -- Contact Info
    website TEXT,
    phone TEXT,
    email_public TEXT,
    socials JSONB, -- {instagram: "handle", twitter: "handle", spotify: "artist_id"}
    
    -- For Artist/Producers offering services
    offers_production_services BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(10,2), -- Only if offering services
    production_skills TEXT[], -- ["Mixing", "Mastering", "Beat Making", "Recording"]
    equipment TEXT[], -- ["Logic Pro X", "Universal Audio Interface", "Neumann U87"]
    
    -- General artist/producer info
    musical_styles TEXT[], -- ["Hip Hop", "R&B", "Pop", "Jazz"]
    influences TEXT[], -- ["Kendrick Lamar", "Frank Ocean", "Anderson .Paak"]
    instruments TEXT[], -- ["Piano", "Guitar", "Vocals", "Drums"]
    
    -- For Studios
    studio_rooms JSONB, -- [{name: "Studio A", capacity: 10, hourly_rate: 150, equipment: ["SSL Console"], tier_restrictions: [2,3]}]
    studio_equipment TEXT[],
    
    -- Availability for services (both studios and artist/producers offering services)
    availability JSONB, -- {monday: [{start: "09:00", end: "12:00", tier_restrictions: [2,3]}, {start: "14:00", end: "18:00", tier_restrictions: [1,2,3]}]}
    
    -- Profile media
    profile_image_url TEXT,
    cover_image_url TEXT,
    media_urls TEXT[], -- Additional images/videos
    
    -- Stats
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_bookings INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.0,
    profile_views INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    tracks_count INTEGER DEFAULT 0,
    
    -- Profile completion
    profile_complete BOOLEAN DEFAULT FALSE,
    
    -- Activity
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music tracks table with collaboration tagging
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Audio files
    audio_url TEXT NOT NULL, -- Main track file
    preview_url TEXT, -- 30-second preview
    
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
    streaming_links JSONB, -- {spotify: "url", apple_music: "url", soundcloud: "url"}
    
    -- Monetization
    is_for_sale BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    license_type TEXT CHECK (license_type IN ('exclusive', 'non_exclusive', 'lease', 'free')),
    
    -- Visibility
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'tier_only', 'followers_only', 'private')),
    tier_restriction INTEGER, -- Minimum tier required to access
    
    -- Engagement
    plays_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    reposts_count INTEGER DEFAULT 0,
    
    -- Metadata
    tags TEXT[], -- ["trap", "melodic", "sad", "love"]
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track collaborators table for tagging people who worked on tracks
CREATE TABLE IF NOT EXISTS public.track_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- "Featured Artist", "Producer", "Mixer", "Writer", "Performer"
    is_primary BOOLEAN DEFAULT FALSE, -- For main artists vs features
    order_index INTEGER DEFAULT 0, -- For ordering credits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(track_id, profile_id, role)
);

-- Enhanced bookings table with session collaboration
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.profiles(id), -- Studio or artist/producer being booked
    client_id UUID REFERENCES public.profiles(id), -- Person making the booking
    client_email TEXT, -- For non-registered users
    client_name TEXT,
    client_phone TEXT,
    
    -- Booking details
    booking_type TEXT NOT NULL CHECK (booking_type IN ('studio_session', 'production_service', 'mixing', 'mastering', 'collaboration')),
    room_name TEXT, -- For studio bookings
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Session details
    session_title TEXT, -- "Recording vocals for new EP"
    session_description TEXT,
    equipment_needed TEXT[],
    special_requests TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    
    -- Notes
    client_notes TEXT,
    provider_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session participants table for adding people to bookings
CREATE TABLE IF NOT EXISTS public.session_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    invited_by_id UUID REFERENCES public.profiles(id), -- Who added them
    role TEXT, -- "Collaborator", "Producer", "Engineer", "Guest"
    status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
    notes TEXT, -- Why they were added, what they'll contribute
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, participant_id)
);

-- Time slots table for availability scheduling
CREATE TABLE IF NOT EXISTS public.available_time_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    room_name TEXT, -- For studios with multiple rooms
    
    -- Time details
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    
    -- Restrictions
    tier_restrictions INTEGER[], -- [2,3] means only tier 2 and 3 can book
    min_tier_required INTEGER DEFAULT 1,
    max_tier_allowed INTEGER DEFAULT 3,
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB, -- {type: "weekly", days: ["monday", "wednesday"], weeks: 4}
    
    -- Metadata
    title TEXT, -- "Evening Production Sessions"
    description TEXT, -- "Perfect for recording vocals and mixing"
    service_type TEXT, -- "studio_session", "production", "mixing"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Other existing tables (simplified versions)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.track_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, track_id)
);

CREATE TABLE IF NOT EXISTS public.track_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.track_comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id),
    reviewee_id UUID REFERENCES public.profiles(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);
CREATE INDEX IF NOT EXISTS idx_invites_code_type_tier ON public.invites(code_type, tier_level);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_tier_level ON public.profiles(tier_level);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_offers_production ON public.profiles(offers_production_services);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);

CREATE INDEX IF NOT EXISTS idx_tracks_uploader_id ON public.tracks(uploader_id);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON public.tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_visibility ON public.tracks(visibility);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON public.tracks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_is_featured ON public.tracks(is_featured);

CREATE INDEX IF NOT EXISTS idx_track_collaborators_track_id ON public.track_collaborators(track_id);
CREATE INDEX IF NOT EXISTS idx_track_collaborators_profile_id ON public.track_collaborators(profile_id);

CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings(start_time);

CREATE INDEX IF NOT EXISTS idx_session_participants_booking_id ON public.session_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_participant_id ON public.session_participants(participant_id);

CREATE INDEX IF NOT EXISTS idx_available_time_slots_profile_id ON public.available_time_slots(profile_id);
CREATE INDEX IF NOT EXISTS idx_available_time_slots_start_time ON public.available_time_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_available_time_slots_is_available ON public.available_time_slots(is_available);

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update track counts
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

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles
        SET followers_count = followers_count + 1
        WHERE id = NEW.following_id;
        
        UPDATE public.profiles
        SET following_count = following_count + 1
        WHERE id = NEW.follower_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles
        SET followers_count = followers_count - 1
        WHERE id = OLD.following_id;
        
        UPDATE public.profiles
        SET following_count = following_count - 1
        WHERE id = OLD.follower_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update track engagement
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

-- Create triggers
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_tracks_updated_at ON public.tracks;
CREATE TRIGGER handle_tracks_updated_at
    BEFORE UPDATE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_bookings_updated_at ON public.bookings;
CREATE TRIGGER handle_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_track_counts ON public.tracks;
CREATE TRIGGER handle_track_counts
    AFTER INSERT OR DELETE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_track_counts();

DROP TRIGGER IF EXISTS handle_follower_counts ON public.connections;
CREATE TRIGGER handle_follower_counts
    AFTER INSERT OR DELETE ON public.connections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_follower_counts();

DROP TRIGGER IF EXISTS handle_track_likes ON public.track_likes;
CREATE TRIGGER handle_track_likes
    AFTER INSERT OR DELETE ON public.track_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_track_likes();

-- Sample data for testing
INSERT INTO public.profiles (
    id, role, tier_level, display_name, bio, location, 
    offers_production_services, hourly_rate, production_skills, equipment,
    musical_styles, influences, instruments, verified, profile_complete
) VALUES
    -- Artist/Producer who offers services
    (gen_random_uuid(), 'artist_producer', 1, 'Maya Chen', 
     'Singer-songwriter and producer. I create dreamy indie pop and also offer mixing services for other artists.', 
     'Los Angeles, CA', true, 75.00, 
     ARRAY['Mixing', 'Vocal Production', 'Songwriting'], 
     ARRAY['Logic Pro X', 'Universal Audio Apollo', 'Neumann U87'],
     ARRAY['Indie Pop', 'Alternative', 'Folk'], 
     ARRAY['Lorde', 'Phoebe Bridgers', 'Bon Iver'],
     ARRAY['Vocals', 'Guitar', 'Piano'], true, true),
    
    -- Artist/Producer who doesn't offer services (just uploads music)
    (gen_random_uuid(), 'artist_producer', 1, 'Alex Rivera', 
     'Hip-hop artist focused on storytelling through music. Always looking for producers to collaborate with.', 
     'Atlanta, GA', false, NULL, NULL, NULL,
     ARRAY['Hip Hop', 'Rap', 'R&B'], 
     ARRAY['Kendrick Lamar', 'J. Cole', 'Frank Ocean'],
     ARRAY['Vocals', 'Rap'], true, true),
    
    -- Studio
    (gen_random_uuid(), 'studio', 1, 'Electric Garden Studios', 
     'Professional recording facility with vintage gear and modern technology. Perfect for solo artists and bands.', 
     'Nashville, TN', false, NULL, NULL, 
     ARRAY['SSL Console', 'Vintage Neve', 'Pro Tools HDX'],
     NULL, NULL, NULL, true, true)
ON CONFLICT (id) DO NOTHING; 