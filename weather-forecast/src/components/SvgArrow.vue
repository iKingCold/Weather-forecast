<template>
  <div class="svg-div">
    <svg width="40" height="40" viewBox="0 0 24 24" :style="{ transform: `rotate(${windDirection}deg)` }">
      <line x1="12" y1="4" x2="12" y2="21" stroke="black" stroke-width="1.5" /><!-- Start-och slut-koordinater på linjen => x1: start x2: end. y1: start, y2: end -->
      <polygon points="12,0 18,8 12,5 6,8" fill="#f300e7" /> <!-- Spetsarna på pilen -->
    </svg>
  </div>
</template>

<script>
export default {
  props: ['windDirection'],
};
</script>