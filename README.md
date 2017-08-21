# Kohmail
An API to send emails

## Installation

Run `npm install` to download dependencies.

Copy the file `.env-example` to `.env` and fill in the API keys for Sparkpost and Sendgrid.

Start the server by running `node index.js`.

## Using the API

To send an email, make a `POST` request to `/sendmail`, with the email formatted as JSON, with `to`, `from`, `subject`, and `text` attributes. The API will responde with a `200` status code when an email is successfully sent.

A well-formed request looks like this:

    POST http://localhost:8080/sendmail
    Content-Type: application/json

    {
      "to": "matt@example.com",
      "from": "trish@foob.ar",
      "subject": "Howdy",
      "text": "Hope you're have a terrific day!"
    }
