const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Router = express.Router();
const agents = require("./agents")

/* 
	/soldRented?type=sold&aid=1 
	/soldRented?type=rented&aid=1 
*/

Router.get("/", (req, res)=>{
	var id = req.query.aid;
	var type = req.query.type;

	if (type == 'sold') {
		agents.sold({aid: id}, function(data){
			res.send(data);
		});
	} else {
		agents.rent({aid: id}, function(data){
			res.send(data);
		});
	}
});


module.exports = Router;
