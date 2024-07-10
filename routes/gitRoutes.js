const express = require("express");
const route = express.Router();
const{auth,authorize} = require("../config/githubconfig");
const gitWebNotification = require("../controller/githubwebhook");
route.get("/github",auth);
route.get("/git/callback",authorize);
route.get("/git/webhook",gitWebNotification);

module.exports = route;