<template>
    <div id="weather-data">
        <p>{{ weatherData.resultCity }}</p>
        <p>{{ weatherData.resultTemp }}</p>
        <p>{{ weatherData.resultWeather }}</p>
    </div>
</template>

<script>
export default {
    props: ['weatherData'],
}
</script>