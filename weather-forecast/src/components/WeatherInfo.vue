<template>
    <header>
        <h1>Calås & Flink's Weather App</h1>
    </header>
    <section class="top">
        <form id="weather-form" @submit.prevent="FetchWeather">
            <label for="city-input"></label>
            <input class="input-group" type="text" id="city-input" v-model="city" autocomplete="off" placeholder="Enter city:">
            <input class="input-group" id="search-button" type="submit" value="Search!">
        </form>
        <button class="input-group" id="current-pos-button" @click="$refs.childRef.GetCurrentPosition(); submitted = true;"><i class="fa-solid fa-location-dot"></i></button>
    </section>
    <section class="search-history">
        <h2 v-show="this.searchHistory.length > 0">Recent locations</h2>
        <ul class="history-boxes">
            <li v-for="search in searchHistory" :key="search" class="history-box" @click="ShowCityBoxClick(search)">
                <h3 class="history-city">{{ search.city }}</h3>
                <div class="history-temp-div">
                    <h4 class="history-temp">{{ search.temperature }}</h4>
                    <img :src="search.weatherIcon">
                </div>
                <h4>{{ search.weatherData }}</h4>
            </li>
        </ul>
    </section>
    <section class="weather-data" v-show="submitted">
        <DisplayCityWeather :resultCity="resultCity" :resultTemp="resultTemp" :resultWeather="resultWeather"
            :largeIcon="largeIcon" :apiKey="apiKey" :cityLatitude="cityLatitude" :cityLongitude="cityLongitude" :sendGeoCity="HandleGeoCity"
            ref="childRef" />
    </section>
</template>

<script>
import DisplayCityWeather from './DisplayCityWeather.vue';

export default {
    components: { DisplayCityWeather },

    data() {
        return {
            apiKey: "0fb98056d14c0b3b443c610b4ebe30e9",
            apiUrl: 'https://api.openweathermap.org/data/2.5/weather',
            city: null,
            submitted: false,

            resultCity: null,
            resultTemp: null,
            resultWeather: null,
            weatherIcon: null,
            largeIcon: null,

            cityLatitude: null,
            cityLongitude: null,
            searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [], //Hämtar data från LocalStorage, är LocalStorage tom, gör arrayen tom. 
        };
    },
    methods: {
        async MakeApiCall(city) {
            const url = `${this.apiUrl}?appid=${this.apiKey}&q=${city}&units=metric`
            const response = await fetch(url);
            const result = await response.json();

            if (result.cod !== 200) { //Felhantering så att inte undefined blir inlagt i historik-array. 
                alert(`Error: ${result.cod}, ${result.message} \nPlease try again!`);
                return null;
            }

            return {
                city: result.name,
                temperature: `${Math.round(result.main.temp)}°C`,
                weatherData: result.weather[0].description,
                weatherIcon: "https://openweathermap.org/img/wn/" + result.weather[0].icon + ".png",
                largeIcon: "https://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png",
                coordinates: result.coord,
            };
        },
        async FetchWeather() {
            let result = await this.MakeApiCall(this.city);
            this.city = "";

            if (result === null) { //Hanterar så att vi inte går vidare om sökningen misslyckades vid ApiCall.
                return;
            }

            this.cityLatitude = result.coordinates.lat;
            this.cityLongitude = result.coordinates.lon;

            // Latest search put in history boxes
            this.resultCity = result.city;
            this.resultTemp = result.temperature;
            this.resultWeather = result.weatherData;
            this.weatherIcon = result.weatherIcon
            this.largeIcon = result.largeIcon

            this.AddToHistory({
                city: this.resultCity,
                temperature: this.resultTemp,
                weatherData: this.resultWeather,
                weatherIcon: this.weatherIcon,
            })

            this.submitted = true

            this.$nextTick(() => {
                this.$refs.childRef.GetSevenDayForecast(this.cityLatitude, this.cityLongitude);
            });
        },
        AddToHistory(search) {
            const cityExists = this.searchHistory.some(city => city.city === search.city);

            if (!cityExists) {
                this.searchHistory.unshift(search); // Lägger till element i början av array
                this.searchHistory = this.searchHistory.slice(0, 3); // Begränsar antalet element i array till 3, som visas på skärmen. 
            }
            else {
                let index = this.searchHistory.findIndex(city => city.city === search.city);
                this.searchHistory.unshift(this.searchHistory.splice(index, 1)[0])
            }
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory)); //Lägger till arrayen i LocalStorage.
        },
        async ShowCityBoxClick(search) {
            this.city = search.city;
            await this.FetchWeather();
        },
        async HandleGeoCity(geoCity) {
            this.city = geoCity;
            await this.FetchWeather();
        },
        async UpdateHistoryData() {
            for (let i = 0; i < this.searchHistory.length; i++) {
                let city = this.searchHistory[i].city;
                let result = await this.MakeApiCall(city);
                this.searchHistory[i] = result;
            }
        }
    },
    mounted() {
        this.UpdateHistoryData();

        setInterval(() => {
            this.UpdateHistoryData();
        }, 300000);
    }
}
</script>