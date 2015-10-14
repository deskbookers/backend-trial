-- Structure

CREATE TABLE venues (
	id integer PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE items (
	id integer PRIMARY KEY AUTOINCREMENT,
	venue_id integer NOT NULL,
	name VARCHAR(255) NOT NULL,
	FOREIGN KEY (venue_id) REFERENCES venues (id)
);

CREATE TABLE spaces (
	id integer PRIMARY KEY AUTOINCREMENT,
	item_id integer NOT NULL,
	hour_price real NOT NULL,
	FOREIGN KEY (item_id) REFERENCES items (id)
);

CREATE TABLE products (
	id integer PRIMARY KEY AUTOINCREMENT,
	item_id integer NOT NULL,
	price real NOT NULL,
	FOREIGN KEY (item_id) REFERENCES items (id)
);

CREATE TABLE users (
	id integer PRIMARY KEY AUTOINCREMENT,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	registered integer NOT NULL DEFAULT 0,
	email VARCHAR(255) NOT NULL
);

CREATE TABLE bookers (
	id integer PRIMARY KEY AUTOINCREMENT,
	user_id integer NOT NULL,
	created integer NOT NULL DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE bookings (
	id integer PRIMARY KEY AUTOINCREMENT,
	booker_id integer NOT NULL,
	created integer NOT NULL DEFAULT 0,
	FOREIGN KEY (booker_id) REFERENCES bookers (id)
);

CREATE TABLE bookingitems (
	id integer PRIMARY KEY AUTOINCREMENT,
	booking_id integer NOT NULL,
	item_id integer NOT NULL,
	quantity integer NOT NULL,
	locked_piece_price real NOT NULL,
	locked_total_price real NOT NULL,
	start_timestamp integer NULL,
	end_timestamp integer NULL,
	FOREIGN KEY (booking_id) REFERENCES bookings (id),
	FOREIGN KEY (item_id) REFERENCES items (id)
);
