<template>
<!--  <v-autocomplete-->
<!--    :value="selected"-->
<!--    @input="handleFieldOfStudySelect"-->
<!--    :items="items"-->
<!--    item-text="field"-->
<!--    item-value="cip4"-->
<!--    placeholder="Start typing to search"-->
<!--    return-object-->
<!--    autocomplete="off"-->
<!--    clearable-->
<!--  >-->
<!--  </v-autocomplete>-->
  <v-autocomplete
    :value="selected"
    @input="handleFieldOfStudySelect"
    @update:search-input="handleFieldOfStudySearchInput"
    :items="items"
    item-text="title"
    item-value="code"
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
        // return _.sortBy(this.CIP4, ['field']);
        return this.site.data.cip_6_digit;
      }
    },
    methods:{
      handleFieldOfStudySelect(selectedItem){
        // Clear Input Field
        this.$nextTick(() => {
          this.selected = []
        });

        if (typeof selectedItem.code !== 'string' && selectedItem.code.length !== 6)
        {
          return null;
        }

        // Ensure there is a cip 4 in data
        let locateCip4 = this.CIP4.find((element) => {
          return element.cip4.replace(/\./g,'') === selectedItem.code.slice(0,4);
        });

        if(typeof locateCip4 === 'undefined' || typeof locateCip4.field === 'undefined'){
          return null;
        }

        let fieldOfStudy = {
          cip4: selectedItem.code.slice(0,4),
          field: locateCip4.field
        }

        // Emit code.
        this.$emit('field-of-study-selected', fieldOfStudy); // Remove `.` from code string;
      },
      handleFieldOfStudySearchInput(searchString){
        // console.log(searchString);
      }
    }
  }
</script>