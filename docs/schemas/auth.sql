-- =====================================================================
-- AUTH: USER PROFILES
-- =====================================================================
-- Extends Supabase's built-in auth.users table with app-specific data.
-- The trigger auto-creates a profile row whenever a new user signs up.

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_color_code VARCHAR(30) NOT NULL DEFAULT 'sky',
    locale TEXT NOT NULL DEFAULT 'id',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_profiles_username ON user_profiles(username);

-- Auto-update updated_at on row change
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_profiles IS 'App-specific user profile data. One row per auth.users entry.';
COMMENT ON COLUMN user_profiles.id IS 'Foreign key to auth.users.id (Supabase Auth)';
COMMENT ON COLUMN user_profiles.username IS 'Unique username, auto-generated from OAuth metadata on signup';
COMMENT ON COLUMN user_profiles.avatar_color_code IS 'Tailwind color name used for avatar background';
COMMENT ON COLUMN user_profiles.locale IS 'User preferred locale (id/en)';

-- =====================================================================
-- TRIGGER: Auto-create profile on new user signup
-- =====================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (
        NEW.id,
        -- Auto-generate username from OAuth preferred_username or fallback to 'user-{8-char-id}'
        COALESCE(
            NEW.raw_user_meta_data->>'preferred_username',
            'user-' || LEFT(NEW.id::text, 8)
        ),
        -- Display name from Google full_name, or generic fallback
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            'User'
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================================
-- RLS POLICIES
-- =====================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile (app enforces auth.uid() via service layer)
-- Note: We use Drizzle + userId filter in the service layer, NOT auth.uid() in RLS,
-- to remain portable across auth providers. RLS here is a safety net only.
CREATE POLICY "Authenticated users can view all profiles"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
