const nodemailer = require('nodemailer');
const pug = require('pug');
// Advanced converter that parses HTML and returns beautiful text.
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.username = user.name;
    this.url = url;

    /* 
      All email addresses can be plain email addresses
        'foobar@example.com'
      or with formatted name (includes unicode support)
        'Ноде Майлер <foobar@example.com>'
    */
    this.from = `Airbnb ✈️ <${process.env.EMAIL_FROM}>`;
  }

  // transporter is going to be an object that is able to send mail
  transporter() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject, variables) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      username: this.username,
      url: this.url,
      subject, // Subject line,
      ...variables
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../resources/images/app/logo.png`,
          cid: 'uniq-logo.png'
        }
      ]
    };

    // 3) Send email
    await this.transporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Airbnb Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async sendCheckEmailChanged(data) {
    await this.send(
      'email_changed',
      'Did you just update your email?',
      data
    );
  }

  async sendConfirmCheckEmailChanged(data) {
    await this.send(
      'confirm_email_changed',
      'Confirm your changed email',
      data
    );
  }
}