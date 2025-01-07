import schedule from 'node-schedule';

schedule.scheduleJob('0 * * * * *', () => {
  console.log('The time is ', Date.now());
  // Replace the following with your own code to send a reminder email
  console.log('Sending reminder email...');
});
