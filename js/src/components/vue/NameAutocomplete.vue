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
            @input="goToSchool"
            autocomplete="off"
            hide-details
            class='pt-0 mt-0'
            color="secondary"
            outlined
            prepend-inner-icon="search"
            hide-no-data
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
  data: () => ({
    items: [],
    isLoading: false,
    school: null,
    search: null,
  }),
  methods:{
    goToSchool(){
      // Navigate to school page.
      let id = _.get(this.school, fields.ID);
      let name = _.get(this.school, fields.NAME,'(unknown)');
      // window.location= '/search/?school.name='+this.school;
      this.$emit('school-name-selected',this.school);
    }
  },
  watch: {
    search: _.debounce(function(newVal){
      this.isLoading = true

      var query = { fields: ([fields.NAME,fields.ID]).join(','), per_page: 20 };
      query[fields.NAME] = this.search;
      query = this.prepareParams(query);

      let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
        if (!response.data.results.length) { return {}; }
        this.items = response.data.results;
        this.isLoading = false;
      }).catch((error) => {
        this.items = {};
        this.isLoading = false;
      });

    },200)
  },
  mounted(){
    EventBus.$on('search-form-reset', (e) => {
      this.school = null;
    });
  },  
}
</script>
