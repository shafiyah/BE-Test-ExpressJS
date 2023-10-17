const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


const server = require('http').createServer(app);
const io = require("socket.io")(server,{ cors:{origin : "*"}});
const ioClient = require("socket.io-client");

const exampleController = require('./app/controllers/exampleController');

const corsOptions = {
  origin: ["http://localhost:8080"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

db.sequelize.sync();


//webSocet call featch url  
exampleController.callmeWebSocket(io);

// set port, listen for requests
const PORT = process.env.PORTAPP || 7878;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

ioClient('http://localhost:5000');


//generate user login token 
app.post('/login', exampleController.login);

// routes
require("./app/routes/exampleRoutes")(app);



