<template>
    <div id="weather-data">
        <p>{{ resultCity }}</p>
        <p>{{ resultTemp }}</p>
        <p>{{ resultWeather }}</p>

        <button @click="GetSevenDayForecast">7 day forecast</button>
        <div v-if="sevenDayForecast">
            <h2>7 day forecast</h2>
            <ul>
                <li v-for="day in sevenDayForecast.daily" :key="day.dt">
                    {{ new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' }) }} - {{
            (day.temp.day).toFixed() }}°C - {{ day.weather[0].description }}</li>
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
            url: "https://api.openweathermap.org/data/2.5/onecall",
        }
    },
    methods: {
        async GetSevenDayForecast() {

            const forecastUrl = `${this.url}?lat=${this.cityLatitude}&lon=${this.cityLongitude}&exclude=minutely&appid=${this.apiKey}&units=metric`
            const forecastResponse = await fetch(forecastUrl);
            const forecastResult = await forecastResponse.json();

            this.sevenDayForecast = forecastResult;
        },
    },
}
</script>