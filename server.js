const express = require("express");
const cors = require("cors");
require("dotenv").config();
const slackRoutes = require("./routes/AuthRoutes");
const TeamsMessage = require("./routes/teamsRoute");
const githubEndPoints = require("./routes/gitRoutes");


const server = express();
const PORT = process.env.PORT;

server.use(cors());
//
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use("/", slackRoutes);
server.use("/", TeamsMessage);
server.use("/",githubEndPoints);

server.listen(PORT,()=>{
    console.log("server is running")
});