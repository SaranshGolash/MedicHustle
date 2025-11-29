CREATE TABLE users (
id UUID PRIMARY KEY,
name TEXT,
email TEXT UNIQUE NOT NULL,
password_hash TEXT,
is_admin BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE TABLE departments (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
short_code TEXT
);


CREATE TABLE bookings (
id UUID PRIMARY KEY,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
department_id INTEGER REFERENCES departments(id),
token TEXT,
preferred_time TIMESTAMP NULL,
status TEXT DEFAULT 'waiting', -- waiting, serving, done, cancelled
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
served_at TIMESTAMP WITH TIME ZONE
);


-- sample data
INSERT INTO departments(name, short_code) VALUES('General Medicine','GM'),('Pediatrics','PD'),('Orthopedics','OR');