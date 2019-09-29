<template>
  <v-card tile id="compare_schools-content" class='pa-5'>
      <p>Compare Schools</p>
      
      <ul id="edit-compare-list">
        <li class="edit-compare-list-item" v-for="school in schools" :key="school.schoolId">
          <label class="checkbox" data-bind="checkbox_label" data-school :for="`edit-compare-${school.schoolId}`">
            <input :id="`edit-compare-${school.schoolId}`" type="checkbox" name="_compare" tabindex="0" checked @change="handleToggleCompareSchool(school)">
            <span tabindex="-1" class="checkbox-focus"></span>
            <span>{{school.schoolName}}</span>
          </label>
        </li>
      </ul>
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
    schools: Array,
  },
  created(){
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