<template>
    <div id="weather-data">
        <p class="cityName">{{ resultCity }}</p>
        <p class="cityTemp">{{ resultTemp }}</p>
        <p class="cityWeather">{{ resultWeather }}</p>

        <div class="forecast-div" v-if="sevenDayForecast">
            <h2>7 day forecast</h2>
            <ul class="forecast-list">
                <li class="forecast-day" v-for="(day, index) in sevenDayForecast.daily" :key="day.dt">
                    <img class="forecast-image" :src="`${imageUrl}${day.weather[0].icon}.png`">
                    <section class="date-section">
                        <h3 class="forecast-weekday">{{ index === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString(undefined, {weekday: 'long'}) }}</h3>
                        <span class="forecast-date">{{ new Date(day.dt * 1000).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) }}</span>
                    </section>
                    <i class="fa-solid fa-temperature-high"></i>
                    <section class="temp-section">
                        <span class="forecast-maxtemp">Max: <strong>{{ (day.temp.max).toFixed() }}</strong>°C</span>
                        <span class="forecast-mintemp">Min: <strong>{{ (day.temp.min).toFixed() }}</strong>°C</span>
                    </section>
                    <i class="fa-solid fa-cloud-rain"></i>
                    <section class="rain-section">
                        <h3 v-if="'rain' in day">{{ day.rain }} mm</h3>
                        <h3 v-else>0 mm</h3>
                    </section>
                    <span class="forecast-weather">{{ day.weather[0].description }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['resultCity', 'resultTemp', 'resultWeather', 'apiKey', 'cityLatitude', 'cityLongitude', 'sendGeoCity'],
    data() {
        return {
            sevenDayForecast: null,
            geoCity: null,
            imageUrl: "https://openweathermap.org/img/wn/",
            url: "https://api.openweathermap.org/data/2.5/onecall",
            reverseGeoUrl: "http://api.openweathermap.org/geo/1.0/reverse",
             
        }
    },
    methods: {
        async GetSevenDayForecast(lat, lon) {
            const forecastUrl = `${this.url}?lat=${lat}&lon=${lon}&exclude=minutely&appid=${this.apiKey}&units=metric`
            const forecastResponse = await fetch(forecastUrl);
            const forecastResult = await forecastResponse.json();

            console.log(forecastResult);

            this.sevenDayForecast = forecastResult;
        },
        GetCurrentPosition() {
            if (navigator.geolocation) {  // Koll om platsdelning i browsern är aktiverat (eller om browsern inte stöder det/enheten inte har möjlighet att dela position)
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let lat = position.coords.latitude;
                        let lon = position.coords.longitude;

                        console.log("test i if-sats:", lat, lon) // DEBUG PURPOSE

                        this.GetGeoCity(lat, lon);
                        this.GetSevenDayForecast(lat, lon);
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
        async GetGeoCity(lat, lon) {
            const geocodingUrl = `${this.reverseGeoUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
            const geoResponse = await fetch(geocodingUrl);
            const geoResult = await geoResponse.json();

            this.geoCity = geoResult[0].name;
            
            this.sendGeoCity(this.geoCity); // sendGeoCity() är i själva verket HandleGeoCity-metoden i parent-comp (egen anteckning för att fatta)
        },
    },
}
</script>