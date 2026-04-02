-- Create events table
CREATE TABLE events (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source      TEXT NOT NULL CHECK (source IN ('eventbrite', 'scraper')),
    source_id   TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    start_at    TIMESTAMPTZ NOT NULL,
    end_at      TIMESTAMPTZ,
    venue_id    UUID REFERENCES venues (id),
    location    GEOGRAPHY(POINT, 4326) NOT NULL,
    category    TEXT DEFAULT 'OTHER',
    image_url   TEXT,
    ticket_url  TEXT,
    price_min   NUMERIC(10, 2),
    price_max   NUMERIC(10, 2),
    currency    TEXT DEFAULT 'EUR',
    tags        TEXT[] DEFAULT '{}',
    raw_data    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (source, source_id)
);

-- Indexes
CREATE INDEX idx_events_location ON events USING GIST (location);
CREATE INDEX idx_events_start_at ON events (start_at);
CREATE INDEX idx_events_category ON events (category);
CREATE INDEX idx_events_source_source_id ON events (source, source_id);

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for events"
    ON events
    FOR SELECT
    TO anon, authenticated
    USING (true);
