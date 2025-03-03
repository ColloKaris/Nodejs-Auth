import { ExpressError } from '../utils/ExpressError.js';
import { logger } from '../utils/logger.js';
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
import { mailTrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (email: string, verificationCode: string) => {
  const recipient = [{email}];
  try {
    const response = mailTrapClient.send({
      from:sender,
      to: recipient,
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode),
      category: 'Email Verification'
    })
    // logger.info('Email sent successfully')
  } catch(error) {
    logger.error('Failed to send email', error);
    throw new ExpressError('Failed to send email', 500);
  }
}
//

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: 'You are awesome!',
//     text: 'Congrats for sending test email with Mailtrap!',
//     category: 'Integration Test',
//   })
//   .then(console.log, console.error);
