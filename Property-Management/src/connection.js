const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
	host : "localhost",
	user : "project",
	password : "password",
	database : "Project",
	multipleStatements : true
});

mysqlConnection.connect((err)=>{
	if (err) {
		console.log("Database Connection Failed");
		console.log(err);
	}
	else {
		console.log("Database Connection Succeeded");
	}
});

module.exports = mysqlConnection;