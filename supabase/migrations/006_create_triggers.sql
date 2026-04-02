-- Trigger function: track event changes for realtime
CREATE OR REPLACE FUNCTION notify_event_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_change_type TEXT;
    v_payload     JSONB;
    v_event_id    UUID;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_change_type := 'insert';
        v_event_id    := NEW.id;
        v_payload     := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_change_type := 'update';
        v_event_id    := NEW.id;
        v_payload     := jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        v_change_type := 'delete';
        v_event_id    := OLD.id;
        v_payload     := to_jsonb(OLD);
    END IF;

    INSERT INTO event_changes (event_id, change_type, payload)
    VALUES (v_event_id, v_change_type, v_payload);

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_events_change
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW
    EXECUTE FUNCTION notify_event_change();

-- Trigger function: auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
