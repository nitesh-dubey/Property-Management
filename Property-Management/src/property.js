const express = require("express");
const Router = express.Router();
const mysqlConnection = require("./connection");

/* 
   GET all property with some pStatus and ordering
   URL : /property?option=sell&priceStart=100&priceEnd=1000&city=Pune

   type -> sell or rent
*/

Router.get("/", (req, res)=>{
	let priceStart = req.query.priceStart;
	let priceEnd = req.query.priceEnd;
	let option = req.query.option;
	let city = req.query.city;

	console.log(priceStart,priceEnd,option,city);

	// res.send(type);

	if (option == "sell") {
		/* 
		*** returns {pid, city, address, price, area, bedrooms}
		*/

		if (city == "") {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, price, area, bedrooms\
                FROM Property p, Status s WHERE p.price >= ? AND p.price <= ?\
                AND s.pid = p.pid AND s.pStatus = \"available\""
                , [priceStart, priceEnd], (err, rows, fields)=>{
	    		if (err) {
	    			console.log(err);
	    		}
	    		else {
	    			console.log("Requested available properties for selling");
	    			res.json(rows);
	    		}
			});
		}

		else {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, price, area, bedrooms\
                FROM Property p WHERE p.price >= ? AND p.price <= ? AND p.city = ?"
                , [priceStart, priceEnd, city], (err, rows, fields)=>{
	    		if (err) {
	    			console.log(err);
	    		}
	    		else {
	    			console.log("Requested available properties for selling");
	    			res.json(rows);
	    		}
			});
		}
	}
	else {
		/* 
		*** returns {pid, city, address, price, area, bedrooms}
		*/

		if (city == "") {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, rent, area, bedrooms\
                 FROM Property p WHERE p.rent >= ? AND p.rent <= ?"
	    		, [priceStart, priceEnd], (err, rows, fields)=>{
				if (err) {
					console.log(err);
				}
				else {
					console.log("Requested available properties for rent");
					res.json(rows);
				}
			});
		}

		else {
			mysqlConnection.query(
                "SELECT p.pid as pid, city, address, rent, area, bedrooms\
                FROM Property p WHERE p.rent >= ? AND p.rent <= ? AND p.city = ?"
                , [priceStart, priceEnd, city], (err, rows, fields)=>{
	    		if (err) {
	    			console.log(err);
	    		}
	    		else {
	    			console.log("Requested available properties for selling");
	    			res.json(rows);
	    		}
			});
		}
	}
});

module.exports = Router;

