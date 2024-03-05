<template>
    <form id="weather-form" @submit.prevent="FetchWeather">
        <label for="city">Enter a city: </label>
        <input type="text" name="city" id="city" v-model="city">
    </form>
    <GeoLocation />
    <div class="search-history">
        <ul class="history-boxes">
            <li v-for="search in searchHistory" :key="search" class="history-box" @click="ShowCityBoxClick(search)">
                <span class="history-city">{{ search.city }}</span>
                <span class="history-temp">{{ search.temperature }}</span>
                <span class="history-weather">{{ search.weather }}</span>
                <span class="weather-icon"><img :src="search.weatherIcon"></span>
            </li>
        </ul>
    </div>
    <div v-show="submitted">
        <DisplayCityWeather :resultCity="resultCity" :resultTemp="resultTemp" :resultWeather="resultWeather"
            :apiKey="apiKey" :cityLatitude="cityLatitude" :cityLongitude="cityLongitude" ref="childRef"/>
    </div>
</template>

<script>
import DisplayCityWeather from './DisplayCityWeather.vue';
import GeoLocation from './GeoLocation.vue';

export default {
    components: { DisplayCityWeather, GeoLocation },

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

            currentLatitude: null,
            currentLongitude: null,
            cityLatitude: null,
            cityLongitude: null,
            searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [], //Hämtar data från LocalStorage, är LocalStorage tom, gör arrayen tom. 
        };
    },
    methods: {
        async FetchWeather() {
            const url = `${this.apiUrl}?appid=${this.apiKey}&q=${this.city}&units=metric`
            const response = await fetch(url);
            const result = await response.json();
            this.city = "";

            if (result.cod != "200") { //Felhantering så att inte undefined blir inlagt i historik-array. 
                alert(`Error: ${result.cod}, ${result.message} \nPlease try again!`);
                return;
            }

            this.cityLatitude = result.coord.lat;
            this.cityLongitude = result.coord.lon;

            // Latest search put in history boxes
            this.resultCity = result.name;
            this.resultTemp = `${Math.round(result.main.temp)}°C`;
            this.resultWeather = result.weather[0].description;
            this.weatherIcon = "https://openweathermap.org/img/wn/" + result.weather[0].icon + ".png";
            console.log(result);
           

            this.AddToHistory({
                city: this.resultCity,
                temperature: this.resultTemp,
                weather: this.resultWeather,
                weatherIcon: this.weatherIcon,
            })

            this.submitted = true

            this.$nextTick(() => {
                this.$refs.childRef.GetSevenDayForecast();
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
            this.city = null;

            this.submitted = true;
        },
    }
}
</script>