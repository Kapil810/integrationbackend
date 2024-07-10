const slackClient = require("../config/slackconfig");

// Function to invite bot to a channel
const inviteBotToChannel = async (channelId) => {
    try {
      const response = await slackClient.conversations.join({
        channel: channelId,
      });
      return response.channel;
    } catch (error) {
      console.error('Error inviting bot to channel: ', error.message);
      throw error;
    }
  };


// Function to list all channels
const listChannels = async (req,res) => {
     console.log("postman request is coming");
    try {
      const response = await slackClient.conversations.list({
        types: 'public_channel,private_channel'
      });
     console.log("this is channel response",response);
      res.status(200).json(response);
    } catch (error) {
        console.error('Error listing channels: ', error.message);
      throw error;
    }
  };

// Function to send a message to a channel
const sendMessageToChannel = async (req,res) => {
    try {
      // Ensure the bot is in the channel
       console.log("req.body",req.body);
       const channelId = req.body.id;
       const message = req.body.message;
      await inviteBotToChannel(channelId);
  
     const data = await slackClient.chat.postMessage({
        channel: channelId,
        text: message,
      });
      console.log('Message sent successfully');
      res.status(200).json(data)
    } catch (error) {
      console.error('Error sending message: ', error.message);
      throw error;
    }
  };

  module.exports = {sendMessageToChannel,listChannels};