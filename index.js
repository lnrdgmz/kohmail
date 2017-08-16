require('dotenv').config();

const app = require('express')();

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello, kohactive!');
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})