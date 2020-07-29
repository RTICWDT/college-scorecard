<template>
  <v-autocomplete
    :value="selected"
    @input="handleFieldOfStudySelect"
    :items="items"
    item-text="field"
    item-value="cip4"
    placeholder="Start typing to search"
    return-object
    autocomplete="off"
    clearable
  >
  </v-autocomplete>
</template>

<script>
  import { SiteData } from '../../vue/mixins/SiteData.js';
  import _ from 'lodash';

  export default {
    mixins:[SiteData],
    data(){
      return{
        selected:null,
      }
    },
    computed: {
      items() {
        return _.sortBy(this.CIP4, ['field']);
      }
    },
    methods:{
      handleFieldOfStudySelect(selectedItem){

        let fieldOfStudy = {
          cip4: selectedItem.cip4.replace(/\./g,''), // Remove `.` from code string;
          field: selectedItem.field
        }

        // Clear Input Field
        this.$nextTick(() => {
          this.selected = []
        });


        console.info('Field Of Study Selected');
        console.info(fieldOfStudy);

        // Emit code.
        this.$emit('field-of-study-selected', fieldOfStudy); // Remove `.` from code string;
      }
    }
  }
</script>