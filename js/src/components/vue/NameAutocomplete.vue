<template>
    <div>
        <v-autocomplete
            label="School Name"
            v-model="school"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            color="white"
            hide-no-data
            hide-selected
            item-text="school.name"
            item-value="id"
            placeholder="Start typing to search"
            return-object
            @change="goToSchool"
            hide-details
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
        window.location='/school/?'+this.school.id;
      }
    },
    watch: {
      search (val) {
        // Items have already been loaded
        //if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true
        var self = this;
        var query = { fields: ([picc.fields.NAME,picc.fields.ID]).join(','), per_page: 20 };
        query[picc.fields.NAME] = this.search;
        query = picc.form.prepareParams(query);

        //uses debounced search call to avoid API spam
        picc.API.debounced_search(query, function(error, data){
            if (error || !data.results.length) { return {}; }
            self.items = data.results;
            self.isLoading = false;
        });
      }
    },
  }
</script>
