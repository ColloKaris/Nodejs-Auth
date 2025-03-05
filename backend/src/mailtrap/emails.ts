import { ExpressError } from '../utils/ExpressError.js';
import { logger } from '../utils/logger.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplates.js';
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

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Reset Your Password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
      category: 'Password Reset',
    });
  } catch (error) {
    logger.error('Failed to send reset password email', error);
    throw new ExpressError('Failed to send reset password', 500);
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    });
  } catch (error) {
    logger.error('Failed to send successful password reset email');
    throw new ExpressError(
      'Failed to send successful password reset email',
      500
    );
  }
};
