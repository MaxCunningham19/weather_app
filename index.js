const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const apiRouter = require('./routes/api.js')

const app = express();
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api',apiRouter)
app.use(express.static('public'))



app.listen(3001, () =>
  console.log('backend listening on port 3001'),
);