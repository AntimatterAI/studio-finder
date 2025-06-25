-- Create invites table with auto-generation
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    code_type TEXT NOT NULL DEFAULT 'artist' CHECK (code_type IN ('artist', 'producer', 'studio', 'admin')),
    tier_level INTEGER NOT NULL DEFAULT 1 CHECK (tier_level IN (1, 2, 3)),
    status TEXT NOT NULL CHECK (status IN ('available', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    used_by UUID REFERENCES auth.users(id),
    used_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create profiles table with enhanced features
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT CHECK (role IN ('artist', 'producer', 'studio')) NOT NULL,
    tier_level INTEGER NOT NULL DEFAULT 1 CHECK (tier_level IN (1, 2, 3)),
    display_name TEXT,
    bio TEXT,
    location TEXT,
    hourly_rate DECIMAL(10,2),
    skills TEXT[],
    influences TEXT[],
    media_urls TEXT[],
    socials JSONB,
    profile_complete BOOLEAN DEFAULT FALSE,
    availability JSONB, -- For studios and producers: {monday: {start: "09:00", end: "17:00", available: true}, ...}
    equipment TEXT[], -- Studio equipment or producer gear
    rooms JSONB, -- For studios: [{name: "Studio A", capacity: 10, equipment: ["Piano", "Drums"]}]
    website TEXT,
    phone TEXT,
    email_public TEXT,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_bookings INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.0,
    profile_views INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create posts table for artists and producers
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_type TEXT NOT NULL CHECK (post_type IN ('track', 'beat', 'collaboration', 'showcase', 'announcement')),
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT, -- Audio/video file
    cover_image_url TEXT,
    genre TEXT,
    bpm INTEGER, -- For beats/tracks
    key_signature TEXT, -- For musical content
    duration INTEGER, -- In seconds
    price DECIMAL(10,2), -- For paid content
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    plays_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'tier_only', 'followers_only', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table with approval workflow
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.profiles(id), -- Studio or producer being booked
    client_id UUID REFERENCES public.profiles(id), -- Artist or producer booking
    client_email TEXT, -- For non-registered users
    client_name TEXT, -- For non-registered users
    client_phone TEXT,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('studio_session', 'production_service', 'mixing', 'mastering')),
    room_name TEXT, -- For studio bookings
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    special_requests TEXT,
    equipment_needed TEXT[],
    notes TEXT,
    provider_notes TEXT, -- Notes from studio/producer
    cancellation_reason TEXT,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connections table for following system
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Create likes table for posts
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Create comments table for posts
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.post_comments(id), -- For replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table for bookings
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id),
    reviewee_id UUID REFERENCES public.profiles(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin actions log
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    target_user_id UUID REFERENCES auth.users(id),
    old_values JSONB,
    new_values JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invite code pool for auto-generation (only for tiers 2+)
CREATE TABLE IF NOT EXISTS public.invite_code_pool (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_type TEXT NOT NULL CHECK (code_type IN ('artist', 'producer', 'studio', 'admin')),
    tier_level INTEGER NOT NULL CHECK (tier_level IN (2, 3)), -- Only tiers 2+ need invite codes
    target_count INTEGER NOT NULL DEFAULT 25, -- Fewer codes needed since tier 1 is open
    last_generated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Policies for invites
CREATE POLICY "Anyone can read available invites" ON public.invites
    FOR SELECT USING (status = 'available');

CREATE POLICY "Authenticated users can update invite status" ON public.invites
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for admin users
CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM public.admin_users)
    );

CREATE POLICY "Admins can insert admin_users" ON public.admin_users
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.admin_users)
    );

