var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "akuranz_1987",
  database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

// function which prompts the user for what action they should take
const start = () => {
  inquirer
    .prompt({
      name: "userInput",
      type: "list",
      message: "Would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager"
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
      }
      connection.end();
    });
};

const returnAllEmp = () => {
  console.log("Return All Employees");

  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // console.log(res);
    const table = cTable.getTable(res);
    console.log(`\n${table}`);
  });

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
