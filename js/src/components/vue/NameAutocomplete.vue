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
      no-filter
      >

      <template slot="item" slot-scope="{parent, item}">
        {{item['school.name']}}
      </template>

    </v-combobox>

  </div>
</template>

<script>
import { apiGet } from '../../vue/api.js';
import { fields } from '../../vue/constants.js';
import PrepareParams from '../../vue/mixins/PrepareParams.js'
import { EventBus } from '../../vue/EventBus.js';
import _ from 'lodash';
import school_transitionVue from '../../vue/pages/school_transition.vue';

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
      // if(this.search)
      // {
      //   this.$emit('school-name-selected',this.search);
      // }
    },
    customFilter(item, queryText, itemText){
      return true;
    },
    runSearch: _.debounce(function(newVal){
      if(newVal)
      {
        this.isLoading = true
        var query = { 
          fields: ([fields.ID, fields.NAME, fields.ALIAS, fields.SEARCH]).join(','), 
          per_page: 20,
          sort:`${fields.ALIAS}:asc` // To ensure items with alias are on first page
        };

        query['school.search'] = newVal;
        query = this.prepareParams(query);

        let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
          if (!response.data.results.length) { return {}; }
          let schools = response.data.results;
          let processed = {};

          // Promote alias match to the top, remove from result list
          // TODO - Improve: Break into words, Case Insensitive
          let aliasMatch = _.remove(schools, (school) => {
            return school['school.alias'] && school['school.alias'].indexOf(newVal) > -1;
          });

          // console.log("Alias Match: " + JSON.stringify(aliasMatch));

          if(aliasMatch.length > 0){
            // Add flag for alias Match
            aliasMatch = aliasMatch.map(i => {
              return {...i, 'alias': true}
            });

            // Add to the front of the result array
            schools.unshift(...aliasMatch);
          }

          this.items = schools;
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
