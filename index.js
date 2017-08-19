require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');

// config

const port = process.env.PORT || 8080;

// Middleware

app.use(bodyParser.json());
app.use(morgan('dev'))


// Routes

app.get('/', (req, res) => {
  res.send('Hello, kohactive!');
})

app.post('/sendmail', (req, res) => {
  const body = req.body;
  if (!body.to || !body.from) {
    res.status(400).send('Missing information')
  } else {
    primaryHandler(req, res);
  }
})

const primaryHandler = (req, res) => {
  const mailObject = {
    content: {
      from: req.body.from,
      subject: req.body.subject || '',
      text: req.body.text || '',
    },
    // recipients: [req.body.to],
    // options: { sandbox: true }
  };
  const sparkPostRequest = {
    uri: 'https://api.sparkpost.com/api/v1/transmissions',
    headers: JSON.stringify({
      'Authorization': process.env.SPARKPOST_API,
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body: JSON.stringify(mailObject),
  };
  request(sparkPostRequest, (error, response, body) => {
    if (error) {
      console.error(error);
    } else if (response.statusCode === 200) {
      res.send('Email sent via Sparkpost!')
    } else {
      backupHandler(req, res);
    }
  });
}

const backupHandler = (req, res) => {
  const requestBody = {
    personalizations: [
      {
        to: [
          {
            email: req.body.to
          }
        ] 
      }
    ],
    from: {
      email: req.body.from
    },
    subject: req.body.subject || '(no subject)',
    content: [
      {
        type: 'text/plain',
        value: req.body.text || ''
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
      console.error(error);
      res.status(500).send('Error on line 95')
    } else if (response.statusCode === 202) {
      res.send('Email sent via Sendgrid!')
    } else {
      console.log(`Status code from Sendgrid: ${response.statusCode}`)
      console.log(body)
      res.status(500).send('Something went wrong with both email providers.')
    }
  })
}

// Listen!

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

/** a successful Sparkpost request
{
  "options": {
    "sandbox": true
  },
  "content": {
    "from": "localpart@sparkpostbox.com",
    "subject": "testing",
    "text": "this is a test"
  },
  "recipients": [
    {
      "address": {
        "email": "leogomez@gmail.com",
        "name": "Leo Gomez"
      }
    }
  ]
}
*/