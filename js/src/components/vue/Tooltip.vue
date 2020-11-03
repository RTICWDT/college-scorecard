<template>
  <span>
    <v-dialog max-width='500px' v-model="showDialog">
      <template v-slot:activator="{ on }">
        <v-icon x-small allow-overflow :color="color" dark v-on.stop="on">fas fa-info-circle</v-icon>
      </template>
      <v-card>
        <v-btn @click="showDialog = false" icon class='float-right mt-3 mr-3'><v-icon>fas fa-times-circle</v-icon></v-btn>
        <v-card-title class="tool-tip-dialog-title">{{title}}</v-card-title>
        <v-card-text class='pb-5'>
          <div v-html="content"></div>
          <p v-if="limitedFoS">The data shown is for undergraduate fields of study (undergraduate certificates, associate's degrees, and bachelor's degrees) for which there is data. For more information on other credentials, including Graduate-level degrees and certificates, see <a :href='limitedFoS'>All Fields of Study</a> for this school.</p>
          <p v-if="showBranch">This information is based on all locations of this school.</p>
          <p v-if="showCompare">For schools with multiple locations, this information is based on all of their locations.</p>
          <div v-if="info" v-html="info"></div>
          <p class='text-center mt-3' v-if='hasGlossary'>
            <v-btn :href="$baseUrl+'/data/glossary/#'+definition" small rounded color="secondary" class='px-4'>More Information</v-btn>
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>

<style lang="scss" scoped>
  .csTooltip {
    font-size: 1rem;
  }

  .tool-tip-dialog-title{
    word-break: break-word;
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
      default: "blue darken-3"
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
    limitedFoS:{
      type: String, 
      default: null
    },
    showInfo:{
      type: Boolean,
      default: true
    }
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
      if(this.isCompare && this.entry['compare']) return this.entry['compare'];
      else if(this.isGraduate && this.entry['graduate']) return this.entry['graduate'];
      else if(this.isNegative && this.entry['negative']) return this.entry['negative'];
      else return this.entry[this.version];
    },
    info(){
      return this.entry['info'] && this.showInfo? this.entry['info']:false;
    },
    hasGlossary(){
      return this.entry['glossary']?true:false;
    },
    showBranch(){
      return (this.entry.branch && this.isBranch)
    },
    showCompare(){
      return (this.entry.branch && this.isCompare)
    }
  },
  mounted(){

  }
};
</script>