const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Router = express.Router();
const agents = require("./agents")

var parent_dir = path.resolve(__dirname, "..");
var static = path.join(parent_dir, "static");
var pass = require(path.join(static,"pass.json"));

parser = bodyParser.urlencoded({extended : false});

Router.get("/", (req, res)=>{
	res.render(path.join(static, "login.ejs"),{data : {error : ""}});
});

Router.post("/", parser, (req, res)=>{
	var name;

	function authenticate(array){
		name = Object.keys(array)[0].split("_")[0];
		if (name == "manager") {
			let entries = pass.manager, x = array.manager_name, y = array.manager_pass;
			for (var i=0; i<entries.length; i++) {
				if (x == entries[i].user && y == entries[i].pass) {
					return true;
				}
			}
			return false;
		}
		else {
			let entries = pass.agent, x = array.agent_name, y = array.agent_pass;
			for (var i=0; i<entries.length; i++) {
				if (x == entries[i].user && y == entries[i].pass) {
					return true;
				}
			}
			return false;
		}
	}

	if (authenticate(req.body)) {
		if (name == "manager") {
			res.sendFile(path.join(static, "manager.html"));
			
			// const data = agents.info({aid: 1}, function(data){
			// 	console.log(data[0]);
			// 	console.log(data[0].name);
			// 	res.render(path.join(static, 'index.ejs'), {data : data[0]});
			// });
		}
		else {
			var aid = req.body.agent_name.substr(5);
			res.render(path.join(static, "agent.ejs"), {data : {name : req.body.agent_name, aid : aid, print: false}});
		}
		console.log("logged in as " + name);
	}
	else{
		res.render(path.join(static, 'login.ejs'),{data : {error : name}});
	}
});

module.exports = Router;
