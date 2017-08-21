/*
* This is configured to use the Sparkpost sandbox, which requires the use
* of 'localhost@sparkpostbox.com' as the 'from' address. The sandbox also
* has a limit of five emails total.
*/
const request = require('request');

const sparkpostRequest = (email, callback) => {
  const mailObject = {
    content: {
      from: 'localpart@sparkpostbox.com',
      subject: email.subject || '(no subject)',
      text: email.text || '',
    },
    recipients: [
      {
        address: {
          email: email.to
        }
      }
    ],
    options: { sandbox: true }
  };
  const sparkPostRequest = {
    uri: 'https://api.sparkpost.com/api/v1/transmissions',
    headers: {
      'Authorization': process.env.SPARKPOST_API,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(mailObject),
  };

  request(sparkPostRequest, (error, response, body) => {
    if (error) {
      callback('There was an error making a request to Sparkpost.')
    } else if (response.statusCode === 200) {
      callback(null, 'Email send via Sparkpost');
    } else {
      callback(`Sparkpost responded with a ${response.statusCode} status code instead of 200.`)
    }
  });
}

module.exports = sparkpostRequest;