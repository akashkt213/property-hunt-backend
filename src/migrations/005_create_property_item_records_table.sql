CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_category') THEN
    CREATE TYPE item_category AS ENUM ('repair', 'replacement', 'mitigation');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_issue') THEN
    CREATE TYPE item_issue AS ENUM ('molds', 'pests', 'water_drainage', 'other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_status') THEN
    CREATE TYPE item_status AS ENUM ('open', 'remediated', 'unknown');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_source') THEN
    CREATE TYPE item_source AS ENUM (
      'landlord',
      'inspector',
      'government',
      'tenant_report',
      'system_import',
      'other'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_verification_status') THEN
    CREATE TYPE item_verification_status AS ENUM ('pending', 'verified', 'rejected');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS property_item_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES property(id) ON DELETE CASCADE,

  category item_category NOT NULL,
  issue item_issue NOT NULL,
  issue_detail VARCHAR(500),
  notes TEXT,
  status item_status NOT NULL,

  reported_at TIMESTAMPTZ,
  remediated_at TIMESTAMPTZ,

  source item_source NOT NULL,
  verification_status item_verification_status NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  verification_notes TEXT,

  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,

  amount NUMERIC(12, 2),
  external_reference VARCHAR(120),

  unit_label VARCHAR(50),

  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT chk_property_item_records_other_issue_detail
    CHECK (
      issue <> 'other'
      OR (
        issue_detail IS NOT NULL
        AND length(trim(issue_detail)) > 0
      )
    ),
  CONSTRAINT chk_property_item_records_remediated_at
    CHECK (status <> 'remediated' OR remediated_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_property_item_records_property_id
  ON property_item_records (property_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_property_item_records_property_status
  ON property_item_records (property_id, status)
  WHERE deleted_at IS NULL;
