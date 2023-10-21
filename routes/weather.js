const express = require('express')
const axios = require('axios')
require('dotenv').config()

const router = express.Router()


// function takes in pollution data
// and returns an object of date times and pm2.5 values
// if there is no PM2.5 value (some locations dont record it)
// set the value to negative one
function massage_polution_data(data) {
    tmp = {}
    for (i in data) {
        tmp[data[i].dt] = data[i]?.components.pm2_5 || -1
    }
    return tmp
}

// take a single weather data point and formatted for that 
// date-time pollution data and return only the neccassary 
// weather information combined with the polution data
function massage_individual_weather_time_data(data, polution) {
    return {
        dt: data.dt,
        time: data.dt_txt.split(' ')[1],
        main: {
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            humidity: data.main.humidity,
        },
        weather: data.weather,
        clouds: data.clouds,
        wind: data.wind,
        visibility: data.visibility,
        pop: data.pop,
        // sometimes rain is undefined if there is no rain and somtimes if rain is defined there can be no value for the next 3 hours
        rain: (data.rain != undefined ? (data.rain.hasOwnProperty('3h') ? data.rain['3h'] : 0) : 0),
        // pollution is sometimes undefined if it is set pm2.5 to -1
        pm2_5: polution || -1
    }
}

// take the weather data and massaged polution data and convert them into
// an object of dates with a list of times and the times list contains the
// data for each time in the day
function massage_weather_data(weather_data, polution_data) {
    tmp = {}
    for (i in weather_data) {
        day = weather_data[i].dt_txt.split(' ')[0]
        if (!tmp[day]) {
            tmp[day] = {
                times: [massage_individual_weather_time_data(weather_data[i], polution_data[weather_data[i].dt])]
            }
        } else {
            tmp[day].times.push(massage_individual_weather_time_data(weather_data[i], polution_data[weather_data[i].dt]))
        }
    }
    return tmp
}


// for each day calculate the average of each of the important
// variables i.e. rain, temp, etc and also calulate a summary
// of amount of rain, min and max temp, and the maximum over the data
function calculate_averages(weather_data) {
    summary = {
        rain: 0.0,
        // using nan instead of Number.MIN_VALUE
        // because min value is not negative for doubles
        // and douing the same for max for consistency
        temp_min: NaN,
        temp_max: NaN,
        max_pm2_5: NaN,
    }
    // for each day in the weather forecast
    for (key of Object.keys(weather_data)) {
        average_temp = 0.0
        feels_like = 0.0
        temp_max = NaN // NaN in case of negative number
        temp_min = NaN
        pm2_5 = 0
        pm2_5_count = 0
        wind_speed = 0
        icon = {}
        clouds = 0
        rain = 0
        // for each timestamp in each day
        for (i in weather_data[key].times) {
            average_temp = average_temp + weather_data[key].times[i].main.temp

            feels_like = feels_like + weather_data[key].times[i].main.feels_like
            rain = rain + weather_data[key].times[i].rain

            clouds = clouds + weather_data[key].times[i].clouds.all

            wind_speed = wind_speed + weather_data[key].times[i].wind.speed

            // the min and max values can sometimes be NaN and Math. min does not handle NaNs
            temp_min = !!temp_min ? Math.min(temp_min, weather_data[key].times[i].main.temp_min) : weather_data[key].times[i].main.temp_min
            temp_max = !!temp_max ? Math.max(temp_max, weather_data[key].times[i].main.temp_max) : weather_data[key].times[i].main.temp_max

            if (weather_data[key].times[i].pm2_5 != -1) {
                pm2_5 = pm2_5 + weather_data[key].times[i].pm2_5
                pm2_5_count = pm2_5_count + 1
                summary.max_pm2_5 = !!summary.max_pm2_5 ? Math.max(weather_data[key].times[i].pm2_5, summary.max_pm2_5) : weather_data[key].times[i].pm2_5
            }
        }
        len = weather_data[key].times?.length || 0
        // add daily averages to the weather data
        weather_data[key].daily_info = {
            average_temp: average_temp / len,
            feels_like: feels_like / len,
            temp_min,
            temp_max,
            rain,
            wind_speed: wind_speed / len,
            clouds: clouds / len,
            pm2_5: pm2_5_count == 0 ? -1 : pm2_5 / pm2_5_count
        }
        summary.rain = summary.rain + rain
        summary.temp_max = !!summary.temp_max ? Math.max(summary.temp_max, temp_max) : temp_max
        summary.temp_min = !!summary.temp_min ? Math.min(summary.temp_min, temp_min) : temp_min
        weather_data[key].dt_str = key
    }
    return { summary, days: weather_data }
}

router
    .route('/:lat/:lon')
    .get((req, res) => {
        try {
        // check latitude and lonituded are acually numbers returns NaN if they are not
        lat = Number(req.params.lat)
        lon = Number(req.params.lon)
        if (!lat || !lon) {
            res.status(200).json({ locations: [], err: "latitude or longitude were incorrect" })
        }
        polution_data = {}
        // get pollution data
        axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}`).then(
            (resp) => {
                if (resp.status != 200) {
                    res.status(200).json({ locations: [], err: "could not find weather in location" })
                    return
                }
                polution_data = massage_polution_data(resp.data.list)
                // get forcast data
                axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`).then(
                    (resp) => {
                        if (resp.status != 200) {
                            res.status(200).json({ locations: [], err: "could not find weather in location" })
                            return
                        }
                        res.header("Access-Control-Allow-Origin", '*')
                        // combine forcast and pollution data, remove unneeded information and send it.
                        res.json(calculate_averages(massage_weather_data(resp.data.list, polution_data)))
                    })
            })
        } catch(err){
            res.status(200).json({ locations: [], err: err })
        }
    });

module.exports = router