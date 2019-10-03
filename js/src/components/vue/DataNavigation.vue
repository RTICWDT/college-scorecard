<template>
  <div>
    <div class="conversation">
      <v-container class="py-3">
        <p class="text-md-right my-0">
          <strong>Join the Conversation:</strong>
          <a
            href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"
            target="_blank"
          >StackExchange
          </a>
        </p>
      </v-container>
    </div>
    <div class="data-navigation">
      <v-container class="py-0">
        <v-tabs background-color="grey lighten-3" v-model="dataTabs">
          <v-tab href="/data/" value="home">Data Home</v-tab>
          <v-tab href="/data/documentation/" value="documentation">Documentation</v-tab>
          <v-tab href="/data/changelog/" value="changelog">Change Log</v-tab>
          <v-tab href="/data/glossary/" value="glossary">Glossary</v-tab>
        </v-tabs>
      </v-container>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "sass/_variables";
.data-navigation {
  background-color: $lighter-gray;
}
.conversation {
  background-color: $mid-gray;
}
</style>
<script>
export default {
  props: ["current"],
  computed: {
    dataTabs() {
      return this.current;
    }
  }
};
</script>