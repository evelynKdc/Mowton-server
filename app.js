const Server = require("./model/Server");

require("dotenv").config();

const server = new Server();

server.listen();
