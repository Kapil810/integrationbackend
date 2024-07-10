const express = require("express");
const router = express.Router();
const {TeamsMessage,sendMessageToPerson,getGroupChatId} = require('../controller/teamMessage');
const {auth,authorize} = require("../config/teamclient");

router.get('/auth',auth);
router.get("/redirect",authorize);
router.post('/send-message',TeamsMessage);
router.post('/person',sendMessageToPerson);
router.get("/grouplist",getGroupChatId);

module.exports = router;