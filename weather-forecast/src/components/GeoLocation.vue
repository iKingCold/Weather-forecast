<template>
    <button @click="GetCurrentPosition">Current position</button>
    <p v-if="currentLatitude !== null && currentLongitude !== null">
        Current position: LAT: {{ currentLatitude }}, LON: {{ currentLongitude }}
    </p>
</template>

<script>
export default {
    data() {
        return {
            currentLatitude: null,
            currentLongitude: null,
        }
    },
    methods: {
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