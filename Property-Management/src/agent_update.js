const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const Router = express.Router();

var parent_dir = path.resolve(__dirname, "..");
var static = path.join(parent_dir, "static");
var pass = require(path.join(static,"pass.json"));

parser = bodyParser.urlencoded({extended : false});

/* /agent_update?aid=1&option=buy&pid=1234 */

Router.post("/", parser, (req, res)=>{
	let d = req.body;
	let aid = d.aid;
	let option = d.option;
	let pid = d.pid;
	let pStatus, date = new Date().getFullYear();
	let isError = false;

	if (option == "buy") {
		pStatus = "sold";
	} else {
		pStatus = "rented";
	}

	mysqlConnection.query(

        'UPDATE Status s SET s.pStatus = ?, s.aid = ?, s.date = ? WHERE s.pid = ? AND s.pStatus = "available"'

        , [pStatus, aid, date, pid], (err, result)=>{
	    	if (err) {
	    		isError = true;
	    		console.log(err);
	    	}
	    	console.log("Requested available properties for selling");
	    	res.render(path.join(static, "agent.ejs"), 
	    	{
	    		data : 
	    		{
	    			name : 'agent'+aid,
	    			aid : aid,
	    			pid : pid,
	    			pStatus : pStatus,
	    			isError : isError,
					print: true
	    		}
	    });
	});
});

module.exports = Router;