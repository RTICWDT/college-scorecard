<template>
  <v-card tile id="compare_schools-content" class='pa-5'>
      <p class='title'>Compare Schools</p>
      <div class='my-3'>
      <v-checkbox 
        @change="handleToggleCompareSchool(school)"
        :label="school.schoolName"
        v-for="school in schools"
        :key="school.schoolId"
        :value="school.schoolId"
        hide-details
        v-model="selected"
        color="secondary"
        class="ma-0 pa-0"
      ></v-checkbox>
      </div>
    <p>
      <v-btn rounded color="secondary" href="/compare/">Compare Schools</v-btn>
    </p>
  </v-card>
</template>

<script>

// This can work on any page, it just needs data passed in and events to react when school
// is toggled.

export default {
  props:{
    schools: Array
  },
  data(){
    return{
      selected: Array
    }
  },
  watch: {
    schools(){
      this.selected = _.map(this.schools, 'schoolId');
    }
  },
  mounted(){
      this.selected = _.map(this.schools, 'schoolId');
  },
  methods:{
    handleToggleCompareSchool(school){
      // TODO: The fade in/out or keep unchecked.
        // Move to a local state that can be clicked again and eventually refreshed.

      this.$emit('toggle-compare-school',school);
    }
  }
}
</script>