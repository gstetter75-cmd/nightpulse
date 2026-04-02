-- Create venues table
CREATE TABLE venues (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT NOT NULL,
    address    TEXT,
    city       TEXT NOT NULL,
    location   GEOGRAPHY(POINT, 4326) NOT NULL,
    website    TEXT,
    image_url  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_venues_location ON venues USING GIST (location);
CREATE INDEX idx_venues_city ON venues (city);

-- Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for venues"
    ON venues
    FOR SELECT
    TO anon, authenticated
    USING (true);
