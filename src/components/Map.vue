
<template>

  <div id="Gmaps">
  
    <Gmaps class="Gmaps" ref="Gmaps"/>
    
  </div>

  <div id="Table">

    <vxe-toolbar class="vxe" style="height:10%;">

      <template #buttons>
      
	<vxe-button status="primary" @click="deleteLocations" round>Delete Selection</vxe-button>

	<vxe-pulldown v-model="visible">

	  <div class="vxe-input">
	    
	    <input id="LocationInput" ref="LocationInput" v-model="this.result.Name" placeholder="Location" @focus="setVisible" @input="searchLocation" @keyup.enter="addLocation" class="vxe-input--inner" />

	  </div>

	  <template #dropdown>

	    <div class="dropdown">
	  
              <div class="list-item1" v-for="result in results" :key="result.Location" @click="selectLocation(result)">	
	    	    
		<span>{{ result.Name + result.Address }}</span>	
	    
              </div>
	      
	  
            </div>

	  </template>

	</vxe-pulldown>

	<div style="float: right;">

	  <vxe-button status="primary" round @click="addLocation" ref="AddBtn">Add New</vxe-button>

	</div>

      </template>

    </vxe-toolbar>

    <vxe-table border :data="locations" class="vxe" ref="LocationTable" :align="'center'">

      <vxe-column type="checkbox" width="60"></vxe-column>
      
      <vxe-column field="Name" title="Name"></vxe-column>

      <vxe-column field="Address" title="Address"></vxe-column>
    
    </vxe-table>

    <vxe-pager
      
      v-model:current-page="currentPage"
      
      v-model:page-size="pageSize"
      
      :total="locations.length"
      
      :layouts="['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump']"

      @page-change="setPage"
      
      class="vxe"
      
      ></vxe-pager>

  </div>

</template>

<script lang='ts'>

    import axios from "axios";

import { defineComponent, reactive } from "vue";

import Gmaps from './Gmaps.vue';

  export default defineComponent({

      components: { Gmaps },

      data(){

          return {

              current_position: { lat: 0, lng: 0 },

              locations: [],

	      result: { Name: "", Address: "", Location: {} },

	      selected: false,

	      results: [],

	      visible: false,

	      currentPage: 1,

	      pageSize: 10,

          };

      },

      setup(){},

  mounted(){

    this.getCurPosition();

  },

  methods: {

    getCurPosition(){

      axios.get("https://api.my-ip.io/ip").then(response => {

          axios.get("http://ip-api.com/json/" + response.data).then(response => {

            this.current_position = { lat: response.data.lat, lng: response.data.lon};

            this.setCurPosition();
  
        });
  
      });
    
    },

      setCurPosition(){

	  this.$refs.Gmaps.updateCenter(this.current_position);
	  
      },

      addLocation(){

	  if(this.selected){

	      this.locations.unshift(this.result);

	      this.result = {};

	      this.selected = false;

	      this.results = [];

	  }
	  else if(this.result.length > 0){

	      this.locations.unshift(this.results[0]);

	      this.results = [];

	  }
	  else{


	      
	  }

	  this.$refs.LocationTable.loadData(this.locations);

	  this.updateLocations();

      },

      deleteLocations(){

	  var remove = this.$refs.LocationTable.getCheckboxRecords(true);

	  var new_array = []
	  
	  var index = 0;

	  for(var i in this.locations){

	      if(index < remove.length && this.locations[i].ID == remove[index].ID){

		  index++;
		  
	      }
	      else{

		  new_array.push(this.locations[i]);
		  
	      }
	      
	  }

	  this.locations = new_array;
	  
	  this.$refs.LocationTable.reloadData(this.locations);

	  this.updateLocations();

      },

      updateLocations(){

	  this.$refs.Gmaps.updateLocations(this.locations);

      },

      searchLocation(){

	  if(this.result.Name.length == 0){

	      this.results = [];

	      this.setVisible();

	      return;
	      
	  }

	  var url = "/Gapi/place/textsearch/json?key=AIzaSyCbD0rWlHg0HNA6O8u9R3FRrV6r9xkSrlA&radius=10";

	  url += "&location=" + this.current_position.lat + "%2C" + this.current_position.lng;

	  url += "&query=" + this.result.Name;

	  axios.get(url).then(response => {

	      var search = response.data.results;

	      var n = search.length > 10 ? 10 : search.length;

	      var results = [];

	      for(let i=0;i<n;i++){

		  var cur = search[i];

		  results.push({ ID: cur.place_id, Name: cur.name, Address: cur.formatted_address, Location: cur.geometry.location});		  

	      }

	      this.results = results;

	      this.setVisible();

	  });

      },

	setVisible(){

	  this.visible = this.results.length > 0;

	},

      setPage(){

	  console.log(this.currentPage);
	  
      },

      selectLocation(result){

	  this.result = result;

	  this.selected = true;

	  this.visible = false;

	  this.results = [];

	  this.$refs.LocationInput.focus();
	  
      },

              
  }
  
  });
  
</script>

<style scoped>

  .vxe{

      float: right;

      width: 90%;

  }
  
  #LocationInput{

      height: 100%;

      width: 100%;

  }

</style>
