
# Property Management
It's a website made for a real estate company to sell / rent properties, with interfaces for both agents and their manager. 

### Login interface

The project has 2 interfaces - one is for agents and the second one is for the manager.

The agents will be able to search for available properties by price-range and city, and can also sell / rent an available property to the clients, by updating the database. Simultaneous login of agents and concurrent updates on the database are handled as well. The manager will be able to monitor the agents and track their progress.

### Running the project

It requires [Node.js](https://nodejs.org/) as backend and [MySql](https://www.mysql.com/) for the database. The list of dependencies can be found at `package.json` file.

Install the dependencies and start the server using node as shown below.

```sh
$ cd <path of server.js file>
$ npm install
$ node server
```

By default, the server listens at port 3000. But you can change that in `server.js` file.

