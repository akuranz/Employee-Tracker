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

const query = (query, data = []) =>
  new Promise((resolve, reject) => {
    connection.query(query, data, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

// query
//   .then(result => {
//     console.log(result)
//   })
//   .catch(error => {
//     console.log(error)
//   })
// const getQuery = async () => {
//   try {
//     const result = await query('SELECT * FROM ??', ['table'])
//   } catch (error) {
//     console.log(error)
//   }
// }

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
          return returnAllEmpDept(); /// OR es6 variant
        // case "View All Employees by Manager":
        //   return returnAllEmpMngr();
        case "Add Employee":
          return addEmp();
        case "Add Role":
          return addRole();
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

  let query = connection.query(
    `SELECT 
    employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.title, 
    roles.salary,
    managers.first_name AS ManagerFirstName    
    FROM 
      employees 
    LEFT JOIN 
      roles 
    ON 
      employees.role_id = roles.id
    LEFT JOIN
      managers
    ON
      employees.manager_id = managers.id`,
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

//ES6 Async Await Promises
const returnAllEmpDeptES6 = async () => {
  try {
    const departments = await query(
      "SELECT DISTINCT name, id FROM departments"
    );
    const { departmentID } = await inquirer.prompt([
      {
        type: "list", //should be a list
        message: "Department Name:",
        name: "departmentID",
        choices: function() {
          var deptArray = [];
          for (var i = 0; i < departments.length; i++) {
            deptArray.push({
              name: departments[i].name,
              value: departments[i].id
            });
          }
          return deptArray;
        }
      }
    ]);
    const qryStr = `SELECT 
                      employees.id,
                      employees.first_name, 
                      employees.last_name, 
                      employees.manager_id, 
                      roles.title, 
                      roles.salary, 
                      departments.name as department
                    FROM 
                      employees 
                    LEFT JOIN 
                      roles 
                    ON 
                      employees.role_id = roles.id 
                    LEFT JOIN
                      departments
                    ON
                      roles.department_id = departments.id
                    WHERE
                      departments.id = ?`;
    const response = await query(qryStr, [departmentID]);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const returnAllEmpDept = () => {
  connection.query("SELECT DISTINCT name FROM departments", function(err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list", //should be a list
          message: "Department Name:",
          name: "departmentName",
          choices: function() {
            var deptArray = [];
            for (var i = 0; i < res.length; i++) {
              deptArray.push(res[i].name);
            }
            return deptArray;
          }
        }
      ])
      // )
      .then(answer => {
        query = connection.query(
          `SELECT 
            employees.id, 
            employees.first_name, 
            employees.last_name, 
            employees.manager_id, 
            roles.title, 
            roles.salary, 
            departments.name as department
          FROM 
            employees 
          LEFT JOIN 
            roles 
          ON 
            employees.role_id = roles.id 
          LEFT JOIN 
            departments 
          ON 
            roles.department_id = departments.id 
          WHERE 
            departments.name=?`,
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
  });
};

const returnAllEmpMngr = () => {
  // add manager join
};

const removeEmp = () => {
  // console.log("Remove an Employee");
  connection.query(
    `SELECT 
      first_name 
    FROM 
      employees`,
    function(err, res) {
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
    }
  );
};

const addEmpES6 = async () => {
  try {
    const roles = await query("SELECT title, id FROM roles");
    const managers = await query(
      "SELECT first_name, last_name, id FROM managers"
    );
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is your employee's first name?",
        name: "first_name"
      },
      {
        type: "input",
        message: "What is your employee's last name?",
        name: "last_name"
      },
      {
        type: "list",
        message: "What is your employee's role?",
        name: "role_id",
        choices: roles.map(role => ({
          name: role.title,
          value: role.id
        }))
        // choices: function() {
        //   var roleArray = [];
        //   for (var i = 0; i < roles.length; i++) {
        //     roleArray.push({
        //       name: roles[i].title,
        //       values: roles[i].id
        //     });
        //   }
        //   return roleArray;
        // }
      },
      {
        type: "list",
        message: "Who is your employee's manager?",
        name: "manager_id",
        choices: managers.map(mngr => ({
          name: mngr.first_name + " " + mngr.last_name,
          value: mngr.id
        }))
      }
    ]);

    const qryStr = `INSERT INTO employees SET ?`;
    const result = await query(qryStr, answers);
    console.log(answers, result);
  } catch (error) {
    console.log(error);
  }
};

const addEmp = () => {
  connection.query(
    `SELECT  
      roles.title, 
      roles.id,
      departments.id,
      departments.name
    FROM 
      roles
    LEFT JOIN 
      departments
    ON 
      roles.department_id = departments.id`,
    function(err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is your employee's first name?",
            name: "last_name"
          },
          {
            type: "input",
            message: "What is your employee's last name?",
            name: "first_name"
          },
          {
            type: "list",
            message: "What is your employee's role?",
            name: "role_id",
            choices: res.map(role => ({
              name: role.title,
              value: role.id
            }))
          },
          {
            type: "list",
            message: "What is your employee's department?",
            name: "name",
            choices: res.map(department => ({
              name: department.name,
              value: department.id
            }))
          }
          // {
          //   type: "list",
          //   message: "Who is your employee's manager?",
          //   name: "manager_id",
          //   choices: managers.map(mngr => ({
          //     name: mngr.first_name + " " + mngr.last_name,
          //     value: mngr.id
          //   }))
          // }
        ])
        .then(answer => {
          console.log(answer);
          connection.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id
            },
            function(err) {
              if (err) throw err;
            }
          );
          return answer;
        })
        .then(answer => {
          console.log(answer);
          connection.query(
            "INSERT INTO departments SET ?",
            {
              name: answer.name
            },
            function(err) {
              if (err) throw err;
              console.log("Your employee was added successfully!");
              console.log(res.affectedRows + " employees added!\n");
              readProducts();
            }
          );
        });
    }
  );
};

