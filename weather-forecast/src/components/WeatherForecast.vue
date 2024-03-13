<template>
    <div class="current-weather" v-if="resultCity">
        <div class="current-icon-div">
            <img :src="`${largeIcon}`">
        </div>
        <div class="current-weather-div">
            <h2 class="cityName">{{ resultCity }} {{ resultTemp }}</h2>
        </div>
    </div>
    <div class="forecast-div" v-if="sevenDayForecast">
        <ul class="forecast-list">
            <li class="forecast-day" v-for="(day, index) in sevenDayForecast.daily" :key="day.dt">
                <section class="date-section">
                    <img class="forecast-image" :src="`${imageUrl}${day.weather[0].icon}.png`">
                    <div class="date-info">
                        <h3 class="forecast-weekday">{{ index === 0 ? 'Today' : new Date(day.dt * 1000)
                            .toLocaleDateString(undefined, { weekday: 'long' }) }}</h3>
                        <p class="forecast-date">{{ new Date(day.dt * 1000)
                            .toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) }}</p>
                    </div>
                </section>
                <section class="temp-section">
                    <i class="fa-solid fa-temperature-high"></i>
                    <div class="temp-info">
                        <p class="forecast-maxtemp">Max: <strong>{{ (day.temp.max < 1 && day.temp.max > -1) ? 0 :
                            day.temp.max.toFixed() }}</strong>°C</p>
                        <p class="forecast-mintemp">Min: <strong>{{ (day.temp.min < 1 && day.temp.min > -1) ? 0 :
                            day.temp.min.toFixed() }}</strong>°C</p>
                        <!-- Fixes so that the temperature wont display negative 0 degrees(-0) when rounded. -->
                    </div>
                </section>
                <section class="rain-section">
                    <h3 v-if="'rain' in day"><i class="fa-solid fa-cloud-rain"></i> {{ day.rain }} mm</h3>
                    <h3 v-else-if="'snow' in day"><i class="fa-solid fa-cloud-meatball"></i> {{ day.snow }} mm</h3>
                    <h3 v-else><i class="fa-solid fa-cloud"></i> 0 mm</h3>
                </section>
                <section class="condition-section">
                    <h4>{{ day.weather[0].description }}</h4>
                </section>
                <section class="wind-section">
                    <i class="fa-solid fa-wind"></i>
                    <h4>{{ day.wind_speed.toFixed() }} m/s</h4>
                    <SvgArrow :windDirection="day.wind_deg - 180" />
                </section>
            </li>
        </ul>
    </div>
</template>

<script>
import SvgArrow from './SvgArrow.vue';

export default {
    props: ['resultCity', 'resultTemp', 'resultWeather', 'largeIcon', 'apiKey', 'cityLatitude', 'cityLongitude', 'sendGeoCity'],
    components: { SvgArrow },
    data() {
        return {
            sevenDayForecast: null,
            geoCity: null,
            imageUrl: "https://openweathermap.org/img/wn/",
            url: "https://api.openweathermap.org/data/2.5/onecall",
            reverseGeoUrl: "https://api.openweathermap.org/geo/1.0/reverse",
        }
    },
    methods: {
        async getSevenDayForecast(lat, lon) {
            const forecastUrl = `${this.url}?lat=${lat}&lon=${lon}&exclude=minutely&appid=${this.apiKey}&units=metric`
            const forecastResponse = await fetch(forecastUrl);
            const forecastResult = await forecastResponse.json();

            this.sevenDayForecast = forecastResult;
        },
        getCurrentPosition() {
            if (navigator.geolocation) {  // Koll om platsdelning i browsern är aktiverat (eller om browsern inte stöder det/enheten inte har möjlighet att dela position)
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let lat = position.coords.latitude;
                        let lon = position.coords.longitude;

                        this.getGeoCity(lat, lon);
                        this.getSevenDayForecast(lat, lon);
                    },
                    (error) => {
                        alert("Error getting location:", error.message)
                    }
                );
            }
            else {
                alert("Geolocation not supported by this browser");
            }
        },
        async getGeoCity(lat, lon) {
            const geocodingUrl = `${this.reverseGeoUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
            const geoResponse = await fetch(geocodingUrl);
            const geoResult = await geoResponse.json();

            this.geoCity = geoResult[0].name;

            this.sendGeoCity(this.geoCity); // sendGeoCity() är i själva verket HandleGeoCity-metoden i parent-comp (egen anteckning för att fatta)
        },
    },
}
</script>