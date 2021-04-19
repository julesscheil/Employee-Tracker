CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
id INT,
name VARCHAR(30),
PRIMARY KEY(ID)
);

CREATE TABLE role (
id INT,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
PRIMARY KEY(id)
);

CREATE TABLE employee (
id INT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY(id)
);

INSERT INTO department (name)
VALUES ("Analytics"),("Data Science"), ("Accounting"), ("HR"),("Engineering");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 4),("Jane", "Doe", 2, 4),("Rick", "Thomas", 3),("Kerry", "Becker", 4),("Brent", "Hankins", 5, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Data Analyst", 75000.00, 1),("Data Scientist", 80000.00, 2), ("Accountant", 110000.00, 3), ("HR", 50000.00, 4),("Software Engineer", 85000.00, 5);
