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
        // console.info('Field Of Study Selected');
        // console.info(selectedItem);

        if (typeof selectedItem.code !== 'string' && selectedItem.code.length !== 6)
        {
          return null;
        }

        let fieldOfStudy = {
          cip4: selectedItem.code.slice(0,4),
          field: this.CIP4.find((element) => {
            return element.cip4.replace(/\./g,'') === selectedItem.code.slice(0,4);
          }).field
        }

        // let fieldOfStudy = {
        //   cip4: selectedItem.cip4.replace(/\./g,''), // Remove `.` from code string;
        //   field: selectedItem.field
        // }
        //

        // Clear Input Field
        this.$nextTick(() => {
          this.selected = []
        });

        console.info('Field Of Study Selected');
        console.info(fieldOfStudy);
        //
        // // Emit code.
        this.$emit('field-of-study-selected', fieldOfStudy); // Remove `.` from code string;
      },
      handleFieldOfStudySearchInput(searchString){
        // console.log(searchString);
      }
    }
  }
</script>