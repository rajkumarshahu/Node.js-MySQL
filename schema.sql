DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(11) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JavaScript: The Good Parts", "Books", 25.62, 137),
  ("Shadow of the Tomb Raider", "Video Games", 29.99, 177),
  ("CYBERPOWERPC Gamer Xtreme ", "Computers", 1099.99, 31),
  ("Tea Tree Body & Foot Scrub", "Beauty Store", 14.99, 59),
  ("LEGO Marvel Super Heroes Avengers", "Toys and Games", 31.97, 89),
  ("Pullover Hoody Sweatshirt", "Fashion", 101.99, 92),
  ("Nintendo Switch Console", "Video Games", 399.99, 33),
  ("Dark Age", "Books", 52.91, 11),
  ("Razer Blade 15 Gaming Laptop", "Computers", 2691.21, 3),
  ("Gary Games GGS 001", "Toys and Games", 39.77, 55);