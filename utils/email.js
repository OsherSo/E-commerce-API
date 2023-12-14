const nodemailer = require('nodemailer');

const sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'shyanne96@ethereal.email',
      pass: 'bHtHCGnxyur2BsXHJt',
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    html: '<b>Hello world?</b>', // html body
  });
};

module.exports = { sendEmail };
