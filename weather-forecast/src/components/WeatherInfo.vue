<template>
    <form id="weather-form" @submit.prevent="FetchWeather">
        <label for="city">Enter a city: </label>
        <input type="text" name="city" id="city" v-model="city">
    </form>
    <button @click="GetCurrentPosition">Current position</button>
    <p v-if="currentLatitude !== null && currentLongitude !== null">
        Current position: LAT: {{ currentLatitude }}, LON: {{ currentLongitude }}
    </p>
    <div class="search-history">
        <ul class="history-boxes">
            <li v-for="search in searchHistory" :key="search" class="history-box" @click="ShowCityBoxClick(search)">{{ search.city }} - {{ search.temperature }} {{ search.weather }}</li>
        </ul>
    </div>
    <div v-show="submitted">
        <DisplayCityWeather
        :weatherData="weatherData"
        :apiKey="apiKey"
        :cityLatitude="cityLatitude"
        :cityLongitude="cityLongitude" />
    </div>
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

            weatherData: {
                resultCity: null,
                resultTemp: null,
                resultWeather: null,
            },

            currentLatitude: null,    // För senare anrop av långtids-prognos
            currentLongitude: null,   // För senare anrop av långtids-prognos
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

            console.log(result)

            if (result.cod != "200") { //Felhantering så att inte undefined blir inlagt i historik-array. 
                alert(`Error: ${result.cod}, ${result.message} \nPlease try again!`);
                return;
            }

            // Displays in 'DisplayCityWeather' component
            this.weatherData.resultCity = result.name;
            this.weatherData.resultTemp = `${Math.round(result.main.temp)}°C`;
            this.weatherData.resultWeather = result.weather[0].description;

            this.cityLatitude = result.coord.lat;
            this.cityLongitude = result.coord.lon;

            // Latest search put in history boxes
            this.resultCity = result.name;
            this.resultTemp = `${Math.round(result.main.temp)}°C`;
            this.resultWeather = result.weather[0].description;

            this.AddToHistory({
                city: this.resultCity,
                temperature: this.resultTemp,
                weather: this.resultWeather,
            })

            this.submitted = true // PLACEHOLDER FOR LAST SAVE
        },
        AddToHistory(search) {
            this.searchHistory.unshift(search); // Lägger till element i början av array
            this.searchHistory = this.searchHistory.slice(0, 3); // Begränsar antalet element i array till 3, som visas på skärmen. 
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory)); //Lägger till arrayen i LocalStorage.
        },
        ShowCityBoxClick(search) {
            console.log("Showing info", search)

            this.weatherData.resultCity = search.city;
            this.weatherData.resultTemp = search.temperature;
            this.weatherData.resultWeather = search.weather;

            this.submitted = true;
        },
        GetCurrentPosition() {
            if (navigator.geolocation) {  // Koll om platsdelning i browsern är aktiverat (eller om browsern inte stöder det/enheten inte har möjlighet att dela position)
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.currentLatitude = position.coords.latitude;
                        this.currentLongitude = position.coords.longitude;
                    },
                    (error) => {
                        alert("Error getting location:", error.message)
                    }
                );
            }
            else {
                alert("Geolocation not supported by this browser");
            }
        }
    }
}
</script>