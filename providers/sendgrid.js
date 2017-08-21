const request = require('request');

const sendGridRequest = (email, callback) => {
  const requestBody = {
    personalizations: [
      {
        to: [
          {
            email: email.to
          }
        ] 
      }
    ],
    from: {
      email: email.from
    },
    subject: email.subject || '(no subject)',
    content: [
      {
        type: 'text/plain',
        value: email.text || ''
      }
    ]
  }
  const requestObject = {
    uri: 'https://api.sendgrid.com/v3/mail/send',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  }
  request(requestObject, (error, response, body) => {
    if (error) {
      callback('An error occurred when making a request to Sendgrid.')
    } else if (response.statusCode === 202) {
      callback(null, 'Email send via Sendgrid')
    } else {
      callback(`Sendgrid responsed with a ${response.statusCode} code instead of a 202.`)
    }
  })
}

module.exports = sendGridRequest;