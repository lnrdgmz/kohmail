require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');

const backupProvider = require('./providers/sendgrid');
const primaryProvider = require('./providers/sparkpost');

// config

const port = process.env.PORT || 8080;

// Middleware

app.use(bodyParser.json());
app.use(morgan('dev'))


// Routes

app.get('/', (req, res) => {
  res.send('See README for instructions on how to use this API');
})

app.post('/sendmail', (req, res) => {
  const body = req.body;
  if (!body.to || !body.from || !body.subject || !body.text) {
    res.status(400).send('Missing information')
  } else {
    sendmailHandler(req, res);
  }
})

const sendmailHandler = (req, res) => {
  const responseCallback = (error, success) => {
    if (error) {
      console.error(error);
      res.status(500).send('Email not sent due to an error.')
    } else {
      res.send(success);
    }
  }
  primaryProvider(req.body, (error, result) => {
    if (error) {
      backupProvider(req.body, responseCallback);
    } else {
      responseCallback(null, result);
    }
  })
}


// Listen!

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})