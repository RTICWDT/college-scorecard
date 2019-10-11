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
export default {
    data: () => ({
      items: [],
      isLoading: false,
      school: null,
      search: null,
    }),
    methods:{
      goToSchool(){
        let id = _.get(this.school, picc.fields.ID);
        let name = _.get(this.school, picc.fields.NAME,'(unknown)');
        window.location= '/school/?'+id+'-'+name.replace(/\W+/g, '-'); 
      }
    },
    watch: {
      search: _.debounce(function(newVal){
        this.isLoading = true
        var self = this;
        var query = { fields: ([picc.fields.NAME,picc.fields.ID]).join(','), per_page: 20 };
        query[picc.fields.NAME] = this.search;
        query = picc.form.prepareParams(query);

        picc.API.search(query, function(error, data){
            if (error || !data.results.length) { return {}; }
            self.items = data.results;
            self.isLoading = false;
        });
      },200)
    }
  }
</script>
