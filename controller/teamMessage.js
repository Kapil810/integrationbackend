const axios = require("axios");

// team messsge
const TeamsMessage = async (req, res) => {
  const accessToken = req.headers.authorization;
  console.log("this is accesstoken", accessToken);
  const url = `https://graph.microsoft.com/v1.0/teams/${process.env.teamId}/channels/${process.env.channelId}/messages`;
  console.log("this is message url");
  const message = {
    body: {
      contentType: "html",
      content: "just for testing purpose",
    },
  };

  try {
    const res = await axios.post(url, message, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("this is teams api response", res);
  } catch (error) {
    console.log("error obtain when message on the channel", error.message);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
  }
};

// p2p message

const getOwnUserId = async (accessToken) => {
  const url = `https://graph.microsoft.com/v1.0/me`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("This is own user ID response:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Error getting own user ID:", error.message);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
  }
};

// Function to get a user's ID by email
const getUserId = async (accessToken, userEmail) => {
  const url = `https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq '${userEmail}'`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("This is user ID response", response);
    const user = response.data.value[0];
    return user.id;
  } catch (error) {
    console.error("Error getting user ID:", error.message);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
  }
};

// Function to create a chat
const createChat = async (accessToken, userId, yourUserId) => {
  const url = `https://graph.microsoft.com/v1.0/chats`;
  const payload = {
    chatType: "oneOnOne",
    members: [
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        roles: ["owner"],
        user: {
          id: yourUserId,
        },
      },
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        roles: ["owner"],
        user: {
          id: userId,
        },
      },
    ],
  };

  try {
    const chatResponse = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Chat created successfully:", chatResponse.data);
    return chatResponse.data.id;
  } catch (error) {
    console.error("Error creating chat:", error.message);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
  }
};

// Function to send a P2P message
const sendP2PMessage = async (accessToken, chatId, message) => {
  const messageUrl = `https://graph.microsoft.com/v1.0/chats/${chatId}/messages`;
  const messagePayload = {
    body: {
      content: message,
    },
  };

  try {
    const messageResponse = await axios.post(messageUrl, messagePayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent successfully:", messageResponse.data);
  } catch (error) {
    console.error("Error sending P2P message:", error.message);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
  }
};

// Main function to handle the request and send a message
const sendMessageToPerson = async (req, res) => {
  const userEmail = req.body.email;
  const messageContent = req.body.message;

  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).send("Access token not found.");
    }

    // Get your own user ID
    const yourUserId = await getOwnUserId(accessToken);
    if (!yourUserId) {
      return res.status(500).send("Unable to retrieve your user ID.");
    }

    // Get the recipient user ID
    const userId = await getUserId(accessToken, userEmail);
    if (!userId) {
      return res.status(500).send("Unable to retrieve recipient user ID.");
    }

    // Create a chat
    const chatId = await createChat(accessToken, userId, yourUserId);
    if (!chatId) {
      return res.status(500).send("Unable to create chat.");
    }

    // Send a message
    await sendP2PMessage(accessToken, chatId, messageContent);
    res.send("Message sent successfully.");
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Error sending message.");
  }
};

// chat  group message extract group id

const getGroupChatId = async (req, res) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res.json({ message: "message not found" });
    return;
  }
  const url = "https://graph.microsoft.com/v1.0/me/chats";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("this is all list group", response);
    // Assuming group chat name is known
    const groupChat = response.data.value.forEach((element) => {
      console.log("groups", element);
    });
  } catch (error) {
    console.error("Error getting group chat ID:", error.message);
    throw error;
  }
};

module.exports = { TeamsMessage, sendMessageToPerson, getGroupChatId };