-- Policies for profiles (PUBLIC ACCESS FOR TIER 1)
-- Anonymous users and all authenticated users can see tier 1 profiles
CREATE POLICY "Public access to tier 1 profiles" ON public.profiles
    FOR SELECT USING (
        tier_level = 1 OR 
        (auth.uid() IS NOT NULL AND tier_level <= (
            SELECT COALESCE(tier_level, 1) FROM public.profiles WHERE id = auth.uid()
        ))
    );

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies for posts (PUBLIC ACCESS FOR TIER 1)
CREATE POLICY "Public access to tier 1 posts" ON public.posts
    FOR SELECT USING (
        CASE 
            WHEN visibility = 'public' THEN (
                (SELECT tier_level FROM public.profiles p1 WHERE p1.id = user_id) = 1 OR
                (auth.uid() IS NOT NULL AND (
                    SELECT tier_level FROM public.profiles p1 WHERE p1.id = user_id
                ) <= (
                    SELECT COALESCE(tier_level, 1) FROM public.profiles p2 WHERE p2.id = auth.uid()
                ))
            )
            WHEN visibility = 'tier_only' THEN (
                auth.uid() IS NOT NULL AND (
                    SELECT tier_level FROM public.profiles p1 WHERE p1.id = user_id
                ) <= (
                    SELECT tier_level FROM public.profiles p2 WHERE p2.id = auth.uid()
                )
            )
            WHEN visibility = 'followers_only' THEN (
                auth.uid() IN (
                    SELECT follower_id FROM public.connections WHERE following_id = user_id
                ) OR user_id = auth.uid()
            )
            WHEN visibility = 'private' THEN user_id = auth.uid()
            ELSE false
        END
    );

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for bookings (ALLOW NON-REGISTERED USERS TO BOOK TIER 1)
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (
        provider_id = auth.uid() OR 
        client_id = auth.uid() OR
        client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Allow anyone to book tier 1 providers (anonymous users can book)
CREATE POLICY "Anyone can book tier 1 providers" ON public.bookings
    FOR INSERT WITH CHECK (
        provider_id IN (
            SELECT id FROM public.profiles WHERE tier_level = 1
        ) OR (
            auth.role() = 'authenticated' AND provider_id IN (
                SELECT p1.id FROM public.profiles p1 
                WHERE p1.tier_level <= (
                    SELECT COALESCE(p2.tier_level, 1) FROM public.profiles p2 WHERE p2.id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Providers can update booking status" ON public.bookings
    FOR UPDATE USING (provider_id = auth.uid());

-- Policies for connections
CREATE POLICY "Users can view connections" ON public.connections
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create connections" ON public.connections
    FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can delete their own connections" ON public.connections
    FOR DELETE USING (follower_id = auth.uid());

-- Policies for post interactions
CREATE POLICY "Users can view post likes" ON public.post_likes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can like posts" ON public.post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON public.post_likes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments" ON public.post_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can comment" ON public.post_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their comments" ON public.post_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for reviews
CREATE POLICY "Users can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for completed bookings" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE id = booking_id 
            AND status = 'completed'
            AND (client_id = auth.uid() OR provider_id = auth.uid())
        )
    );

-- Policies for admin actions
CREATE POLICY "Admins can view admin actions" ON public.admin_actions
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM public.admin_users)
    );

CREATE POLICY "Admins can create admin actions" ON public.admin_actions
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.admin_users)
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);
CREATE INDEX IF NOT EXISTS idx_invites_code_type_tier ON public.invites(code_type, tier_level);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_tier_level ON public.profiles(tier_level);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON public.posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON public.posts(visibility);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_connections_follower ON public.connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_connections_following ON public.connections(following_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate invite codes (only for tiers 2+)
CREATE OR REPLACE FUNCTION public.generate_invite_codes()
RETURNS void AS $$
DECLARE
    pool_record RECORD;
    current_count INTEGER;
    codes_needed INTEGER;
    new_code TEXT;
    prefix TEXT;
    i INTEGER;
BEGIN
    FOR pool_record IN SELECT * FROM public.invite_code_pool LOOP
        -- Count available codes for this type/tier
        SELECT COUNT(*) INTO current_count
        FROM public.invites
        WHERE code_type = pool_record.code_type
        AND tier_level = pool_record.tier_level
        AND status = 'available';
        
        codes_needed := pool_record.target_count - current_count;
        
        IF codes_needed > 0 THEN
            -- Generate prefix based on type
            prefix := CASE pool_record.code_type
                WHEN 'artist' THEN 'ART'
                WHEN 'producer' THEN 'PROD'
                WHEN 'studio' THEN 'SPACE'
                WHEN 'admin' THEN 'ADMIN'
                ELSE 'CODE'
            END;
            
            -- Generate needed codes
            FOR i IN 1..codes_needed LOOP
                new_code := prefix || pool_record.tier_level || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
                
                -- Ensure uniqueness
                WHILE EXISTS (SELECT 1 FROM public.invites WHERE code = new_code) LOOP
                    new_code := prefix || pool_record.tier_level || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
                END LOOP;
                
                INSERT INTO public.invites (code, code_type, tier_level, status)
                VALUES (new_code, pool_record.code_type, pool_record.tier_level, 'available');
            END LOOP;
            
            -- Update last generated timestamp
            UPDATE public.invite_code_pool
            SET last_generated = NOW()
            WHERE id = pool_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Get user ID from email
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Add to admin_users table
    INSERT INTO public.admin_users (id, email, created_by)
    VALUES (user_id, user_email, NULL)
    ON CONFLICT (email) DO NOTHING;
    
    -- Log the action
    INSERT INTO public.admin_actions (admin_id, action_type, target_user_id, notes)
    VALUES (user_id, 'user_promoted_to_admin', user_id, 'Initial admin promotion');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql;

-- Function to update post counts
CREATE OR REPLACE FUNCTION public.update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles
        SET posts_count = posts_count + 1
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles
        SET posts_count = posts_count - 1
        WHERE id = OLD.user_id;
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

-- Create triggers
CREATE TRIGGER handle_invites_updated_at
    BEFORE UPDATE ON public.invites
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_post_counts
    AFTER INSERT OR DELETE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_post_counts();

CREATE TRIGGER handle_follower_counts
    AFTER INSERT OR DELETE ON public.connections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_follower_counts();

-- Initialize invite code pool (only for tiers 2+ since tier 1 is open)
INSERT INTO public.invite_code_pool (code_type, tier_level, target_count) VALUES
    ('artist', 2, 25),
    ('artist', 3, 10),
    ('producer', 2, 25),
    ('producer', 3, 10),
    ('studio', 2, 20),
    ('studio', 3, 10),
    ('admin', 3, 5)
ON CONFLICT DO NOTHING;

-- Generate initial invite codes for tiers 2+
SELECT public.generate_invite_codes();

-- Create sample tier 1 test data
INSERT INTO auth.users (id, email, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'artist1@test.com', NOW()),
    ('11111111-1111-1111-1111-111111111112', 'artist2@test.com', NOW()),
    ('11111111-1111-1111-1111-111111111113', 'artist3@test.com', NOW()),
    ('22222222-2222-2222-2222-222222222221', 'producer1@test.com', NOW()),
    ('22222222-2222-2222-2222-222222222222', 'producer2@test.com', NOW()),
    ('22222222-2222-2222-2222-222222222223', 'producer3@test.com', NOW()),
    ('33333333-3333-3333-3333-333333333331', 'studio1@test.com', NOW()),
    ('33333333-3333-3333-3333-333333333332', 'studio2@test.com', NOW()),
    ('33333333-3333-3333-3333-333333333333', 'studio3@test.com', NOW())
ON CONFLICT (email) DO NOTHING;

-- Create test profiles for all 9 users (3 roles × 3 tiers)
INSERT INTO public.profiles (
    id, role, tier_level, display_name, bio, location, hourly_rate, 
    skills, equipment, verified, profile_complete, rating, total_bookings
) VALUES
    -- Artists
    ('11111111-1111-1111-1111-111111111111', 'artist', 1, 'Maya Chen', 'Indie pop artist with dreamy vocals and heartfelt lyrics. Love collaborating with producers who understand emotion.', 'Los Angeles, CA', NULL, 
     ARRAY['Pop', 'Indie', 'Acoustic', 'Songwriting'], ARRAY['Guitar', 'Piano', 'Microphone'], true, true, 4.2, 8),
    ('11111111-1111-1111-1111-111111111112', 'artist', 2, 'Marcus Williams', 'Hip-hop artist and songwriter with 5+ years in the game. Known for clever wordplay and social commentary.', 'Atlanta, GA', NULL,
     ARRAY['Hip Hop', 'Rap', 'R&B', 'Freestyle'], ARRAY['Microphone', 'Headphones'], true, true, 4.7, 23),
    ('11111111-1111-1111-1111-111111111113', 'artist', 3, 'Sophia Rodriguez', 'Grammy-nominated vocalist specializing in Latin fusion and contemporary R&B. Available for features and collaborations.', 'Miami, FL', NULL,
     ARRAY['R&B', 'Latin', 'Pop', 'Spanish'], ARRAY['Professional Microphone', 'Audio Interface'], true, true, 4.9, 67),
    
    -- Producers
    ('22222222-2222-2222-2222-222222222221', 'producer', 1, 'Jake Thompson', 'Bedroom producer specializing in lo-fi beats and chill hop. Always experimenting with new sounds and textures.', 'Portland, OR', 45.00,
     ARRAY['Lo-fi', 'Chill Hop', 'Electronic', 'Beat Making'], ARRAY['Logic Pro X', 'MIDI Controller', 'Audio Interface'], true, true, 4.1, 12),
    ('22222222-2222-2222-2222-222222222222', 'producer', 2, 'Alex Kim', 'Professional producer with credits on streaming hits. Specializing in pop, hip-hop, and electronic music production.', 'Nashville, TN', 125.00,
     ARRAY['Pop Production', 'Hip Hop', 'Mixing', 'Sound Design'], ARRAY['Pro Tools', 'Universal Audio Interface', 'Genelec Monitors'], true, true, 4.6, 89),
    ('22222222-2222-2222-2222-222222222223', 'producer', 3, 'David Park', 'Multi-platinum producer and engineer. Worked with major label artists. Full production, mixing, and mastering services.', 'Los Angeles, CA', 300.00,
     ARRAY['Pop', 'R&B', 'Hip Hop', 'Mastering'], ARRAY['SSL Console', 'Pro Tools HDX', 'Neve Preamps'], true, true, 4.9, 156),
    
    -- Studios
    ('33333333-3333-3333-3333-333333333331', 'studio', 1, 'Sunset Sound Studio', 'Cozy home studio perfect for demos, podcasts, and small sessions. Great for indie artists and new musicians.', '1234 Vine St, Los Angeles, CA 90028', 75.00,
     NULL, ARRAY['Pro Tools', 'Audio-Technica Mics', 'Yamaha Monitors'], true, true, 4.0, 45),
    ('33333333-3333-3333-3333-333333333332', 'studio', 2, 'Electric Garden Studios', 'Professional recording facility with vintage gear and modern technology. Perfect for bands and solo artists.', '5678 Music Row, Nashville, TN 37203', 150.00,
     NULL, ARRAY['SSL Console', 'Vintage Neve', 'Pro Tools HDX'], true, true, 4.5, 123),
    ('33333333-3333-3333-3333-333333333333', 'studio', 3, 'Abbey Road West', 'World-class recording facility used by A-list artists. State-of-the-art equipment and acoustically perfect rooms.', '9999 Sunset Blvd, West Hollywood, CA 90069', 500.00,
     NULL, ARRAY['Neve 88RS Console', 'Pro Tools Ultimate', 'Neumann U47'], true, true, 4.9, 234)
ON CONFLICT (id) DO NOTHING;

-- Add studio rooms for studio accounts
UPDATE public.profiles SET rooms = '[
    {"name": "Main Room", "capacity": 4, "equipment": ["Pro Tools", "Audio-Technica AT2020", "Yamaha HS8"]},
    {"name": "Vocal Booth", "capacity": 2, "equipment": ["Neumann TLM 102", "Vocal Reflection Filter"]}
]'::jsonb WHERE id = '33333333-3333-3333-3333-333333333331';

