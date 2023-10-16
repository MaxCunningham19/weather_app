const express = require('express');
const citiesRouter = require('./location')
const weatherRouter = require('./weather')

const router = express.Router();

router.use('/locations',citiesRouter)
router.use('/weather',weatherRouter)

  module.exports = router