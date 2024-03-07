<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" :style="{ transform: `rotate(${windDirection}deg)` }">
      <line x1="12" y1="6" x2="12" y2="24" stroke="black" stroke-width="2" /> <!-- Start-och slut-koordinater på linjen => x1: start x2: end. y1: start, y2: end -->
      <polygon points="12,0 18,8 12,6 6,8" fill="red" /> <!-- Spetsarna på pilen -->
    </svg>
  </template>
  
  <script>
  export default {
    props: ['windDirection'],
  };
  </script>  