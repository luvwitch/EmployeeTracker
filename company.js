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
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
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
        name: 'newdept',
        type: 'rawlist',
        choices: function() {
          var deptArray = [];
          for (var i = 0; i < results.length; i++) {
            deptArray.push(results[i].id);
          }
          return deptArray;
        },
        message: "Which department would you like add the role to?"
      }
    ]).then(function(answer){     
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.newrole,
          salary: answer.newsal,
          department_id: answer.newdept
        },      
        function(err) {
          if (err) throw err;
          console.log("Your role was added!");
          start();
        }
      );        
    });
  }); 
};


  function addEmployee(){
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;    
    inquirer
      .prompt([
        {
          name: 'newempfirst',
          type: 'input',
          message: "What is the first name of the employee you'd like to add?"
        },
        {
          name: 'newemplast',
          type: 'input',
          message: "What is the last name of the employee you'd like to add?"  
        },
        {
          name: 'newroleid',
          type: 'rawlist',
          choices: function() {
            var roleArray = [];
            for (var i = 0; i < results.length; i++) {
              roleArray.push(results[i].id);
            }
            return roleArray;
          },
          message: "Which role id would you like add to the employee?"
        }
      ]).then(function(answer) {     
        
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.newempfirst,
            last_name: answer.newemplast,
            role_id: answer.newroleid
          },
          function(err) {
            if (err) throw err;
            console.log("Your employee was added!");
            start();
          })       
      })
    })
  }
}


  function updateBegin(){
    inquirer
      .prompt({
        name: 'qUpdate',
        type: 'list',
        message: "Would you like to update an employee's role?",
        choices: ["YES", "NO"]

      }).then(function(choice) {
        if (choice.qUpdate === "YES") {
          updateRole();
        } else if(choice.qUpdate === "NO") {
          start();
        }
      })  
    }

  function updateRole(){
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      choiceArray = []; 
      for (var i = 0; i < results.length; i++) {
        choiceArray.push(results[i].last_name);
      }
      inquirer
        .prompt([
          {
            name: 'choiceArray',
            type: 'list',
            choices: choiceArray,
            message: "Select the last name of the employee you would like to update."
          },
          {
            name: 'rolechange',
            type: 'input',
            message: "What new role id would you like to assign to the employee?"
          }
        ]).then(function(answer) {          
            connection.query(
              "UPDATE employee SET role_id = ? WHERE last_name = ?", [answer.rolechange, answer.choiceArray],            
              function(err, results) {
                if (err) throw err;
                console.log("Employee updated successfully!");
                start();
              })
            })
          })
  }        
