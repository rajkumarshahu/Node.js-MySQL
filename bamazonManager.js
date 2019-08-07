var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "#Om667oscar",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("\n-------------------------Welcome to BAMAZON-------------------------");
});

var mysql = require ("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "JW55cw04",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("\n-------------------------Welcome to BAMAZON-------------------------");
});

function askManager(){
    //ask the manager for input
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

        },
    ]).then(function(input) {

    });
}
askManager();