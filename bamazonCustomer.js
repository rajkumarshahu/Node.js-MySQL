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
    console.log("-----Welcome to BAMAZON-----");
    queryAllProducts()
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        console.log("-----------------------------------");
      }
      console.log("-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x");
      askForProductID(res)
    });
  }

  function askForProductID(stock) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "Please enter ID of the product you want to purchase [Exit with e]",
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
          console.log("\nThe product is not in our stock.");
          queryAllProducts();
        }
      });
  }

  function askForProductQuantity(product) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "quantity",
          message: "Please enter the quantity [Exit with e]",
          validate: function(val) {
            return val > 0 || val.toLowerCase() === "e";
          }
        }
      ])
      .then(function(val) {
        shouldExit(val.quantity);
        var quantity = parseInt(val.quantity);
        if (quantity > product.stock_quantity) {
          console.log("\nInsufficient quantity!");
          queryAllProducts();
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
        console.log("-------------------------------------------------------");
        console.log("| Successfully purchased " + quantity + " " + product.product_name + "|");
        console.log("| Your total cost is " + "$"+quantity * product.price + "|");
        console.log("-------------------------------------------------------\n");

      }

    );
    queryAllProducts();
    }

    // function getProductIfExists(choiceId, stock) {
    //     for (var i = 0; i < stock.length; i++) {
    //       if (stock[i].item_id === choiceId) {
    //         return stock[i];
    //       }
    //     }
    //     // Otherwise return null
    //     return null;
    //   }

      function shouldExit(choice) {
        if (choice.toLowerCase() === "e") {
          // Log a message and exit the current node process
          console.log("Goodbye!");
          process.exit(0);
        }
      }