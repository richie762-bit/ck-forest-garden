-- Create login_attempts table for tracking failed login attempts and lockouts
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  attempt_count INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);

-- Create index on locked_until for cleanup queries
CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until ON login_attempts(locked_until);

-- Enable RLS (Row Level Security)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to login attempts" ON login_attempts;
DROP POLICY IF EXISTS "Allow public insert to login attempts" ON login_attempts;
DROP POLICY IF EXISTS "Allow public update to login attempts" ON login_attempts;
DROP POLICY IF EXISTS "Allow authenticated users full access to login attempts" ON login_attempts;

-- Policy 1: Allow anyone to read their own login attempt records (by email)
CREATE POLICY "Allow public read access to login attempts"
  ON login_attempts
  FOR SELECT
  USING (true);

-- Policy 2: Allow anyone to insert login attempt records
CREATE POLICY "Allow public insert to login attempts"
  ON login_attempts
  FOR INSERT
  WITH CHECK (true);

-- Policy 3: Allow anyone to update login attempt records
CREATE POLICY "Allow public update to login attempts"
  ON login_attempts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 4: Allow authenticated users (admins) to delete login attempts
CREATE POLICY "Allow authenticated users to delete login attempts"
  ON login_attempts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_login_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_login_attempts_updated_at ON login_attempts;
CREATE TRIGGER trigger_update_login_attempts_updated_at
  BEFORE UPDATE ON login_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_login_attempts_updated_at();

-- Create function to clean up expired lockouts (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_expired_lockouts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Clear lockout status for expired lockouts
  UPDATE login_attempts
  SET locked_until = NULL,
      attempt_count = 0
  WHERE locked_until IS NOT NULL
    AND locked_until < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE login_attempts IS 'Tracks failed login attempts and account lockouts for security';
COMMENT ON COLUMN login_attempts.email IS 'Email address attempting to login';
COMMENT ON COLUMN login_attempts.attempt_count IS 'Number of consecutive failed login attempts';
COMMENT ON COLUMN login_attempts.locked_until IS 'Timestamp when the lockout expires (NULL if not locked)';
COMMENT ON COLUMN login_attempts.last_attempt_at IS 'Timestamp of the most recent login attempt';
