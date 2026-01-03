-- Drop tables in reverse dependency order to ensure clean reset
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS shared_trips CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS attractions CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    photo_url VARCHAR,
    phone_number VARCHAR,
    city VARCHAR,
    country VARCHAR,
    additional_info TEXT,
    language VARCHAR,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ix_users_email ON users(email);

-- 2. Cities
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    region VARCHAR,
    cost_index INTEGER,
    popularity INTEGER,
    image_url VARCHAR
);

-- 3. Attractions
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    type VARCHAR,
    description VARCHAR,
    cost NUMERIC(12, 2) DEFAULT 0,
    rating NUMERIC(3, 2),
    image_url VARCHAR
);

CREATE INDEX ix_attractions_city_id ON attractions(city_id);

-- 4. Trips
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    cover_photo_url VARCHAR,
    budget NUMERIC(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ix_trips_user_id ON trips(user_id);

-- 5. Stops
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id INTEGER NOT NULL REFERENCES cities(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    order_index INTEGER DEFAULT 0,
    stay_cost NUMERIC(12, 2) DEFAULT 0,
    transport_cost NUMERIC(12, 2) DEFAULT 0,
    meals_cost NUMERIC(12, 2) DEFAULT 0
);

CREATE INDEX ix_stops_trip_id ON stops(trip_id);
CREATE INDEX ix_stops_city_id ON stops(city_id);

-- 6. Activities
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    type VARCHAR,
    start_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    cost NUMERIC(12, 2) DEFAULT 0,
    notes TEXT
);

CREATE INDEX ix_activities_stop_id ON activities(stop_id);

-- 7. Expenses
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    expense_date DATE,
    category VARCHAR NOT NULL,
    amount NUMERIC(12, 2) DEFAULT 0,
    notes TEXT
);

CREATE INDEX ix_expenses_trip_id ON expenses(trip_id);
CREATE INDEX ix_expenses_expense_date ON expenses(expense_date);

-- 8. Shared Trips
CREATE TABLE shared_trips (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE UNIQUE,
    share_id VARCHAR NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ix_shared_trips_trip_id ON shared_trips(trip_id);
CREATE INDEX ix_shared_trips_share_id ON shared_trips(share_id);

-- 9. Community Posts
CREATE TABLE community_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ix_community_posts_user_id ON community_posts(user_id);
