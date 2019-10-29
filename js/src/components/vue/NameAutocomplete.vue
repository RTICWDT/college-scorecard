<template>
    <div>
        <v-combobox
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="school.name"
            placeholder="Type to search"
            autocomplete="off"
            hide-details
            class='pt-0 mt-0'
            color="secondary"
            outlined
            prepend-inner-icon="search"
            hide-no-data
            :return-object="false"            
            @input="goToSchool"
            :value="initial_school"
         />
    </div>
</template>

<script>
import { apiGet } from '../../vue/api.js';
import { fields } from '../../vue/constants.js';
import PrepareParams from '../../vue/mixins/PrepareParams.js'
import { EventBus } from '../../vue/EventBus.js';

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
    goToSchool(){
      this.items = [];
      this.$emit('school-name-selected',this.search);
    }
  },
  watch: {
    search: _.debounce(function(newVal){
      if(!this.search){
        this.items = [];
        this.isLoading = false;
        return {};
      }
      this.isLoading = true
      var query = { fields: ([fields.NAME]).join(','), per_page: 20 };
      query[fields.NAME] = this.search;
      query = this.prepareParams(query);

      let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
        if (!response.data.results.length) { return {}; }
        this.items = response.data.results;
        this.isLoading = false;
      }).catch((error) => {
        this.items = [];
        this.isLoading = false;
      });

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
