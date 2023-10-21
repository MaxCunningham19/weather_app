const express = require('express');
const locationRouter = require('./location')
const weatherRouter = require('./weather')
const quoteRouter = require('./quote')

const router = express.Router();

// Create route for locations, weather and quote URI
// and select the appropraite routes
router.use('/locations', locationRouter)
router.use('/weather', weatherRouter)
router.use('/quote',quoteRouter)

module.exports = router