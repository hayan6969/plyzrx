
import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email: string, otp: string, username: string) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: "getsmtp77@gmail.com",
        pass: "gqxjfwtsfbugdiyt", // Use app password for Gmail
      },
    });

    // Email template
    const mailOptions = {
      from: "alerts@plyzrx.com",
      to: email,
      subject: 'PlyzRX - Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e91e63; margin: 0;">PlyzRX</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome ${username}!</h2>
            <p style="color: #666; margin-bottom: 30px; font-size: 16px;">
              Thank you for signing up with PlyzRX. Please verify your email address using the OTP below:
            </p>
            
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 2px dashed #e91e63; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #e91e63; letter-spacing: 4px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              This OTP will expire in 10 minutes for security purposes.
            </p>
            <p style="color: #888; font-size: 14px;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #888; font-size: 12px;">
              © 2024 PlyzRX. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true };
    
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error(`Failed to send OTP email: ${error}`);
  }
};