import { ExpressError } from '../utils/ExpressError.js';
import { logger } from '../utils/logger.js';
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
import { mailTrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationCode
      ),
      category: 'Email Verification',
    });
    // logger.info('Email sent successfully')
  } catch (error) {
    logger.error('Failed to send email', error);
    throw new ExpressError('Failed to send email', 500);
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: '60e31f85-d691-49e9-b7e4-d6cbca3ce385',
      template_variables: {
        company_info_name: 'Nodejs Auth app',
        name: name,
      },
    });
  } catch (error) {
    logger.error('Failed to send welcome email', error);
    throw new ExpressError('Failed to send email', 500);
  }
};
