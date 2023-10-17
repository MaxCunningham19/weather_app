const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api.js')
const PORT = 3001
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/api', apiRouter)

app.listen(PORT, () =>
  console.log(`backend listening on port ${PORT}`),
);