DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(225) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(225) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  inventory INTEGER NOT NULL DEFAULT 0
);

-- products data
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT,
  cardholder VARCHAR(225) NOT NULL,
  card_number VARCHAR(225) NOT NULL,
  city VARCHAR(225) NOT NULL,
  country VARCHAR(225) NOT NULL,
  email VARCHAR(225) NOT NULL,
  expire_date VARCHAR(7) NOT NULL, -- "MM/YYYY" format
  state_province VARCHAR(225) NOT NULL,
  post_code VARCHAR(225) NOT NULL,
  street_address VARCHAR(225) NOT NULL,
  date_of_order DATE NOT NULL,
  subtotal VARCHAR(225) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);



CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
-- Contact Table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Review Table
CREATE TABLE reviews (
    user_id INT,
    product_id INT,
    review TEXT,
    review_rate INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    -- Add FOREIGN KEY constraint for product_id once you have a Products table
);

-- Index for improving date-based query performance
CREATE INDEX idx_orders_date ON orders(date_of_order);

-- Index for improving user-based query performance
CREATE INDEX idx_orders_user ON orders(user_id);
