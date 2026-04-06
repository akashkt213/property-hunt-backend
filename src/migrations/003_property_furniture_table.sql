CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'furniture_condition') THEN
        CREATE TYPE furniture_condition AS ENUM ('NEW', 'GOOD', 'FAIR', 'POOR');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS property_furniture (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id         UUID NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    furniture_name      VARCHAR(255) NOT NULL,
    category            VARCHAR(100),
    room                VARCHAR(100),
    purchase_date       DATE,
    furniture_condition furniture_condition NOT NULL DEFAULT 'GOOD',
    purchase_price      DECIMAL(10,2),
    attachments         JSONB DEFAULT '[]',
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);