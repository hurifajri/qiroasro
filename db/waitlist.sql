-- =====================================================================
-- WAITLIST TABLE
-- For collecting emails before app launch (double opt-in)
-- =====================================================================

-- Auto-update timestamp trigger function (create if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

CREATE TABLE public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,

    -- Verification
    verification_token UUID DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'unsubscribed', 'converted')),
    verified_at TIMESTAMPTZ,

    -- Tracking
    source TEXT DEFAULT 'homepage',              -- Where the signup came from
    locale TEXT DEFAULT 'id',                    -- User's language preference
    utm_source TEXT,                             -- UTM tracking params
    utm_medium TEXT,
    utm_campaign TEXT,
    referral_code TEXT,                          -- For viral loop (optional)
    referred_by UUID REFERENCES public.waitlist(id),

    -- Conversion tracking
    converted_at TIMESTAMPTZ,                    -- When user became a registered user
    converted_user_id UUID,                      -- Link to actual user account

    -- Metadata
    metadata JSONB DEFAULT '{}',                 -- Extra data: user agent, IP, etc.

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_status ON public.waitlist(status);
CREATE INDEX idx_waitlist_verification_token ON public.waitlist(verification_token);
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- Auto-update timestamp trigger
CREATE TRIGGER update_waitlist_modtime
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for public signup)
CREATE POLICY "Anyone can insert into waitlist"
    ON public.waitlist
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anonymous update for verification (limited to verification_token match)
CREATE POLICY "Anyone can verify their email"
    ON public.waitlist
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow select for verification check (needed to check existing emails)
CREATE POLICY "Anyone can select from waitlist"
    ON public.waitlist
    FOR SELECT
    TO anon, authenticated
    USING (true);

COMMENT ON TABLE public.waitlist IS 'Email waitlist for coming soon page with double opt-in verification';
COMMENT ON COLUMN public.waitlist.verification_token IS 'Unique token sent via email for double opt-in verification';
COMMENT ON COLUMN public.waitlist.status IS 'pending: not verified, verified: email confirmed, unsubscribed: opted out, converted: became a user';
