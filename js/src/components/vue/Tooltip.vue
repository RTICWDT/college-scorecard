<template>
  <span>
    <v-dialog max-width='500px'>
      <template v-slot:activator="{ on }">
        <v-icon x-small allow-overflow :color="color" dark v-on="on">fas fa-info-circle</v-icon>
      </template>
      <v-card>
        <v-card-title>{{title}}</v-card-title>
        <v-card-text v-html="content" class='pb-5'></v-card-text>
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
export default {
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
      return picc.GLOSSARY;
    },
    content() {
      return this.glossary[this.definition][this.custom];
    },
    title(){
      return this.glossary[this.definition]['title'];
    },
    hasGlossary(){
      return this.glossary[this.definition]['glossary']?true:false;
    }
  }
};
</script>