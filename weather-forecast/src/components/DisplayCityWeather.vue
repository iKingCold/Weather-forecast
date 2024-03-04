<template>
    <div id="weather-data">
        <p class="cityName">{{ resultCity }}</p>
        <p class="cityTemp">{{ resultTemp }}</p>
        <p class="cityWeather">{{ resultWeather }}</p>

        <!-- <button @click="GetSevenDayForecast">7 day forecast</button> -->
        <div v-if="sevenDayForecast">
            <h2>7 day forecast</h2>
            <ul class="forecast">
                <li class="forecast-day" v-for="day in sevenDayForecast.daily" :key="day.dt">
                    <span class="forecast-date">{{ new Date(day.dt * 1000).toLocaleDateString(undefined, {weekday: 'long'}) }}</span>
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