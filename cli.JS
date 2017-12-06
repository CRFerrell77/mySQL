//dependents

var inquirer = require("inquirer");
var mysql = require("mysql");

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
	});
};

var orderProd =function() {
    console.log("you are ordering");
};

// MGR functions

var mgrFunct = function() {
    console.log("you are a MGR");

}