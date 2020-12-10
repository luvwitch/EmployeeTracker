var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "companyDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
  });

  function start(){
    inquirer
      .prompt({
        name: 'q1',
        type: 'list',
        message: "Would you like to ADD, VIEW, or UPDATE a department, role, or employee?",
        choices: ["ADD", "VIEW", "UPDATE", "EXIT"]

        }).then(function(answer) {
          if (answer.q1 === "ADD"){
            addBegin();
          } else if(answer.q1 === "VIEW"){
            viewBegin();
          } else if(answer.q1 === "UPDATE"){
            updateBegin();            
          } else if(answer.q1 ==="EXIT"){
            connection.end();
          }
        });
  }

  function addBegin(){
    inquirer
      .prompt({
        name: 'qAdd',
        type: 'list',
        message: "Would you like to add a department, role, or employee?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BACK"]

       }).then(function(answer) {
          if (answer.qAdd === "DEPARTMENT"){
            addDepartment();
          } else if(answer.qAdd === "ROLE"){
            addRole();
          } else if(answer.qAdd === "EMPLOYEE"){
            addEmployee();            
          } else if(answer.qAdd === "BACK"){
            start();
          }
      });
  }

  function addDepartment(){
    inquirer
    .prompt(
      {
        name: 'newdept',
        type: 'input',
        message: "What is the name of the department you'd like to add?"
      })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.newdept
        },
        function(err) {
          if (err) throw err;
          console.log("Your department was added!");
          start();
        }
      );
    });
};

  function addRole(){
    inquirer
    .prompt([
      {
        name: 'newrole',
        type: 'input',
        message: "What is the name of the role you'd like to add?"
      },
      {
        name: 'newsal',
        type: 'input',
        message: "What is the starting salary of the role you'd like to add?"

      },
      {
        name: 'newdeptid',
        type: 'list',
        choices: function() {
          var deptArray = [];
          for (var i = 0; i < results.length; i++) {
            deptArray.push(results[i].department.name);
          }
          return deptArray;
        },
        message: "What department would you like to add the role to?"
      }
    ]).then(function(answer) {
      
      var chosenDept;
        for (var i = 0; i < department.length; i++) {
          if (results[i].department.name === answer.choice) {
            chosenDept = results[i];
          }
        }


      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.newrole,
          salary: answer.newsal,
          department_id: chosenDept.id
        },
        function(err) {
          if (err) throw err;
          console.log("Your role was added!");
          start();
        }
      );
    });

  }


  // function addEmployee(){

  // }

  function viewBegin(){
    inquirer
      .prompt({
        name: 'qView',
        type: 'list',
        message: "Would you like to view a department, role, or employee list?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BACK"]

      }).then(function(answer) {
        if (answer.qView === "DEPARTMENT"){
          viewDepartment();
        } else if(answer.qView === "ROLE"){
          viewRole();
        } else if(answer.qView === "EMPLOYEE"){
          viewEmployee();                  
        } else if(answer.qView === "BACK"){
          start();
        }
      });
  

  function viewDepartment(){
    connection.query("SELECT name FROM department", function(err, res) {
      if (err) throw err;
      console.table(res);
      viewBegin();
    });
  };
  
  function viewRole(){
    connection.query("SELECT role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id;", function(err, res) {
      if (err) throw err;
      console.table(res);
      viewBegin();
    });

  };

  function viewEmployee(){
    connection.query("SELECT employee.first_name, employee.last_name, employee.manager_id, role.title FROM employee LEFT JOIN role ON role.id = employee.role_id;", function(err, res) {
      if (err) throw err;
      console.table(res);
      viewBegin();
    });
  };

};

  function updateBegin(){
    inquirer
      .prompt({
        name: 'qUpdate',
        type: 'list',
        message: "Would you like to update an employee's role?",
        choices: ["YES", "NO"]

      }).then(function(answer) {
        if (answer.qUpdate === "YES") {
          updateRole();
        } else if(answer.qUpdate === "NO") {
          start();
        }
      });
  }

  function updateRole(){
    connection.query("SELECT * FROM employees, roles", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt(
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var empArray = [];
              for (var i = 0; i < results.length; i++) {
                empArray.push(results[i].first_name, results[i].last_name);
              }
              return empArray;
            },
            message: "Which employee would you like to update the role of?"
          },
        ).then(function(answer) {      
          var chosenEmp;
            for (var i = 0; i < employee.length; i++) {
              if (results[i].first_name & results[i].last_name === answer.choice) {
                chosenEmp = results[i];
              }
            }
              inquirer
                .prompt({
                  name: 'updaterole',
                  type: 'list',
                  choices: function() {
                    var roleArray = [];
                    for (var i = 0; i < results.length; i++) {
                      roleArray.push(results[i].title);
                    }
                    return roleArray;
                  },
                  message: "Which role would you like to add them to?"
                },
              ).then(function(answer) {
            
                var chosenRole;
                  for (var i = 0; i < role.length; i++) {
                    if (results[i].title === answer.choice) {
                      chosenRole = results[i];
                    }
                };
                connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                    {
                      role_id: chosenRole.id
                    },
                    {
                      manager_id: null
                    }
                  ],
                  function(error) {
                    if (error) throw err;
                    console.log("Employee updated successfully!");
                    start();
                  });
              });
            });
        });
      };
  