const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const login = require("./src/login")
const agents = require("./src/agent_info");
const agent_interface = require("./src/agent_interface");
const agent_update = require("./src/agent_update");
const property = require("./src/property");
const soldRented = require("./src/soldRented");
const app = express();

/* Folder to have static files */
const static = path.join(__dirname, "static");

app.use(bodyParser.json());
app.use("/", login);
app.use("/agents", agents);
app.use("/agent_interface", agent_interface);
app.use("/agent_update", agent_update);
app.use("/property", property);
app.use("/soldRented", soldRented);
app.use(express.static(static));
app.set('json spaces', 4);
app.set('view engine', 'ejs');

/* Handle 404 requests */
app.use((req, res)=>{
	res.status(404);
	res.sendFile(path.join(static, "404_Page.html"));
	console.log("404 Error Page sent for request : " + req.url);
});

app.listen(3000);