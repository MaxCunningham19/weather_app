const express = require('express')
const axios = require('axios')
require('dotenv').config()

const router = express.Router()

const options = {
  method: 'GET',
  url: 'https://quotes15.p.rapidapi.com/quotes/random/',
  headers: {
    'X-RapidAPI-Key': `${process.env.X_RapidAPI_Key}`,
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
  }
};

router.route('/').get((req, res) => {
  try {
    axios.request(options).then((resp) => {
      if (resp.status !== 200) {
        res.json({
          content: "There is no such thing as bad weather, just soft people",
          name: "Bill Bowerman"
        })
        return
      }
      res.json({
        content: resp.data.content,
        name: resp.data.originator.name
      })
    });
  } catch (err) {
    res.json({
      content: "There is no such thing as bad weather, just soft people",
      name: "Bill Bowerman"
    })
  }
})

module.exports = router