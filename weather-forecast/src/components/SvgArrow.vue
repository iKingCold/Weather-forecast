<template>
  <div class="svg-div">
    <svg width="40" height="40" viewBox="0 0 24 24" :style="{ transform: `rotate(${windDirection}deg)` }">
      <!-- <line x1="12" y1="6" x2="12" y2="24" stroke="green" stroke-width="2" /> Start-och slut-koordinater på linjen => x1: start x2: end. y1: start, y2: end -->
      <polygon points="12,0 18,6 12,4 6,6" fill="yellow" /> <!-- Spetsarna på pilen -->
    </svg>
  </div>
  </template>
  
  <script>
  export default {
    props: ['windDirection'],
  };
  </script>  