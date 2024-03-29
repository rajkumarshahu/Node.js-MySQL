var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
var Table = require('cli-table');
var headColor = chalk.hex('#DEADED').bold;


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "#Om667oscar",
  database: "bamazon",
});

connection.connect(function(err) {
  if (err) throw err;

});

function askManager() {
  console.log(chalk.bold.rgb(10, 100, 200)("\n-------------------------------------- Welcome to BAMAZON--------------------------------------"));
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit",
        ],
      },
    ])
    .then(function(response) {
      if (response.menu == "View Products for Sale") {
        queryAllProducts();
      } else if (response.menu == "View Low Inventory") {
        getProductsLowerThanFive();
      } else if (response.menu == "Add to Inventory") {
        connection.query("SELECT * FROM products", function(err, res) {
          if (err) {
            throw err;
          } else {
            inquirer
              .prompt([
                {
                  name: "item_id",
                  type: "input",
                  message: "Enter the ID of item you want to add more.",
                  validate: function(value) {
                    if (isNaN(value) == false) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                {
                  name: "updateQuantity",
                  type: "input",
                  message: "Enter the quantity you want to add.",
                  validate: function(value) {
                    if (isNaN(value) == false) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
              ])
              .then(function updateQuantity(response) {
                console.log(
                  "Item ID: ",
                  response.item_id,
                  ", Quantity: ",
                  response.updateQuantity,
                  "\n"
                );
                for (var i = 0; i < res.length; i++) {
                  if (res[i].item_id == response.item_id) {
                    currentQuantity = parseInt(res[i].stock_quantity);
                  }
                }
                var updatedQuantity =
                  currentQuantity + parseInt(response.updateQuantity);

                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: updatedQuantity,
                    },
                    {
                      item_id: response.item_id,
                    },
                  ],

                  function(err) {
                    if (err) {
                      console.log("Error occured: " + err);
                    } else {
                      console.log("Quantity of product ID ",response.item_id, " updated succesfully!!!");
                      askManager();
                    }
                  }
                );
              });
          }
        });
      }else if(response.menu == "Add New Product"){
        inquirer.prompt([
            {
                type:"input",
                name:"product_name",
                message:"Enter name of the product: "
            },
            {
                type:"input",
                name:"department_name",
                message:"Enter department of the product: "
            },
            {
                type:"input",
                name:"price",
                message:"Enter price of the product: "
            },
            {
                type:"input",
                name:"stock_quantity",
                message:"Enter quantity of the product: "
            }
        ])
        .then(function addNewProduct(response) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: response.product_name,
                    department_name: response.department_name,
                    price: response.price,
                    stock_quantity: response.stock_quantity
                },
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(response.product_name, " has been added!");
                        askManager();
                    };
                }
            );
        });
      } else if (response.menu == 'Exit') {
        console.log(chalk.bold.rgb(10, 100, 200)("\n---------------------------- Thank you for managing BAMAZON.----------------------------"));
        console.log(chalk.bold.rgb(10, 100, 200)("\n------------------------------------- See you later.-------------------------------------"));
        process.exit(0);
      }
    });
}

function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    var table = new Table({
      head: [headColor('ID'), headColor('Product Name'), headColor('Department'), headColor('Price'), headColor('Quantity')]
    , colWidths: [10, 40, 15, 10, 10]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(chalk.bgBlackBright(table.toString()));
    askManager();
  });
}

function getProductsLowerThanFive() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity < ?",
    [5],
    function(err, res) {
      if (err) throw err;
      var table = new Table({
        head: [headColor('ID'), headColor('Product Name'), headColor('Department'), headColor('Price'), headColor('Quantity')]
      , colWidths: [10, 40, 15, 10, 10]
      });
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log(chalk.bgBlackBright(table.toString()));
      askManager();
    }
  );
}

askManager();
