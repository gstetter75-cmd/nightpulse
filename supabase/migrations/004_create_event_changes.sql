-- Create event_changes table for realtime change tracking
CREATE TABLE event_changes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id    UUID REFERENCES events (id) ON DELETE CASCADE,
    change_type TEXT NOT NULL CHECK (change_type IN ('insert', 'update', 'delete')),
    changed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload     JSONB
);

-- Row Level Security
ALTER TABLE event_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for event_changes"
    ON event_changes
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Add to Supabase realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE event_changes;
