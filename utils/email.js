const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'shyanne96@ethereal.email',
    pass: 'bHtHCGnxyur2BsXHJt',
  },
});

const sendEmail = async ({ to, subject, html }) =>
  transporter.sendMail({
    from: 'Osher Solimany',
    to,
    subject,
    html,
  });

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a></p>`;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4>Hello, ${name}</h4>
    ${message}`,
  });
};

module.exports = { sendEmail, sendVerificationEmail };