const addRole = () => {
  connection.query(
    `SELECT 
      roles.title, 
      roles.id 
    FROM 
      roles 
    JOIN 
      employees 
    ON 
      employees.role_id = roles.id`,
    function(err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is your employee's first name?",
            name: "last_name"
          },
          {
            type: "input",
            message: "What is your employee's last name?",
            name: "first_name"
          },
          {
            type: "list",
            message: "What is your employee's role?",
            name: "role_id",
            choices: res.map(role => ({
              name: role.title,
              value: role.id
            }))
          }
          // {
          //   type: "list",
          //   message: "Who is your employee's manager?",
          //   name: "manager_id",
          //   choices: managers.map(mngr => ({
          //     name: mngr.first_name + " " + mngr.last_name,
          //     value: mngr.id
          //   }))
          // }
        ])
        .then(answer => {
          connection.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id
            },
            function(err) {
              if (err) throw err;
              console.log("Your employee was added successfully!");
              console.log(res.affectedRows + " employees added!\n");
              readProducts();
            }
          );
        });
    }
  );
};

const updateEmpRole = () => {
  connection.query(
    `SELECT 
      roles.title, 
      roles.id,
      employees.last_name,
      employees.role_id,
      employees.id
    FROM 
      roles 
    LEFT JOIN 
      employees 
    ON 
      employees.role_id = roles.id`,
    function(err, res) {
      if (err) throw err;
      console.log("updateResponse:", res);
      inquirer
        .prompt([
          {
            type: "list", //should be a list
            message: "Which employee would you like to update?",
            name: "last_name",
            choices: res.map(emp => ({
              name: emp.last_name,
              value: emp.id
            }))
          },
          {
            type: "list",
            message: "Which role do you want to asign to the employee?",
            name: "title",
            choices: res.map(role => ({
              name: role.title,
              value: role.id
            }))
          }
        ])
        .then(answer => {
          console.log("update1", answer);
          console.log("answer.title", answer.title);
          connection.query(
            "SELECT * FROM employees WHERE role_id=?",
            [
              {
                role_id: answer.title
              }
            ],
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " employees updated!\n");
              readProducts();
            }
          );
          return answer;
        })
        .then(answer => {
          console.log("update2", answer.last_name);
          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                role_id: answer.title
              },
              {
                id: answer.last_name
              }
            ],
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " employees updated!\n");
              readProducts();
            }
          );
        });
    }
  );
};

const readProducts = () => {
  console.log("Selecting all products...\n");
  connection.query(
    `SELECT 
      employees.id, 
      employees.first_name, 
      employees.last_name, 
      roles.title, roles.salary, 
      managers.first_name AS ManagerFirstName 
    FROM 
      employees 
    LEFT JOIN 
      roles 
    ON 
      employees.role_id = roles.id 
    LEFT JOIN 
      managers 
    ON 
      employees.manager_id = managers.id
    LEFT JOIN 
      departments 
    ON 
      roles.department_id = departments.id`,
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      // console.log(res);
      const table = cTable.getTable(res);
      console.log(`\n${table}`);
      connection.end();
    }
  );
};
