import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplates.js';
import { mailTrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipent = [{ email }];

  try {
    const resoponse = await mailTrapClient.send({
      from: sender,
      to: recipent,
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationToken
      ),
      category: 'Email verification',
    });
    console.log('Verification email sent successfully:', resoponse);
  } catch (error) {
    console.error('Error sending verification email', error);
    throw new Error(`Error sending email`, error);
  }
};

// sendWelcomeEmail

export const sendWelcomeEmail = async (email, name) => {
  const recipent = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipent,
      template_uuid: 'c72dad21-ea5f-427a-ac61-534c24df2fe0',
      template_variables: {
        company_info_name: 'Auth Company',
        name: name,
      },
    });
    console.log('Welcome email sent successfully:', response);
  } catch (error) {
    consolle.log('Error sending welcome email:', error);
    throw new Error('Erro sending welcome email:', error);
  }
};

// send forget password email

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipent = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipent,
      subject: 'Reset Password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
      category: 'Password reset',
    });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Error sending reset password email:', error);
  }
};

// send password reset success email

export const sendResetSuccessEmail = async (email) => {
  const recipent = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipent,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password reset success',
    });
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw new Error('Error sending password reset success email:', error);
  }
};
