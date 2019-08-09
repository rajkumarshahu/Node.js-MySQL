var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var table = new Table({
  head: ['ID', 'Product Name', 'Department', 'Price', 'Quantity']
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
    console.log("\n-------------------------Welcome to BAMAZON-------------------------");
    //queryAllProducts()
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xx-x-x-x-x-x-x-x-x-x-x-x-x-x");
      console.log

      for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log(table.toString());
      console.log("x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x");
      askForProductID(res)
    });
  }

  function askForProductID(stock) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "Please enter ID of the product you want to purchase (or enter 'e' to Exit)",
          validate: function(ch) {
            return !isNaN(ch) || ch.toLowerCase() === "e";
          }
        }
      ])
      .then(function(ch) {
        shouldExit(ch.choice);
        var choiceId = parseInt(ch.choice);
        var product = getProductIfExists(choiceId, stock);
        if (product.stock_quantity > 0) {
          askForProductQuantity(product);
        }
        else {
          console.log("\nSorry!!!\nThe product is out of stock.");
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
          message: "Please enter the quantity (or enter 'e' to Exit)",
          validate: function(val) {
            return val > 0|| val.toLowerCase() === "e";
          }
        }
      ])
      .then(function(val) {
        shouldExit(val.quantity);
        var quantity = parseInt(val.quantity);
        if (quantity > product.stock_quantity) {

          console.log("\nInsufficient quantity!");
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
        console.log(res);
        var table1 = new Table({
          head: ["   Successfully purchased product with id "  + product.item_id ]
        , colWidths: [75]
        });

        table1.push(["   Your total cost is " + "$"+Math.round(quantity * product.price)])
        //queryAllProducts();
        console.log("\n\n",table1.toString());

        //askForProductID(res);
        continueShopping();

        // console.log("-------------------------------------------------------");
        // console.log("| Successfully purchased " + quantity + " " + product.product_name + "|");
        // console.log("| Your total cost is " + "$"+quantity * product.price + "|");
        // console.log("-------------------------------------------------------\n");

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
          console.log("Thank you for buying at BAMAZON!!!");
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
                console.log("Good Bye.See you soon");
                process.exit(0);
            }
        });
      }

      queryAllProducts();