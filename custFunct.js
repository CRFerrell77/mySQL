// var inquirer = require("inquirer");
// var mysql = require("mysql");
// var cli = require("./cli.js");

// var custFunct = function() {
//     console.log("\n -===* Customer Menu *===-")
//     inquirer.prompt([
//         {
//             type: "list",
//             name: "custMenu",
//             message: "What would you like to do?",
//             choices: ["View Products for Sale", "Order Product"]
            
//         }
//     ]).then(function(answer){
//         if (answer.custMenu === "View Products for Sale"){
//     		viewAll();
//     	} else if (answer.custMenu === "Order Product"){
//     		orderProd();
//     	}
//     });
// };

// var viewAll =function() {
//     console.log("you are viewing");
//     var query = connection.query("SELECT * FROM products", function(err, res) {
// 		if (err) throw err;
// 		for (var i=0; i<res.length; i++) {
// 			console.log("ID #" + res[i].id + " | " + res[i].prodName + " | " + " Price: $" +res[i].price + " | " + "Quantity: " + res[i].qty);
// 		}
// 	});
// };

// var orderProd =function() {
//     console.log("you are ordering");
// };

// module.exports = custFunct;