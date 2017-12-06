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

var mgrBack = function () {
    inquirer.prompt([
        {
            type: "confirm",
            name: "backConf",
            message: "\nback to the MGR menu?"                
        }
    ]).then(function(answer){
        if (answer.backConf) {
            mgrFunct();
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
    console.log("\n-===* MGR Menu *===-");
    inquirer.prompt([
        {
            type: "list",
            name: "mgrMenu",
            message: "\nWhat would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Main Menu", "Exit"]
            
        }
    ]).then(function(ans){

    	if (ans.mgrMenu === "View Products for Sale"){
    		viewAllMGR();
    	} else if (ans.mgrMenu === "View Low Inventory"){
    		viewLow();
    	} else if (ans.mgrMenu === "Add to Inventory"){
    		addInv();
    	} else if (ans.mgrMenu === "Add New Product"){
    		addNew();
    	} else if (ans.mgrMenu === "Main Menu"){ //return to main
            cli();
        } else if (ans.mgrMenu === "Exit"){ //exit program
            process.exit();
        }
    });
}

var viewAllMGR =function() {
    console.log("\nYou are viewing our current inventory:");
    var query = connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i=0; i<res.length; i++) {
			console.log("\nID #" + res[i].id + " | " + res[i].prodName + " | " + " Price: $" +res[i].price + " | " + "Quantity: " + res[i].qty);
        }
        mgrBack();
	});
};

var viewLow =function() {
    console.log("\nYou are viewing our current ( LOW ) inventory:");
    var query = connection.query("SELECT * FROM products WHERE qty < 5", function(err, res) {
		if (err) throw err;
		for (var i=0; i<res.length; i++) {
			console.log("\nID #" + res[i].id + " | " + res[i].prodName + " | " + " Price: $" +res[i].price + " | " + "Quantity: " + res[i].qty);
        }
        mgrBack();
	});
};

var addInv = function() {
    inquirer.prompt([
        {
            type: "text",
            name: "addID",
            message: "Which item ID would you like to add to?",
            
        },
        {
            type: "text",
            name: "addQTY",
            message: "How many items are you adding?",
            
        }
        ]).then(function(data){
            var query = connection.query("UPDATE products set qty = qty +" + data.addQTY + " where id =" + data.addID, function(err, res) {
                if (err) throw err;
                console.log("QTY added.");
                mgrBack();
            });
    
        });
};

var addNew = function() {
    inquirer.prompt([
        {
            type: "text",
            name: "id",
            message: "What is the item's ID number?",
        },
        {
            type: "text",
            name: "prod",
            message: "What is the product?",
        },
        {
        	type: "text",
        	name: "dept",
        	message: "What department is it for?"
        },
        {
            type: "text",
            name: "qty",
        	message: "How many are you adding?"
        },
        {
        	type: "text",
        	name:"price",
        	message: "How much is it?"
        }

    ]).then(function(data){
    	var query = connection.query("INSERT INTO products (id, prodName, deptName, qty, price) VALUES ('" + data.id + "', '" + data.prod + "', '" + data.dept + "', " + data.qty + ", " + data.price + ")", function(err, res) {
				if (err) throw err;
                console.log("New item added.");
                mgrBack();
		});
	});
};

