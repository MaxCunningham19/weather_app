const express = require('express');
const citiesRouter = require('./location')
const weatherRouter = require('./weather')
const quoteRouter = require('./quote')

const router = express.Router();

router.use('/locations', citiesRouter)
router.use('/weather', weatherRouter)
router.use('/quote',quoteRouter)

module.exports = router