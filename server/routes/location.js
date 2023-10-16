const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
const router = express.Router()
const API_key = "33bd691dd3447f1945920c52f505ad37"

// http://api.openweathermap.org/geo/1.0/direct?q=dublin,,&appid=33bd691dd3447f1945920c52f505ad37

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
router
    .route('/:location')
    .get((req, res) => {
        if (req.params.location !== "") {
            axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.params.location},&limit=${8}&appid=${API_key}`).then(
                (resp) => {
                    if (resp.status!= 200){
                        res.status(resp.status).json({locations:[],err:"could not find location"})
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
                    // get alphabetic list of all cities in a country
                    res.header("Access-Control-Allow-Origin", '*')
                    res.json({locations,err:undefined})
                })
        } else {
            res.status(404).json({ err: "no location" })
        }
    });

module.exports = router