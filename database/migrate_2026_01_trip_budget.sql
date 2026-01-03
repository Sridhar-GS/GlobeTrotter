-- Migration: Add budget to trips table

ALTER TABLE trips ADD COLUMN IF NOT EXISTS budget NUMERIC(12, 2);
