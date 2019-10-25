<template>
  <v-app>
    <scorecard-header />
    <v-content class="home-splash">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card class='pa-5 text-center'>
            <h1>We flunked!</h1>
            <p>We couldn't find the page you were looking for. Try searching again?</p>
            <name-autocomplete @school-name-selected="handleSchoolNameSelected"/>
            <div class="content-column">
              <v-img class='ma-4' src="/img/f-grade-paper.jpg" alt="Grade of F" />
            </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <scorecard-footer />
  </v-app>
</template>

<style lang="scss" scoped>
.home-splash {
  padding-top: 1.5rem;
}
</style>

<script>
import NameAutocomplete from 'components/vue/NameAutocomplete.vue';
export default {
  components: {
    'name-autocomplete': NameAutocomplete
  },
  props:['baseUrl','pagePermalink'],
  methods:{
    handleSchoolNameSelected(e){
      window.location= '/search/?name='+ e['school.name'];
    }
  }
}
</script>