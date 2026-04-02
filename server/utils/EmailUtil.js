<<<<<<< HEAD
// Optional dependency: nodemailer
// Recommended: run `npm install nodemailer --save` in the server folder to enable real email sending.
const MyConstants = require('./MyConstants');

let transporter = null;
try {
  // try to require nodemailer; if missing, we'll fall back to a noop implementation
  // so the server doesn't crash in environments without the package.
  // CLI: npm install nodemailer --save
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MyConstants.EMAIL_USER,
      pass: MyConstants.EMAIL_PASS
    }
  });
} catch (err) {
  console.warn('nodemailer not available; email sending disabled. Install with: npm install nodemailer --save');
}

const EmailUtil = {
  // send returns a Promise that resolves to true on success, false on failure or when transporter is not available
=======
// CLI: npm install nodemailer --save
const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

const EmailUtil = {
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
  send(email, id, token) {
    const text =
      'Thanks for signing up, please input these informations to activate your account:\n' +
      '\t.id: ' + id + '\n' +
      '\t.token: ' + token;

<<<<<<< HEAD
    if (!transporter) {
      // nodemailer not installed / not configured: for development we'll log the activation info
      // and resolve true so the signup flow can continue during local testing.
      console.warn('EmailUtil.send called but transporter is not configured. Activation token will be logged to console.');
      console.log('Activation for', email, 'id=', id, 'token=', token);
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
=======
    return new Promise(function (resolve, reject) {
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text
      };

<<<<<<< HEAD
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.error('transporter.sendMail error:', err);
          resolve(false);
        } else {
          resolve(true);
        }
=======
      transporter.sendMail(mailOptions, function (err, result) {
        if (err) reject(err);
        else resolve(true);
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
      });
    });
  }
};

module.exports = EmailUtil;
