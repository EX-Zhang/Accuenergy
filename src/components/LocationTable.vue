
<template>

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
	    	    
		<span>{{ result.Name + ": " + result.Address }}</span>	
	    
              </div>
	      
	  
            </div>

	  </template>

	</vxe-pulldown>

	<div style="float: right;">

	  <vxe-button status="primary" round @click="addLocation" ref="AddBtn">Add New</vxe-button>

	  <vxe-button status="primary" round @click="this.$parent.MoveToCurPosition" ref="AddBtn">Current Location</vxe-button>

	</div>

      </template>

    </vxe-toolbar>

    <vxe-table border :data="locations" class="vxe" ref="LocationTable" :align="'center'">

      <vxe-column type="checkbox" width="60"></vxe-column>
      
      <vxe-column field="Name" title="Name" min-width="10px"></vxe-column>

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

</template>

<script lang="ts">

  import axios from "axios";

  import { defineComponent, reactive } from "vue";

  export default defineComponent({

      props: {

	  current_position: Object,

	  locations: Array,

      },

      data(){

          return {

	      result: { Name: "", Address: "", Location: {} }, // The selected location that prepared to add to the location array

	      selected: false, // Whether a result is selected

	      results: [], // Array to store all possible results searched with the input string

	      visible: false, // Whether the dropdown list of possible results is visible

	      currentPage: 1, // Current page of the table

	      pageSize: 10, // Size of a page

          };

      },

      methods: {

          addLocation(){ // Add the selected location to the array, or add the first search result if nothing is selected.

	      if(this.selected){

		  this.locations.unshift(this.result);

		  this.result = {};

		  this.selected = false;

		  this.results = [];

	      }

	      else if(this.results.length > 0){

		  this.locations.unshift(this.results[0]);

		  this.results = [];

		  this.$refs.LocationInput.focus();

	      }

	      this.setPage();

	  },

	  deleteLocations(){ // Delete the selected locations.

	      var remove = this.$refs.LocationTable.getCheckboxRecords(true);

	      var i = 0;

	      var j = 0;

	      while(i < this.locations.length){
		
		  if(j >= remove.length){

		      break;
		  
		  }

		  if(this.locations[i].ID == remove[j].ID){

		      this.locations.splice(i,1);

		      j++;
		      
		  }
		  else{

		      i++;
		  
		  }
	      
	      }

	      this.setPage();

	  },

	  searchLocation(){ // Search location by the input string based on user's location.

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

	  setVisible(){ // Function to determine whether the dropdown list of search result is visible

	      this.visible = this.results.length > 0;

	  },

	  setPage(){ // Determine what locations should be shown in the current page

	      var total = this.locations.length;

	      var totalPage = total / this.pageSize + ( total % this.pageSize == 0 ? 0 : 1);

	      if(this.currentPage > totalPage){

		  this.currentPage = totalPage;
	      
	      };

	      var start = (this.currentPage - 1) * this.pageSize;

	      var end = Math.min(total,this.currentPage*this.pageSize);

	      this.$refs.LocationTable.loadData(this.locations.slice(start,end));
	  
	  },

	  selectLocation(result){ // Select a location in the dropdown list

	      this.result = result;

	      this.selected = true;

	      this.visible = false;

	      this.results = [];

	  },
  
      }, 
  
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
