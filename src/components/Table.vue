
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

</template>

<script lang="ts">

  import axios from "axios";

  import { defineComponent, reactive } from "vue";

  export default defineComponent({

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
