<template>
  <v-app>
    <!-- background image -->
    <v-content>
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row>
            <v-col cols="12">
              <h1 class="white--text text-uppercase text-center">You are leaving the College Scorecard</h1>
            </v-col>
          </v-row>
          <v-row>
              <v-col cols="12" sm="8" offset-sm="2">
                  <v-card class='pa-5'>
                      <p>Links are provided by the institutions during data collection and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.</p>
                      <p>The U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site.</p>
                      <v-btn color="secondary" rounded :href="url">Continue to Website</v-btn>        
                      <v-btn rounded :href="referrer">Return to Previous Page</v-btn>                    
                  </v-card>
              </v-col>
             
          </v-row>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<style lang="scss" scoped>
.v-content{
  background-repeat: repeat;
  background-color: #246498;
  background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%233d82b1' fill-opacity='0.24' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-size: auto;

}
.home-splash {
  padding-top: 2.5rem;
}
</style>
<script>
const querystring = require("querystring");

export default {
  components: {
  },
  props: ["baseUrl"],
  data() {
    return {
        query: {}
    };
  },
  computed:{
      referrer(){
          return document.referrer;
      },
      url(){
          return decodeURI(this.query.url)
      }
  },
  mounted(){
    let query = querystring.parse(window.location.search.substring(1));
    this.query = query || {};
  } 
};
</script>