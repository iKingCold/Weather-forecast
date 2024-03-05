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
                    <span class="forecast-temp">{{ (day.temp.day).toFixed() }}°C</span>
                    <span class="forecast-weather">{{ day.weather[0].description }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['resultCity', 'resultTemp', 'resultWeather', 'apiKey', 'cityLatitude', 'cityLongitude'],
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

            this.sevenDayForecast = forecastResult;
        },
        GetCurrentPosition(lat, lon) {
            if (navigator.geolocation) {  // Koll om platsdelning i browsern är aktiverat (eller om browsern inte stöder det/enheten inte har möjlighet att dela position)
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;

                        console.log("test i if-sats:", lat, lon) // DEBUG PURPOSE

                        this.GetGeoCity(lat, lon);      // DEBUG PURPOSE
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

            const geoCityFound = geoResult[0].name;
            this.geoCity = geoCityFound;
            
            console.log("Hittad stad: ", this.geoCity) // DEBUG PURPOSE
        },
    },
}
</script>