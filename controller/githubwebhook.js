const gitWebNotification = ()=>{
    const event = req.headers['x-github-event'];

  // Log the event and payload
  console.log(`Received GitHub event: ${event}`);
  console.log('Payload:', req.body);

  // Implement your custom logic here
  // For example, send a notification or update your database

  res.status(200).send('Webhook received successfully.');
};

module.exports = gitWebNotification;