UPDATE public.profiles SET rooms = '[
    {"name": "Studio A", "capacity": 8, "hourly_rate": 175, "equipment": ["SSL Console", "Vintage Neve 1073", "Pro Tools HDX"]},
    {"name": "Studio B", "capacity": 6, "hourly_rate": 125, "equipment": ["API Console", "Pro Tools", "Genelec Monitors"]},
    {"name": "Mixing Suite", "capacity": 3, "hourly_rate": 100, "equipment": ["Pro Tools HDX", "UAD Plugins", "Adam A7X"]}
]'::jsonb WHERE id = '33333333-3333-3333-3333-333333333332';

UPDATE public.profiles SET rooms = '[
    {"name": "Studio 1", "capacity": 12, "hourly_rate": 600, "equipment": ["Neve 88RS Console", "Pro Tools Ultimate", "ATC SCM50"]},
    {"name": "Studio 2", "capacity": 8, "hourly_rate": 450, "equipment": ["SSL 4000 G+", "Pro Tools HDX", "Neumann Monitors"]},
    {"name": "Vocal Suite", "capacity": 3, "hourly_rate": 350, "equipment": ["Neumann U47", "Manley VoxBox", "Pro Tools"]},
    {"name": "Mixing Room", "capacity": 4, "hourly_rate": 400, "equipment": ["Pro Tools Ultimate", "Dangerous Monitor", "Genelec 1038"]}
]'::jsonb WHERE id = '33333333-3333-3333-3333-333333333333';

