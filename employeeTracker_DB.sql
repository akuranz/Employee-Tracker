DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO departments (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (12.2),
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", "100000", 1), ("Salesperson", "80000", 1), ("Lead Engineer", "150000", 2), ("Software Engineer", "120000", 2), ("Accountant", "125000", 3), ("Legal Team Lead", "250000", 4), ("Lawyer", "190000", 4);

CREATE TABLE employees(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE managers(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("John", "Doe", 1), ("Mike", "Chan", 2), ("Ashley", "Rodriguez", 3), ("Kevin", "Tupik", 4), ("Malia", "Brown", 5), ("Sarah", "Lourd", 6), ("Tom", "Allen", 7), ("Christian", "Eckinrode", 3);


SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;
SELECT * FROM managers;