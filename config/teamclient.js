const axios = require("axios");
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const tenantId = process.env.tenantId;
const redirectUri = process.env.redirectUri;
const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

const auth = (req, res) => {
  const authorizationUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=Chat.ReadWrite%20offline_access&state=12345`;
  res.redirect(authorizationUrl);
}

const authorize = async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios({
      method: 'post',
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `client_id=${clientId}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code&client_secret=${clientSecret}`,
    });
    const accessToken = response.data.access_token;
      console.log("access token",accessToken);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.send('Login successful, you can now post a message.');
  } catch (error) {
    console.log('Error obtaining access token:', error);
    res.send('Error obtaining access token.');
  }
};

module.exports={auth,authorize}