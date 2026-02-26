export const getEmailVerificationTemplate = (code: string) => {
  return {
    subject: 'Verify Your Email Address',
    text: `Your verification code is ${code}. Use it to complete your registration.`,
    html: `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #111827; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Confirm Your Email</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 24px; line-height: 1.6;">
            Welcome! We're excited to have you. To complete your account setup and start shopping, please use the verification code below:
          </p>
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #111827; font-family: monospace;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
            This code will expire in 15 minutes. If you did not create an account, you can safely ignore this email.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            &copy; ${new Date().getFullYear()} Kizmart Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    `,
  };
};
