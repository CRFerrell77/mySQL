//dependents

var inquirer = require("inquirer");
var mysql = require("mysql");

//global Variables
var QTY 

//mySQL connect

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "admin",
    database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	//console.log("connected as " + connection.threadId);
});

//Command Line Interface (for breaking up later)

var cli = function() {
    console.log("\n-===* Game Day Store at Bamazon! *===-");
    inquirer.prompt([
        {
            type: "list",
            name: "whoDis",
            message: "Are you a Customer or a Manager?",
            choices: ["Customer", "Manager"]
        }
            
        ]).then(function(answer){

            if (answer.whoDis === "Customer"){
                custFunct();
            } else {
                mgrFunct();
            }
        });
};

cli();

var custBack = function () {
    inquirer.prompt([
        {
            type: "confirm",
            name: "backConf",
            message: "\nback to the customer menu?"                
        }
    ]).then(function(answer){
        if (answer.backConf) {
            custFunct();
        } else {
            process.exit();
        }

    });
}

//customer functions
//main customer menu

var custFunct = function() {
    console.log("\n-===* Customer Menu *===-")
    inquirer.prompt([
        {
            type: "list",
            name: "custMenu",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "Order Product", "Main Menu", "Exit"]
            
        }
    ]).then(function(answer){
        if (answer.custMenu === "View Products for Sale"){ //view inventory
    		viewAll();
    	} else if (answer.custMenu === "Order Product"){ //order system
    		orderProd();
    	} else if (answer.custMenu === "Main Menu"){ //return to main
            cli();
        } else if (answer.custMenu === "Exit"){ //exit program
            process.exit();
        }
    });
};

var viewAll =function() {
    console.log("\nYou are viewing our current inventory:");
    var query = connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i=0; i<res.length; i++) {
			console.log("\nID #" + res[i].id + " | " + res[i].prodName + " | " + " Price: $" +res[i].price + " | " + "Quantity: " + res[i].qty);
        }
        custBack();
	});
};

var orderProd =function() {
    console.log("\nOrdering Menu:");
    inquirer.prompt([
        {
            type: "text",
            name: "orderID",
            message: "\nWhat ID # you like to order?"
            
        }
    ]).then(function(answer){
        //console.log("chosen: "+answer.orderID);

        var query = "SELECT prodName,qty FROM products WHERE ?"; 
        connection.query(query, {id: answer.orderID}, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                var itemID = res[i].prodName;
                var currQTY = res[i].qty;
            }
            inquirer.prompt([
                {
                    type: "text",
                    name: "orderQTY",
                    message: "\nHow many ( " + itemID + " ) would you like to order?"
                    
                }
            ]).then(function(answer){
                var inStockCheck = currQTY - answer.orderQTY;
                QTY = answer.orderQTY;
                //console.log("your order would put us at: " + inStockCheck);
                updateQty(inStockCheck);
            });                   
            var updateQty = function(value) {
                if (value >= 0){
                    var query = "UPDATE products set qty =" + value + " WHERE id =" + answer.orderID;
                    connection.query(query, function(err, res,){
                        if(err) throw err;
                        giveAmt();
                    })
                } else {
                    console.log("Insufficient QTY!\nPlease review on-hand amounts from the Customer Menu");
                    custFunct();
                }
            }
            var giveAmt = function() {
                var query = "SELECT price FROM products WHERE id =" + answer.orderID;
                connection.query(query, function(err, res,){
                    if(err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        var price = res[i].price;
                        console.log("Price: " + price + ", QTY: " + QTY);
                    }
                    var total = price * QTY;
                    console.log("That will be: $" + total);
                    custBack();
                });
            };
        }
    )}
)};

// MGR functions

var mgrFunct = function() {
    console.log("you are a MGR");
}

