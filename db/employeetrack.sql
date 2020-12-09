DROP DATABASE IF EXISTS companyDB;
CREATE database companyDB;

USE companyDB;

CREATE TABLE department (

  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)

);

CREATE TABLE role (

  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT(10) NOT NULL,
  PRIMARY KEY (id)

);

CREATE TABLE employee (

  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(10) NOT NULL,
  manager_id INT(10) NULL,
  PRIMARY KEY (id)

);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

--- JOINS ---

SELECT ---.---, ---.---
FROM ---
INNER JOIN --- ON ---.--- = ---.---;