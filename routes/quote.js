const express = require('express')
const axios = require('axios')
require('dotenv').config()

const router = express.Router()

// Declare the http headers and options for the axios request
const options = {
  method: 'GET',
  url: 'https://quotes15.p.rapidapi.com/quotes/random/',
  headers: {
    'X-RapidAPI-Key': `${process.env.X_RapidAPI_Key}`,
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
  }
};

// create a handler for GET requests to '/'
router.route('/').get((_req, res) => {
  try {
    axios.request(options).then((resp) => {
      if (resp.status !== 200) {
        // return standard quote is response is unsuccesful
        res.json({
          content: "There is no such thing as bad weather, just soft people",
          name: "Bill Bowerman"
        })
        return
      }
      // return only the quote and author to the frontend
      // discard all other information
      res.json({
        content: resp.data.content,
        name: resp.data.originator.name
      })
    });
  } catch (err) {
    // return standard quote is response is unsuccesful
    res.json({
      content: "There is no such thing as bad weather, just soft people",
      name: "Bill Bowerman"
    })
  }
})

module.exports = router