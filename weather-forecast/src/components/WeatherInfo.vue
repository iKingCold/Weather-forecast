<template>
    <h2>Weather component</h2>
    <form id="weather-form" @submit.prevent="FetchWeather">
        <label for="city">Enter a city: </label>
        <input type="text" name="city" id="city" v-model="city">
    </form>
    <div id="weather-data">
        <p>{{ resultCity }}</p>
        <p>{{ resultTemp }}</p>
        <p>{{ resultWeather }}</p>
    </div>
    <div class="search-history">
        <ul>
            <li v-for="search in searchHistory" :key="search.city">{{ search.city }} - {{ search.temperature }} {{ search.weather }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            apiKey: "0fb98056d14c0b3b443c610b4ebe30e9",
            apiUrl: 'https://api.openweathermap.org/data/2.5/weather',
            city: null,
            resultCity: "",
            resultTemp: "",
            resultWeather: "",
            latitude: null,    // För senare anrop av långtids-prognos
            longitude: null,   // För senare anrop av långtids-prognos
            searchHistory: [],
        };
    },
    methods: {
        async FetchWeather() {
            const url = `${this.apiUrl}?appid=${this.apiKey}&q=${this.city}&units=metric`
            const response = await fetch(url);
            const result = await response.json();

            this.resultCity = result.name;
            this.resultTemp = `${Math.round(result.main.temp)}°C`;
            this.resultWeather = result.weather[0].description;

            this.latitude = result.coord.lat;
            this.longitude = result.coord.lon;

            this.addToHistory({
                city: this.resultCity,
                temperature: this.resultTemp,
                weather: this.resultWeather,
            })

            console.log(result)
        },
        addToHistory(search) {
            this.searchHistory.unshift(search); // Lägger till element i början av array

            this.searchHistory = this.searchHistory.slice(0, 3); // Begränsar antalet element i array till 3, som visas på skärmen. 
        }
    }
}
</script>