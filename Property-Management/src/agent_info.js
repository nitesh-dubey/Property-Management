const express = require("express");
const path = require("path");
const agents = require("./agents");
const Router = express.Router();
const mysqlConnection = require("./connection");

var parent_dir = path.resolve(__dirname, "..");
var static = path.join(parent_dir, "static");


Router.get("/", (req, res)=>{
    let id = req.query.aid;
    const data = agents.info({aid: id}, function(data){
        res.render(path.join(static, 'index.ejs'), {data : data[0]});
    });
});

module.exports = Router;