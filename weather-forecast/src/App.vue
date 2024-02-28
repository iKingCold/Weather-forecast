<template>
  <h1>Vad blir det för väder?</h1>
  <WeatherInfo />
</template>

<script>
import WeatherInfo from "./components/WeatherInfo.vue";

export default {
  name: 'App',
  data() {
    return {
    };
  },
  components: { WeatherInfo }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
