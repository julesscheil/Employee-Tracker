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

-- to get main employee table,name in manager spot not id
select a.first_name, a.last_name, title, department_id, salary, d.concatName
from employee_db.employee a
left join employee_db.role b on a.role_id=b.id
left join employee_db.department c on b.department_id=c.id
left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id
from employee_db.employee a
inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id

-- to view employees by department
select a.id, a.name, b.first_name, b.last_name, c.title, c.salary, concatName from department a
left join role c on a.id = c.department_id
left join employee b on c.id = b.role_id
left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id
from employee_db.employee a
inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id