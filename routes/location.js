const express = require('express')
const axios = require('axios')
require('dotenv').config()

const router = express.Router()

// declare the router and create a function to handle
// GET requests to /* URIs
router
    .route('/:location')
    .get((req, res) => {
        try {
            axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.params.location},&limit=${8}&appid=${process.env.OPENWEATHERMAP_API_KEY}`).then(
                (resp) => {
                    if (resp.status != 200) {
                        res.status(200).json({ locations: [], err: "could not find location" })
                        return
                    }
                    locations = resp.data
                    locations = locations.map((loc) => {
                        return {
                            name: loc.name,
                            lat: loc.lat,
                            lon: loc.lon,
                            state: loc.state,
                            country: loc.country
                        }
                    })
                    res.header("Access-Control-Allow-Origin", '*')
                    res.json({ locations, err: undefined })
                })
        } catch (err) {
            res.status(200).json({ locations: [], err })
        }
    });

module.exports = router