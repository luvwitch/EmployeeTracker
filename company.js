var mysql = require("mysql");
var inquirer = require("inquirer");

var PORT = process.env.PORT || 8080;
  
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
    //runSearch(); < replace with starter function that includes inquirer prompts
    //reference mysql activity 14 if confused
  });