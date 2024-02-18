DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  cardholder VARCHAR(225) NOT NULL,
  card_number VARCHAR(225) NOT NULL,
  city VARCHAR(225) NOT NULL,
  country VARCHAR(225) NOT NULL,
  email VARCHAR(225) NOT NULL,
  expire_date VARCHAR(7) NOT NULL, -- "MM/YYYY" format
  state_province VARCHAR(225) NOT NULL,
  post_code VARCHAR(225) NOT NULL,
  street_address VARCHAR(225) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(225) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  inventory INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date_of_order DATE NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (order_id, product_id)
);

-- Index for improving date-based query performance
CREATE INDEX idx_orders_date ON orders(date_of_order);

-- Index for improving user-based query performance
CREATE INDEX idx_orders_user ON orders(user_id);
