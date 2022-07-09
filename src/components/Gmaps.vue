
<template>
  <GoogleMap ref="Gmap" api-key="AIzaSyCbD0rWlHg0HNA6O8u9R3FRrV6r9xkSrlA" style="width:100%;height:100%;" :center="center" :zoom="5">
  
  <Marker v-for="(location, index) in locations" :options="{ position: location.Location, title: location.Name }" />

  <InfoWindow v-if="totalNum > 0" :options="{position: last_location.Location}">

    <div style="text-align: center">

      <h2>{{last_location.Name}}</h2><br>

      <h3>{{last_location.Address}}</h3><br>

      <h4>Timezone: {{TimeZone}}</h4><br>

      <h4>Time: {{Time}}</h4>
      
    </div>
    
   </InfoWindow>

  </GoogleMap>
</template>

<script lang='ts'>
    import { defineComponent } from "vue";
    import axios from "axios";
    import { GoogleMap, Marker, InfoWindow } from "vue3-google-map";

    export default defineComponent({

	components: { GoogleMap, Marker, InfoWindow },

	props: {

	    center: Object, // Coordinates of the location of the user

	    locations: Array, // Array of searched locations

	    totalNum: 0, // Total number of searched locations (To determine if the latest location should be updated)
	    
	},

	watch: {

	    totalNum: { // When the array of locations changed, update the infowindow of the timezone of the latest searched location

		handler(newNum, oldNum){ 

		    if(newNum > 0){

			this.last_location = this.locations[0];

			this.getTime();
			
		    }
		    
		}
		
	    },
	    
	},

	data() {

	    return {

		//center: { lat: 0, lng: 0 },

		//locations: [],

		last_location: {}, // lastest searched location

		visible: false,

		TimeZone: "", // String of the timezone

		Time: "", // String of the time in format yyyy-mm-dd hh:MM
		
	    };
	    
	},

	methods: {

	    updateCenter(location){

		this.center = location;

	    },

	    updateLocations(locations){

		if(locations.length > 0){

		    this.last_location = locations[0];

		    this.visible = true;

		}
		else{
		    
		    this.visible = false;
		    
		}

		this.locations = locations;

		this.getTime();

	    },

	    MoveToPosition(location){ // Move the center of the map to a certain location

		this.$refs.Gmap.map.panTo(location);
		
	    },

	    getTime(){ // Get the timezone and current time by the coordinates

		var timestamp = this.getUTCTimestamp();

		var url = "/Gapi/timezone/json?key=AIzaSyCbD0rWlHg0HNA6O8u9R3FRrV6r9xkSrlA";

		url += "&location=" + this.last_location.Location.lat + "%2C" + this.last_location.Location.lng;

		url += "&timestamp=" + timestamp;

		axios.get(url).then(response => {

		    var result = response.data;

		    this.TimeZone = result.timeZoneName + ", " + result.timeZoneId;

		    this.Time = this.getFormatDateString(new Date((timestamp + result.dstOffset + result.rawOffset) * 1000));

		});

	    },

	    getUTCTimestamp(){ // Get current UTC timestamp by seconds

		var date = new Date();

		var y =  date.getUTCFullYear();
		
		var m = date.getUTCMonth() ;

		var d = date.getUTCDate();

		var h = date.getUTCHours();

		var M = date.getUTCMinutes();

		var s = date.getUTCSeconds();

		return Date.parse(new Date(y,m,d,h,M,s)) / 1000;

            },

	    getFormatDateString(date){ // Change Date object to string in format yyyy-mm-dd hh:MM

		var y = date.getFullYear();

		var m = date.getMonth() + 1;

		var d = date.getDate();

		var h = date.getHours();

		var M = date.getMinutes();

		m = ( m < 10 ? "0" : "" ) + m;

		d = ( d < 10 ? "0" : "" ) + d;

		h = ( h < 10 ? "0" : "" ) + h;
		
		M = ( M < 10 ? "0" : "" ) + M;

		return y + "-" + m + "-" + d + " " + h + ":" + M;

	    },
	    
	},

    });

</script>

<style scoped>
</style>
