import { MailtrapClient } from 'mailtrap';
import config from 'config';

const TOKEN = config.get<string>('mailtrap_token');

export const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: 'hello@demomailtrap.co',
  name: 'Nodejs Auth Application',
};
// const recipients = [
//   {
//     email: 'collinsmunkary@gmail.com',
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: 'You are awesome!',
//     text: 'Congrats for sending test email with Mailtrap!',
//     category: 'Integration Test',
//   })
//   .then(console.log, console.error);
