-- Migration: Add image_url to cities and create attractions table

ALTER TABLE cities ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS attractions (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  rating NUMERIC(3,2),
  image_url TEXT
);

CREATE INDEX IF NOT EXISTS ix_attractions_city_id ON attractions (city_id);
