const express = require("express");
const Routes = express.Router();
const {sendMessageToChannel,listChannels} = require("../controller/slackMessage");


Routes.get("/list-channels",listChannels);
Routes.post("/send-channel-message", sendMessageToChannel);

module.exports = Routes;
