const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('./config.js')
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({
  refresh_token: config.refreshToken
});

function get_html_message(name) {
  return `
    <h3>${name}! You're Awesome.</h3>
  `
}

module.exports = { 
  send_mail(name, recipient) {
    const accessToken = OAuth2_client.getAccessToken();
    
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.user,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken
      }
    });

    const mail_options = {
      from: `THE G.O.A.T <${config.user}>`,
      to: recipient,
      subject: 'A Message From The G.O.A.T',
      html: get_html_message(name)
    }

    transport.sendMail(mail_options, (err, result) => {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Success', result);
      }
      transport.close();
    });
  }
}