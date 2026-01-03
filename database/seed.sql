INSERT INTO cities (name, country, region, cost_index, popularity) VALUES
  ('Paris', 'France', 'Europe', 85, 95),
  ('London', 'United Kingdom', 'Europe', 90, 92),
  ('Rome', 'Italy', 'Europe', 75, 88),
  ('New York', 'United States', 'North America', 95, 94),
  ('Tokyo', 'Japan', 'Asia', 88, 93)
ON CONFLICT (name, country) DO NOTHING;
