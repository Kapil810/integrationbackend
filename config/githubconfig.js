// git configuration for authentication
const axios = require("axios");
const thirdPartyApps = require('../model/appsmodel');


const auth = async(req,res)=>{
  console.log("github auth req");
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.clientIdGithub}&redirect_uri=${process.env.redirectUriGithub}`;
     console.log("this is redirecturi github",redirectUri);
    res.redirect(redirectUri);
}

const authorize = async(req,res)=>{
    const {code} = req.query
     console.log("req query recived",code);
      console.log("github:",process.env.clientIdGithub);
      console.log("github:",process.env.clientSecretGithub);
    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
          client_id: process.env.clientIdGithub,
          client_secret: process.env.clientSecretGithub,
          code,
        }, {
          headers: {
            accept: 'application/json',
          },
        });
    
        const accessToken = tokenResponse.data.access_token;
         try{
          const data = await thirdPartyApps.findOne({provider:"github"});
             if(!data){
              const doc = await thirdPartyApps.create({provider:"github",accessToken:accessToken});
                 console.log("token successfully saved");
             }else{
               data.accessToken = accessToken;
               res.status(202).json({message:"accesstoken updated successfully"})
             }
         }catch(error){
          console.log("error in updating access token",error);
          if(error.response){
            res.status(400).json({message:error.response.data.message});
          }
         }
        res.cookie('accessToken', accessToken, { httpOnly: true })
        res.send('Login successful, you can track message.');
        // Use access token to get user info
        const userResponse = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        console.log("this is github userResponse",userResponse);
 }catch(error){
    console.log("error while occur when authoraize",error.message)
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    }
 }
}

module.exports={
    auth,
    authorize
}
