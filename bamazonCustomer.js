var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
var Table = require('cli-table');
var headColor = chalk.hex('#DEADED').bold;
var table = new Table({
  head: [headColor('ID'), headColor('Product Name'), headColor('Department'), headColor('Price'), headColor('Quantity')]
, colWidths: [10, 40, 15, 10, 10]
});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "#Om667oscar",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(chalk.bold.rgb(10, 100, 200)("\n-------------------------------------- Welcome to BAMAZON--------------------------------------"));
    //queryAllProducts()
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      console.log

      for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log(chalk.bgBlackBright(table.toString()));

      askForProductID(res)
    });
  }

  function askForProductID(stock) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: chalk.bold.rgb(10, 100, 100)("Please enter ID of the product you want to purchase (or enter 'e' to Exit)"),
          validate: function(ch) {
            return !isNaN(ch) || ch.toLowerCase() === "e";
          }
        }
      ])
      .then(function(ch) {
        shouldExit(ch.choice);
        var choiceId = parseInt(ch.choice);
        var product = getProductIfExists(choiceId, stock);
        if (product) {
          askForProductQuantity(product);
        }
        else {

          console.log(chalk.bgRed("\n-----------------------------Sorry!!!The product is out of stock.-----------------------------\n"));

          continueShopping();
        }
      });
  }

  function askForProductQuantity(product) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "quantity",
          message: chalk.bold.rgb(10, 100, 100)("Please enter the quantity (or enter 'e' to Exit)"),
          validate: function(val) {
            return val > 0|| val.toLowerCase() === "e";
          }
        }
      ])
      .then(function(val) {
        shouldExit(val.quantity);
        var quantity = parseInt(val.quantity);
        if (quantity > product.stock_quantity) {

          console.log(chalk.bgRed("\n---------------------------------------Insufficient quantity!---------------------------------------"));
          continueShopping();
        }
        else {
          makePurchase(product, quantity);
        }
      });
  }

  function makePurchase(product, quantity) {

    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
      [quantity, product.item_id],
      function(err, res) {
        //console.log(res);
        var table1 = new Table({
          head: [chalk.bgGreen(chalk.white("                     Successfully purchased product with id "  + product.item_id+"       " ))]
        , colWidths: [75]
        });

        table1.push(["                        Your total cost is " + "$"+Math.round(quantity * product.price)+"         "])
        console.log(chalk.bgGreen("\n\n",table1.toString()));
        continueShopping();
      }

    );

    }

    function getProductIfExists(choiceId, stock) {
        for (var i = 0; i < stock.length; i++) {
          if (stock[i].item_id === choiceId) {
            return stock[i];
          }
        }
        return null;
      }

      function shouldExit(choice) {
        if (choice.toLowerCase() === "e") {
          console.log(chalk.bold.rgb(10, 100, 200)("\n------------------------Thank you for buying at BAMAZON!!!------------------------\n"));
          process.exit(0);
        }
      }

      function continueShopping(){
          inquirer.prompt([
            {
                name: "continue",
                type: "Confirm",
                message: "Do you want to continue Shopping?(Y/N):",
            }
        ]).then(function (response) {
            if (response.continue.toLowerCase() === 'y')
            queryAllProducts()
            else {
                console.log(console.log(chalk.bold.rgb(10, 100, 200)("------------------------Thank you for shopping with BAMAZON.------------")));
                process.exit(0);
            }
        });
      }

      queryAllProducts();