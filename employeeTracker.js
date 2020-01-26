var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "akuranz_1987",
  database: "employeeTracker_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

const start = () => {
  inquirer
    .prompt({
      name: "userInput",
      type: "list",
      message: "Would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role"
      ]
    })
    .then(({ userInput }) => {
      switch (userInput) {
        case "View All Employees":
          return returnAllEmp();
        case "View All Employees by Department":
          return returnAllEmpDept();
        case "View All Employees by Manager":
          return returnAllEmpMngr();
        case "Add Employee":
          return addEmp();
        case "Remove Employee":
          return removeEmp();
        case "Update Employee Role":
          return updateEmpRole();
      }
      connection.end();
    });
};

const returnAllEmp = () => {
  console.log("Return All Employees");

  query = connection.query(
    // "SELECT employees.id, employees.first_name, employees.last_name, role.title FROM employees JOIN roles ON employees.role_id = roles.id",
    "SELECT id, first_name, last_name FROM employees",
    // "SELECT title FROM roles",
    function(err, res) {
      if (err) throw err;
      // console.log(res);
      const table = cTable.getTable(res);
      console.log(`\n${table}`);
    }
  );
  // console.log(query.sql);

  start();
};

const returnAllEmpDept = () => {
  console.log("Return All Employees by Department");
  start();
};

const returnAllEmpMngr = () => {
  console.log("Return All Employees by Manager");
  start();
};

const removeEmp = () => {
  console.log("Remove an Employee");
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        message: "Which employee do you want to remove?",
        name: "employeeName",
        choices: function() {
          var employeeArray = [];
          for (var i = 0; i < res.length; i++) {
            employeeArray.push(res[i].first_name + " " + res[i].last_name);
          }
          return employeeArray;
        }
      }
    ]);
    start();
  });
};

const addEmp = () => {
  console.log("Add an Employee");
  //join with manager to return manager list for last question
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        message: "What is your employee's first name?",
        name: "empFName"
      },
      {
        type: "input",
        message: "What is your employee's last name?",
        name: "empLName"
      },
      {
        type: "list",
        message: "What is your employee's role?",
        name: "empRole",
        choices: function() {
          var roleArray = [];
          for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
          }
          return roleArray;
        }
      },
      {
        type: "input",
        message: "Who is your employee's manager?",
        name: "empMngr"
        //Need to add choices array
      }
    ]);
    //.then(add function from a class that adds employees)
    start();
  });
};

const updateEmpRole = () => {
  console.log("Update an Employee");
  start();
};