-- Create some sample posts for tier 1 visibility
INSERT INTO public.posts (user_id, post_type, title, description, genre, visibility) VALUES
    ('11111111-1111-1111-1111-111111111111', 'track', 'Midnight Dreams', 'Latest indie pop track with dreamy guitar and vocals', 'Indie Pop', 'public'),
    ('22222222-2222-2222-2222-222222222221', 'beat', 'Chill Vibes Loop', 'Perfect lo-fi beat for studying or relaxing', 'Lo-fi', 'public'),
    ('11111111-1111-1111-1111-111111111112', 'collaboration', 'Looking for R&B Producer', 'Need someone to help with my next EP, R&B/Soul vibes', 'R&B', 'public')
ON CONFLICT DO NOTHING;

-- Create view for admin dashboard stats
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
    (SELECT COUNT(*) FROM public.profiles) as total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE tier_level = 1) as tier1_users,
    (SELECT COUNT(*) FROM public.profiles WHERE tier_level = 2) as tier2_users,
    (SELECT COUNT(*) FROM public.profiles WHERE tier_level = 3) as tier3_users,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'artist') as artists,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'producer') as producers,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'studio') as studios,
    (SELECT COUNT(*) FROM public.profiles WHERE verified = true) as verified_users,
    (SELECT COUNT(*) FROM public.invites WHERE status = 'available') as available_codes,
    (SELECT COUNT(*) FROM public.invites WHERE status = 'used') as used_codes,
    (SELECT COUNT(*) FROM public.bookings) as total_bookings,
    (SELECT COUNT(*) FROM public.bookings WHERE status = 'completed') as completed_bookings,
    (SELECT COUNT(*) FROM public.posts) as total_posts,
    (SELECT COALESCE(SUM(total_earnings), 0) FROM public.profiles) as total_earnings; 