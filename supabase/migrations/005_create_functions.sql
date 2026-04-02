-- Find events within a radius (km) from a given point
CREATE OR REPLACE FUNCTION find_events_in_radius(
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    radius_km       DOUBLE PRECISION DEFAULT 25,
    from_date       TIMESTAMPTZ DEFAULT now(),
    category_filter TEXT DEFAULT NULL
)
RETURNS SETOF events
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM events
    WHERE ST_DWithin(
              location,
              ST_SetSRID(ST_MakePoint(lng, lat), 4326)::GEOGRAPHY,
              radius_km * 1000  -- convert km to meters
          )
      AND start_at >= from_date
      AND (category_filter IS NULL OR category = category_filter)
    ORDER BY start_at ASC;
$$;

-- Return upcoming events ordered by start time
CREATE OR REPLACE FUNCTION upcoming_events(
    limit_count INTEGER DEFAULT 20
)
RETURNS SETOF events
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM events
    WHERE start_at >= now()
    ORDER BY start_at ASC
    LIMIT limit_count;
$$;

-- Upsert an event with automatic GEOGRAPHY conversion from lat/lng
CREATE OR REPLACE FUNCTION upsert_event(
    p_source      TEXT,
    p_source_id   TEXT,
    p_title       TEXT,
    p_lat         DOUBLE PRECISION,
    p_lng         DOUBLE PRECISION,
    p_start_at    TIMESTAMPTZ,
    p_end_at      TIMESTAMPTZ DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_venue_id    UUID DEFAULT NULL,
    p_category    TEXT DEFAULT 'OTHER',
    p_image_url   TEXT DEFAULT NULL,
    p_ticket_url  TEXT DEFAULT NULL,
    p_price_min   NUMERIC DEFAULT NULL,
    p_price_max   NUMERIC DEFAULT NULL,
    p_currency    TEXT DEFAULT 'EUR',
    p_tags        TEXT[] DEFAULT '{}',
    p_raw_data    JSONB DEFAULT NULL
)
RETURNS events
LANGUAGE plpgsql
AS $$
DECLARE
    v_location GEOGRAPHY(POINT, 4326);
    v_result   events;
BEGIN
    v_location := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::GEOGRAPHY;

    INSERT INTO events (
        source, source_id, title, description, start_at, end_at,
        venue_id, location, category, image_url, ticket_url,
        price_min, price_max, currency, tags, raw_data
    )
    VALUES (
        p_source, p_source_id, p_title, p_description, p_start_at, p_end_at,
        p_venue_id, v_location, p_category, p_image_url, p_ticket_url,
        p_price_min, p_price_max, p_currency, p_tags, p_raw_data
    )
    ON CONFLICT (source, source_id)
    DO UPDATE SET
        title       = EXCLUDED.title,
        description = EXCLUDED.description,
        start_at    = EXCLUDED.start_at,
        end_at      = EXCLUDED.end_at,
        venue_id    = EXCLUDED.venue_id,
        location    = EXCLUDED.location,
        category    = EXCLUDED.category,
        image_url   = EXCLUDED.image_url,
        ticket_url  = EXCLUDED.ticket_url,
        price_min   = EXCLUDED.price_min,
        price_max   = EXCLUDED.price_max,
        currency    = EXCLUDED.currency,
        tags        = EXCLUDED.tags,
        raw_data    = EXCLUDED.raw_data,
        updated_at  = now()
    RETURNING * INTO v_result;

    RETURN v_result;
END;
$$;
