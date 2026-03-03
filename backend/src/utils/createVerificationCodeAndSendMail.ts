import crypto from 'crypto';
import VerificationCode from '../models/verificationCode.model.js';
import { getEmailVerificationTemplate } from './mailTemplates.js';
import sendMail from './sendMail.js';

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const createVerificationCodeAndSendMail = async (userId: string, email: string, type: string = 'email_verification') => {
     const verificationCode = generateVerificationCode();
      await VerificationCode.create({
        user: userId,
        code: verificationCode,
        type: type,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });

    const { subject, text, html } =
    getEmailVerificationTemplate(verificationCode);
  await sendMail({ to: email, subject, text, html });
      
}

export default createVerificationCodeAndSendMail;