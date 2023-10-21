const express = require('express');
const apiRouter = require('./routes/api.js')
const PORT = 3001

const app = express();

// Serve static files from /public for the frontend
app.use(express.static('public'))

// Create route for backend API
app.use('/api', apiRouter)

// Start the server
app.listen(PORT, () =>
  console.log(`backend listening on port ${PORT}`),
);