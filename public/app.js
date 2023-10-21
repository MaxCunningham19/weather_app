import { createApp} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
const BEURL = "http://localhost:3001/api"

// select a color for the rain summary container
function selectRainColor (rain) {
    if (rain < 2.5) {
        return 'white'
    } else if (rain < 10.0) {
        return 'var(--c-2)'
    } else if (rain < 15.0) {
        return 'var(--c-3)'
    } else if (rain < 25.0) {
        return 'var(--c-4)'
    } else if (rain < 35.0) {
        return 'var(--c-5)'
    }
    return 'var(--c-6)'
}

// select a color for the Air quality summary container
function selectAirQualityColor(pm2_5) {
    if (pm2_5 < 2.0) {
        return 'white'
    } else if (pm2_5 < 6.0) {
        return 'var(--t-l-1)'
    } else if (pm2_5 < 12.0) {
        return 'var(--t-l-2)'
    } else if (pm2_5 < 18.0) {
        return 'var(--b-1)'
    } else if (pm2_5 < 22.0) {
        return 'var(--b-2)'
    }
    return 'var(--b-2.5)'
}

// select a color for the temperature containers
function selectTempColor(temp) {
    if (temp < 3.0) {
        return 'var(--c-4)'
    } else if (temp < 6.0) {
        return 'var(--c-3)'
    } else if (temp < 9.0) {
        return 'var(--c-2)'
    } else if (temp < 12.0) {
        return 'var(--c-1)'
    } else if (temp < 15.0) {
        return 'var(--c-0)'
    } else if (temp < 18.00) {
        return 'var(--w-1)'
    } else if (temp < 21.0) {
        return 'var(--w-2)'
    } else if (temp < 24.0) {
        return 'var(--w-3)'
    } else if (temp < 27.0) {
        return 'var(--w-4)'
    }
    return 'var(--w-5)'
}

createApp({
    data() {
        // define all variables to be used in the frontend
        return {
            searchString: "!!", // users inputted search string
            locationSelected: undefined, // the name of the location they select
            daySelected: undefined, // if the user has selected a day to view individual times
            locations: [], // the list of possible locations based on the search string
            weatherInfo: undefined, // the returned forecast information
            summary: undefined, // the summary data of the 5-days
            noResults: false, // true if the location data was empty and no locations exist
            err: undefined, // if an error is returned from the backend
            quote: undefined, // the positive quote returned from the backend
        }
    },
    methods: {
        // search retrives possible locations based on the inputted search string
        search() {
            this.locationSelected = undefined
            if (this.searchString == "!!") {
                return
            }
            try {
                axios.get(BEURL + "/locations/" + this.searchString.split(" ").join("_")).then(
                    (res) => {
                        if (!!res.data.err) {
                            this.err = res.data.err
                        }
                        this.daySelected = undefined
                        this.locations = res.data.locations
                        this.noResults = res.data.locations.length == 0
                    }
                )
            } catch (err) {
                this.err = err
            }
        },
        // show retives forecast, summary and quote data from the backend based on 
        // the location selected by the user
        show(lat, lon, name) {
            try {
                // async get quote data
                axios.get(BEURL + "/quote").then(
                    (res) => {
                        this.quote = res.data
                    }
                )
                // async get forecast data
                axios.get(BEURL + "/weather/" + lat + "/" + lon).then(
                    (res) => {
                        if (!!res.data.err) {
                            this.err = res.data.err
                        }
                        this.daySelected = undefined
                        this.summary = res.data.summary
                        this.weatherInfo = res.data.days
                        this.locationSelected = name
                    }
                )
            } catch (err) {
                this.err = err
            }
        },
        selectRainColor,
        selectAirQualityColor,
        selectTempColor,
    },
}).mount("#app")