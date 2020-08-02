const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const mysqlConnection = require("./connection");
const Router = express.Router();

parser = bodyParser.urlencoded({extended : false});

Router.post('/', parser, (req, res)=>{

	let priceStart = req.body.priceStart;
	let priceEnd = req.body.priceEnd;
	let option = req.body.option;
	let city = req.body.city;

	if (option == "buy") {

		if (city == "") {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, price, area, bedrooms\
                FROM Property p, Status s WHERE p.price >= ? AND p.price <= ?\
                AND s.pid = p.pid AND s.pStatus = \"available\""
                , [priceStart, priceEnd], (err, rows, fields)=>{
	    		if (err) {
	    			console.log(err);
	    			res.end();
	    		}
	    		else {
	    			console.log("Requested available properties for selling");
	    			displaydata(rows, res)
	    		}
			});
		}

		else {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, price, area, bedrooms\
                FROM Property p, Status s WHERE p.price >= ? AND p.price <= ? AND p.city = ?\
                AND s.pid = p.pid AND s.pStatus = \"available\""
                , [priceStart, priceEnd, city], (err, rows, fields)=>{
	    		if (err) {
	    			console.log(err);
	    			res.end();
	    		}
	    		else {
	    			console.log("Requested available properties for selling");
	    			displaydata(rows, res)

	    		}
			});
		}
	}
	else {

		if (city == "") {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, rent, area, bedrooms\
                 FROM Property p, Status s WHERE p.rent >= ? AND p.rent <= ?\
                 AND s.pid = p.pid AND s.pStatus = \"available\""
	    		, [priceStart, priceEnd], (err, rows, fields)=>{
				if (err) {
					console.log(err);
					res.end();
				}
				else {
					console.log("Requested available properties for rent");
					displaydata(rows, res)
				}
			});
		}

		else {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, rent, area, bedrooms\
                FROM Property p, Status s WHERE p.rent >= ? AND p.rent <= ? AND p.city = ?\
                AND s.pid = p.pid AND s.pStatus = \"available\""
                , [priceStart, priceEnd, city], (err, rows, fields)=>{
	    		if (err) {
	    			console.log(err);
	    			res.end();
	    		}
	    		else {
	    			console.log("Requested available properties for rent");
	    			displaydata(rows, res)
	    		}
			});
		}
	}

});





function displaydata(rows, res) {
	
	res.write("<head>")

	res.write(
		"<style>\
		#propertytable {\
		  font-family: \"Trebuchet MS\", Arial, Helvetica, sans-serif;\
		  border-collapse: collapse;\
		  width: 100%;\
		}\
		\
		#propertytable td, #propertytable th {\
		  border: 1px solid #ddd;\
		  padding: 8px;\
		}\
		\
		#propertytable tr:nth-child(even){background-color: #f2f2f2;}\
		\
		#propertytable tr:hover {background-color: #ddd;}\
		\
		#propertytable th {\
		  padding-top: 22px;\
		  padding-bottom: 22px;\
		  border-radius: 5px;\
		  text-align: center;\
		  background-color: #0000FF;\
		  color: white;\
		}\
		#propertytable td {\
		  padding-top: 18px;\
		  padding-bottom: 18px;\
		  border-radius: 5px;\
		  text-align: center;\
		}\
		</style>"
	);

	res.write("</head>")

	res.write('<body>')

	res.write('<table id = \"propertytable\">');

	res.write('<tr>');
	for(var column in rows[0]) {
		res.write('<th>' + column.toUpperCase() + '</th>');
	}
	res.write('</tr>');

	for(var row in rows) {
		res.write('<tr>');
		for(var column in rows[row]) {
			res.write('<td><label>' + rows[row][column] + '</label></td>');
		}
		res.write('</tr>');
	}
	res.write('</table>')
	res.end('</body>');
}


module.exports = Router;

