<template>
  <div>
    <v-combobox
      id="search-name-auto-complete"
      :items="items"
      :loading="isLoading"
      v-model="search"
      search.sync="search"
      item-text="school.name"
      placeholder="Type to search"
      autocomplete="off"
      hide-details
      class='pt-0 mt-0'
      color="secondary"
      outlined
      prepend-inner-icon="fas fa-search"
      hide-no-data
      return-object          
      @input="goToSchool"
      :value="initial_school"
      @update:search-input="runSearch"
      aria-label="Name Search"
      />
  </div>
</template>

<script>
import { apiGet } from '../../vue/api.js';
import { fields } from '../../vue/constants.js';
import PrepareParams from '../../vue/mixins/PrepareParams.js'
import { EventBus } from '../../vue/EventBus.js';
import _ from 'lodash';

export default {
  mixins:[PrepareParams],
  props:{
    initial_school:{
      type: String,
      default: null
    }
  },
  data: () => ({
    items: [],
    isLoading: false,
    search: null
  }),
  methods:{
    goToSchool: function(){
      this.items = [];
      if(this.search)
      {
        this.$emit('school-name-selected',this.search);
      }
    },
    runSearch: _.debounce(function(newVal){
      if(newVal)
      {
        this.isLoading = true
        var query = { fields: ([fields.ID, fields.NAME]).join(','), per_page: 20 };
        query[fields.NAME] = newVal;
        query = this.prepareParams(query);

        let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
          if (!response.data.results.length) { return {}; }
          let items = response.data.results;
          let processed = {};
          for(let i=0; i<items.length; i++)
          {
            if(!processed[items[i]['school.name']]) processed[items[i]['school.name']] = items[i]['id'];
            else processed[items[i]['school.name']] += ','+items[i]['id'];
          }
          this.items = _.map(processed, (value, prop) => ({ "school.name": prop, "id": value }));
          this.isLoading = false;
        }).catch((error) => {
          this.items = [];
          this.isLoading = false;
        });
      }

    },200)
  },
  mounted(){
    this.search = this.initial_school;
    EventBus.$on('search-form-reset', (e) => {
      this.search = null;
    });
  },  
}
</script>
