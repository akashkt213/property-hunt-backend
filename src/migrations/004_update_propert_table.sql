DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'property'
      AND column_name = 'images'
  ) THEN
    ALTER TABLE property
      ADD COLUMN images JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;
