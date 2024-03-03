<template>
    <div id="weather-data">
        <p>{{ weatherData.resultCity }}</p>
        <p>{{ weatherData.resultTemp }}</p>
        <p>{{ weatherData.resultWeather }}</p>
        
        <button @click="GetFourDayForecast">4 day forecast</button>
        <div v-if="fourDayForecast">
            <h2>4 day forecast</h2>
            <ul>
                <li v-for="day in fourDayForecast.daily" :key="day.dt">
                    {{ new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' }) }} - {{ (day.temp.day - 273.15).toFixed() }}°C - {{ day.weather[0].description }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['weatherData', 'apiKey', 'cityLatitude', 'cityLongitude'],
    data() {
        return {
            fourDayForecast: null,
        }
    },
    methods: {
        async GetFourDayForecast() {

            const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.cityLatitude}&lon=${this.cityLongitude}&exclude=minutely&appid=${this.apiKey}`
            const forecastResponse = await fetch(forecastUrl);
            const forecastResult = await forecastResponse.json();

            console.log("Forecast result: ", forecastResult)

            this.fourDayForecast = forecastResult;
        },
    },
}
</script>