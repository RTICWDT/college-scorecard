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
          <p v-if="showBranch">This information is based on all locations of this school.</p>
          <p v-if="showCompare">For schools with multiple locations, this information is based on all of their locations.</p>
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

export default {
  mixins:[SiteData],
  props: {
    definition: String,
    color: {
      type: String,
      default: "grey"
    },
    version:{
      type: String, 
      default: 'default'
    },
    isBranch:{
      type: Boolean, 
      default: false
    },
    isCompare:{
      type: Boolean, 
      default: false
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    glossary() {
      return this.site.data.glossary;
    },
    entry(){
      return this.glossary[this.definition];
    },
    title(){
      return this.entry['title'];
    },
    content() {
      return this.entry[this.version];
    },
    hasGlossary(){
      return this.entry['glossary']?true:false;
    },
    showBranch(){
      return (this.entry.branch && isBranch)
    },
    showCompare(){
      return (this.entry.branch && isCompare)
    }
  },
  mounted(){
    // some special cases 
    switch(this.definition){

    }
  }
};
</script>