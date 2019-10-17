<template>
  <span>
    <v-tooltip top max-width="300" min-width="150" color="rgba(0,0,0,1)" content-class="csTooltip">
      <template v-slot:activator="{ on }">
        <v-icon x-small allow-overflow :color="color" dark v-on="on">fas fa-info-circle</v-icon>
      </template>
      <span v-html="content"></span>
    </v-tooltip>
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
    custom: {
      type: String,
      default: "default"
    },
    color: {
      type: String,
      default: "grey"
    }
  },
  data() {
    return {
      showDialog: false
    };
  },
  computed: {
    glossary() {
      return this.site.data.glossary;
    },
    content() {
      return this.glossary[this.definition][this.custom];
    }
  }
};
</script>