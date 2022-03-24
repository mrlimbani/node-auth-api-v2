const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
    const msg = { from: config.email.from, to, subject, text };
    const mailSend = await transport.sendMail(msg);
    return { mailsend:mailSend };
};

/**
 * Send an email
 * @param {String} from
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendAdminEmail = async (from, to, subject, text) => {
    const msg = { from: from || config.email.from, to, subject, text };
    await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
};

/**
 * @param {Object} feedBack
 * @returns {Promise<void>}
 */
const sendFeedBackEmail = async (feedBack) => {
    const { comment, user } = feedBack;
    const { name } = user;
    const subject = `Feedback received from ${name}`;
    const text = `Below is the feedback received from ${name} \n FeedBack: ${comment}`;
    await sendAdminEmail(config.email.from, config.email.from, subject, text);
};

module.exports = {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendFeedBackEmail,
};
