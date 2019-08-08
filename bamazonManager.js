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


function askManager(){
    //ask the manager for input
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

        },
    ]).then(function(response) {
        if(response.menu == "View Products for Sale"){
            queryAllProducts();
        }else if(response.menu == "View Low Inventory"){
            getProductsLowerThanFive();
        }
    });
}

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xx-x-x-x-x-x-x-x-x-x-x-x-x-x");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        console.log("--------------------------------------------------------------------");
      }
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xx-x-x-x-x-x-x-x-x-x-x-x-x-x");
    });
  }

  function getProductsLowerThanFive() {
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5], function(err, res) {
      if (err) throw err;
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xx-x-x-x-x-x-x-x-x-x-x-x-x-x");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        console.log("--------------------------------------------------------------------");
      }
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xx-x-x-x-x-x-x-x-x-x-x-x-x-x");
    });

  }
askManager();