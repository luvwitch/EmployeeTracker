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

  function start() {
    inquirer
      .prompt({
        name: "q1",
        type: "list",
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
        name: "qAdd",
        type: "list",
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

  // function addDepartment(){

  // }
  // function addRole(){

  // }
  // function addEmployee(){

  // }

  function viewBegin(){
    inquirer
      .prompt({
        name: "qView",
        type: "list",
        message: "Would you like to view a department, role, employee, or all?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "ALL", "BACK"]

      }).then(function(answer) {
        if (answer.qView === "DEPARTMENT"){
          viewDepartment();
        } else if(answer.qView === "ROLE"){
          viewRole();
        } else if(answer.qView === "EMPLOYEE"){
          viewEmployee(); 
        } else if(answer.qView === "ALL"){
          viewAll();             
        } else if(answer.qView === "BACK"){
          start();
        }
      });
  }

  // function viewDepartment(){

  // }
  
  // function viewRole(){

  // }

  // function viewEmployee(){

  // }

  // function viewAll(){

  // }

  function updateBegin(){
    inquirer
      .prompt({
        name: "qUpdate",
        type: "list",
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
    viewEmployee();
    inquirer
      .prompt({
        name: 'empUp',
        type: 'list',
        message: "Which employee would you like to update?"
        choices: [
          CURRENT EMPLOYEE ARRAY
        ]
      }).then(function(answer){
        const employee = answer.empUp
        inquirer
          .prompt({
            name: 'newrole',
            type: 'input',
            message: "What would you like to change their role to?"
          }).then(function(response){
            employee.role = response.newrole
          })
      }    
  }