// server/services/email.service.js

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_CODE
  }
});

/**
 * @param {Object} options mail options,
 * which includes "from", "to",
 * "subject" and "text" fields.
 * 
 * @throws error
 * @returns message about error or success
 */
async function sendEmail(options) {
  return await transporter.sendMail(options, (error, info) => {
    if (error) {
      throw error;
      // return ` ${__filename} | Error sending email: ${error}`;
    } else {
      return ` ${__filename} | Email send: ${info.response}`;
    }
  });
}

/**
 * Creates confirmation code in database and sends it to email.
 * @param {String} email email address
 * @param {String} code confirmation code
 * 
 * @throws error
 * @returns message about error or success
 */
async function sendConfirmationCode(email, code) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Registration',
    text: `Confirm your email address: ${code}`
  };
  return await sendEmail(mailOptions);
}

/**
 * Sends congratulation when user finishes registration.
 * @param {String} email email address
 * 
 * @throws error
 * @returns message about error or success
 */
async function sendCongratulations(email) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Congratulations',
    text: 'Thank you for registration in Uevent!',
  };
  return await sendEmail(mailOptions);
}

/**
 * Sends letter with link for reset password.
 * @param {String} email email address
 * @param {String} link reset link
 * 
 * @throws error
 * @returns message about error or success
 */
async function sendResetLink(email, link) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Reset Password',
    text: `Click on link below to reset your password:\n`
          + link,
  };
  return await sendEmail(mailOptions);
}

module.exports = {
  sendEmail,
  sendConfirmationCode,
  sendCongratulations,
  sendResetLink
}
