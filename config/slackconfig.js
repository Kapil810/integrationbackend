const { WebClient } = require('@slack/web-api');

// Initialize Slack client with your token
const slackClient = new WebClient(process.env.BOT);

module.exports = slackClient;