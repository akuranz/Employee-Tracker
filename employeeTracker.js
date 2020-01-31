var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "akuranz_1987",
  database: "employeetracker_DB"
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
        // case "View All Employees by Manager":
        //   return returnAllEmpMngr();
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
  // console.log("Return All Employees");

  query = connection.query(
    // "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.department_id, employees.manager_id FROM employees JOIN roles ON employees.role_id = roles.id",
    // "SELECT employees.id, employees.first_name, employees.last_name, roles.title, salary, department_id FROM employees JOIN roles ON employees.role_id = roles.department_id",
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, managers.first_name AS ManagerFirstName FROM employees JOIN roles ON employees.role_id = roles.id JOIN managers ON employees.manager_id = managers.id",
    // "SELECT employees.id, employees.first_name, employees.last_name, managers.first_name AS ManagerFirstName FROM employees JOIN managers ON employees.manager_id = managers.id",
    // console.log(employees.first_name),
    function(err, res) {
      if (err) throw err;
      // console.log(res);
      const table = cTable.getTable(res);
      console.log(`\n${table}`);
      connection.end();
    }
  );
  console.log(query.sql);
};

const returnAllEmpDept = () => {
  // connection
  //   .query(
  inquirer
    .prompt([
      {
        type: "input", //should be a list
        message: "Department Name:",
        name: "departmentName"
        //   choices: function() {
        //     var rolesArray = [];
        //     for (var i = 0; i < res.length; i++) {
        //       rolesArray.push(res[i].department_id);
        //     }
        //     return rolesArray;
        //   }
      }
    ])
    // )
    .then(answer => {
      query = connection.query(
        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.department_id, employees.manager_id FROM employees JOIN roles ON employees.role_id = roles.id WHERE roles.department_id=?",
        [answer.departmentName],
        function(err, res) {
          if (err) throw err;

          // console.log(res);
          const table = cTable.getTable(res);
          console.log(`\n${table}`);
          connection.end();
        }
      );
      console.log(query.sql);
    });
};

const returnAllEmpMngr = () => {
  // console.log("Return All Employees by Manager");
};

const removeEmp = () => {
  // console.log("Remove an Employee");
  connection.query("SELECT first_name FROM employees", function(err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list", //should be list
          name: "employeeName",
          choices: function() {
            var employeeArray = [];
            for (var i = 0; i < res.length; i++) {
              employeeArray.push(res[i].first_name);
            }
            return employeeArray;
          },
          message: "Which employee do you want to remove?"
        }
      ])
      .then(answer => {
        connection.query(
          "DELETE FROM employees WHERE ?",
          [
            {
              first_name: answer.employeeName
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products deleted!\n");
            // Call readProducts AFTER the DELETE completes
            readProducts();
          }
        );
      });
  });
};

const addEmp = () => {
  inquirer
    .prompt([
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
        type: "input",
        message: "What is your employee's role?",
        name: "empRole"
        // choices: function() {
        //   var roleArray = [];
        //   for (var i = 0; i < res.length; i++) {
        //     roleArray.push(res[i].title);
        //   }
        //   return roleArray;
        // }
      },
      {
        type: "input",
        message: "Who is your employee's manager?",
        name: "empMngr"
        //Need to add choices array
      }
    ])
    .then(answer => {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.empFName,
          last_name: answer.empLName
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee was added successfully!");
          // console.log(res.affectedRows + " employees added!\n");
          readProducts();
        }
      );
    });
};

const updateEmpRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your employee's role_id?",
        name: "empRoleID"
      },
      {
        type: "input",
        message: "What is your employee's last name?",
        name: "empLName"
      }
    ])
    .then(answer => {
      connection.query(
        "UPDATE employees SET ? WHERE ?",
        [
          {
            last_name: answer.emplName
          },
          {
            role_id: answer.empRoleID
          }
        ],
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employees updated!\n");
          readProducts();
          // start();
        }
      );
    });
};

const readProducts = () => {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // console.log(res);
    const table = cTable.getTable(res);
    console.log(`\n${table}`);
    connection.end();
  });
};
