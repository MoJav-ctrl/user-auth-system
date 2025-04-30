const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  }
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `http://yourapp.com/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">this link</a> to reset your password.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail
};

