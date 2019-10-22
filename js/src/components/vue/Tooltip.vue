<template>
  <span>
    <v-dialog max-width='500px'>
      <template v-slot:activator="{ on }">
        <v-icon x-small allow-overflow :color="color" dark v-on="on">fas fa-info-circle</v-icon>
      </template>
      <v-card>
        <v-card-title>{{title}}</v-card-title>
        <v-card-text class='pb-5'>
          <div v-html="content"></div>
          <p v-if="isBranch && !compare">This information is based on all locations of this school.</p>
          <p v-if="isBranch && compare">For schools with multiple locations, this information is based on all of their locations.</p>
        </v-card-text>
        <v-card-actions class="px-5 pb-4" v-if='hasGlossary'>
          <v-btn :href="'/data/glossary/#'+definition" small rounded color="secondary">More Information</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<style lang="scss" scoped>
.csTooltip {
  font-size: 1rem;
}
</style>

<script>
import {SiteData} from '../../vue/mixins/SiteData.js';
import ComplexFields from '../../vue/mixins/ComplexFields.js';

export default {
  mixins:[SiteData,ComplexFields],
  props: {
    definition: String,
    school: Object,
    color: {
      type: String,
      default: "grey"
    },
    compare:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      version: 'default'
    };
  },
  computed: {
    glossary() {
      return this.site.data.glossary;
    },
    title(){
      return this.glossary[this.definition]['title'];
    },
    content() {
      return this.glossary[this.definition][this.version];
    },
    hasGlossary(){
      return this.glossary[this.definition]['glossary']?true:false;
    }
  },
  mounted(){
    // some special cases 
    switch(this.definition){

    }
  }
};
</script>