import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
const BEURL = "http://localhost:3001/api"


createApp({
    data() {
        return {
            searchString: "!!",
            locationSelected: undefined,
            daySelected: undefined,
            locations: [],
            weatherInfo: undefined,
            summary: undefined,
            noResults: false,
            err: undefined,
            quote: undefined,
        }
    },
    methods: {
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
                        this.locations = res.data.locations
                        this.noResults = res.data.locations.length == 0
                        this.daySelected = undefined
                    }
                )
            } catch (err) {
                this.err = err
            }
        },
        show(lat, lon, name) {
            try {
                axios.get(BEURL + "/quote").then(
                    (res) => {
                        this.quote = res.data
                    }
                )
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
        selectTempColor(temp) {
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
        },
        selectAirQualityColor(pm2_5) {
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
        },
        selectRainColor(rain) {
            if (rain < 1.0) {
                return 'white'
            } else if (rain < 5.0) {
                return 'var(--c-2)'
            } else if (rain < 10.0) {
                return 'var(--c-3)'
            } else if (rain < 15.0) {
                return 'var(--c-4)'
            } else if (rain < 25.0) {
                return 'var(--c-5)'
            }
            return 'var(--c-6)'
        }
    },
}).mount("#app")