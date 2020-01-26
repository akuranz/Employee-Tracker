DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employees(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
  -- FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (12.2),
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO employees (first_name, last_name)
VALUES ("John", "Doe"), ("Mike", "Chan"), ("Ashley", "Rodriguez");

INSERT INTO departments (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary)
VALUES ("Sales Lead", "100000"), ("Salesperson", "80000"), ("Lead Engineer", "150000"), ("Software Engineer", "120000"), ("Accountant", "125000"), ("Legal Team Lead", "250000"), ("Lawyer", "190000");

-- ALTER TABLE roles ADD FOREIGN KEY department_id (department_id) REFERENCES roles(id);


SELECT * FROM employees;
SELECT * FROM departments;
SELECT * FROM roles;