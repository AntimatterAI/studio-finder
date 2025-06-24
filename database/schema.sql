-- Create invites table
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    code_type TEXT NOT NULL DEFAULT 'artist' CHECK (code_type IN ('artist', 'producer', 'studio', 'admin')),
    status TEXT NOT NULL CHECK (status IN ('approved', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT CHECK (role IN ('artist', 'producer')),
    display_name TEXT,
    skills TEXT[],
    media_urls TEXT[],
    socials JSONB,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for invites table
-- Allow anyone to read invites for validation during registration
CREATE POLICY "Anyone can read invites for validation" ON public.invites
    FOR SELECT USING (true);

-- Only authenticated users can update invite status
CREATE POLICY "Authenticated users can update invite status" ON public.invites
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for profiles table
-- Users can view all profiles (for discovery)
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);
CREATE INDEX IF NOT EXISTS idx_invites_code_type ON public.invites(code_type);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_invites_updated_at
    BEFORE UPDATE ON public.invites
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Update existing invites table if it already exists (migration)
DO $$
BEGIN
    -- Add code_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' 
        AND column_name = 'code_type'
    ) THEN
        ALTER TABLE public.invites ADD COLUMN code_type TEXT NOT NULL DEFAULT 'artist' CHECK (code_type IN ('artist', 'producer', 'studio', 'admin'));
        CREATE INDEX IF NOT EXISTS idx_invites_code_type ON public.invites(code_type);
    END IF;
END $$;

-- Insert some sample invite codes for testing with different types
INSERT INTO public.invites (code, code_type, status) VALUES 
    ('ART2024', 'artist', 'approved'),
    ('PROD001', 'producer', 'approved'),
    ('SPACE100', 'studio', 'approved'),
    ('ADMIN001', 'admin', 'approved')
ON CONFLICT (code) DO NOTHING; 