/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_MAIL,
  SMTP_PASSWORD,
} from '../constants/env.js';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_MAIL,
    pass: SMTP_PASSWORD,
  },
});

const sendMail = async ({ to, subject, text, html }: MailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Kizmart'}" <${SMTP_MAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Mail sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error occurred while sending mail:', error);
    return { success: false, error };
  }
};

export default sendMail;
