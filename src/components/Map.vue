
<template>

<div id="Gmaps">

  <Gmaps class="Gmaps" :center="current_position" :locations="locations" :totalNum="locations.length" ref="Gmaps"/>

</div>

<div id="Table">

  <LocationTable :current_position="current_position" :locations="locations"/>

</div>

</template>

<script lang='ts'>

import axios from "axios";

import { defineComponent, reactive } from "vue";

import Gmaps from './Gmaps.vue';

import LocationTable from './LocationTable.vue';

export default defineComponent({

    components: { Gmaps, LocationTable },

    data(){

	return {

	    current_position: { lat: 0, lng: 0 }, // Coordinates of the position of user

	    locations: [], // Array of searched locations

	};

    },

    mounted(){

	this.getCurPosition();

    },

    methods: {

	getCurPosition(){ // Use browser's function to get the coordinates of user

	    if (navigator.geolocation){

		navigator.geolocation.getCurrentPosition(this.setCurPosition,this.getCurPositionByAPI);

		return;

	    }

	    this.getCurPositionByAPI();

	},

	getCurPositionByAPI(){ // Use web api to get the coordinates of user (Only when browser's function is not working)

	    axios.get("/GetIP").then(response => { // For CORS purpose, details are in the vite.config.ts

		axios.get("/GetLocation/" + response.data).then(response => { // For CORS purpose, details are in the vite.config.ts

		    this.current_position = { lat: response.data.lat, lng: response.data.lon };

		    this.$refs.Gmaps.updateCenter(this.current_position);

		});

	    });
	},

	setCurPosition(position){ // Function to set user's location if the browser's function is available

	    this.current_position = { lat: position.coords.latitude, lng: position.coords.longitude };

	},

	MoveToCurPosition(){ // Function to move the center of map to the user's location

	    this.$refs.Gmaps.MoveToPosition(this.current_position);

	},

  }

});
  
</script>

<style scoped>

</style>
