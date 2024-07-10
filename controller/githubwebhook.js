const gitWebNotification = (req,res)=>{
  try{
    const event = req.headers['x-github-event'];

  // Log the event and payload
  console.log(`Received GitHub event: ${event}`);
  console.log('Payload:', req.body);

  // Implement your custom logic here
  // For example, send a notification or update your database

  res.status(200).send('Webhook received successfully.');
  }catch(error){
    console.log("error while occur webhook routes",error.message);
    if(error.response){
      console.log("status",error.response.status);
        console.log("headers",error.response.headers);
        console.log("data",error.response.data);
      
    }
  }
   
};

module.exports = gitWebNotification;
