<template>
  <WeatherHeader />
</template>

<script>
import WeatherHeader from "./components/WeatherHeader.vue";

export default {
  name: 'App',
  data() {
    return {
    };
  },
  components: { WeatherHeader }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
./components/WeatherHeader.vue