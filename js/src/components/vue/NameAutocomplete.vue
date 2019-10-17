<template>
    <div>
        <v-autocomplete
            v-model="school"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="school.name"
            item-value="id"
            placeholder="Start typing to search"
            return-object
            @change="goToSchool"
            autocomplete="off"
            hide-details
            class='pt-0 mt-0'
            color="secondary"
            outlined
            prepend-inner-icon="search"
         />
    </div>
</template>

<script>
import { apiGet } from '../../vue/api.js';
import { fields } from '../../vue/constants.js';
import PrepareParams from '../../vue/mixins/PrepareParams.js'

export default {
  mixins:[PrepareParams],
  data: () => ({
    items: [],
    isLoading: false,
    school: null,
    search: null,
  }),
  methods:{
    goToSchool(){
      let id = _.get(this.school, fields.ID);
      let name = _.get(this.school, fields.NAME,'(unknown)');
      window.location= '/school/?'+id+'-'+name.replace(/\W+/g, '-'); 
    }
  },
  watch: {
    // TODO - Clean Unwanted Methods.
    search: _.debounce(function(newVal){
      this.isLoading = true
      // var self = this;
      var query = { fields: ([fields.NAME,fields.ID]).join(','), per_page: 20 };
      query[fields.NAME] = this.search;

      // query = picc.form.prepareParams(query);
      query = this.prepareParams(query);

      let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
        if (!response.data.results.length) { return {}; }

        this.items = response.data.results;
        this.isLoading = false;
      }).catch((error) => {
        this.items = {};
        this.isLoading = false;
      });

      // picc.API.search(query, function(error, data){
      //     if (error || !data.results.length) { return {}; }
      //     self.items = data.results;
      //     self.isLoading = false;
      // });
    },200)
  }
  }
</script>
