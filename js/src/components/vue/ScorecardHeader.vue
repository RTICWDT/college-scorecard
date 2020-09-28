<style lang="scss" scoped>
@import 'sass/_variables';
header {
  z-index: 101 !important;
  .logo {
    display: inline-block;
    padding: 10px 20px 10px 30px;
    vertical-align: middle;
    margin-top: -30px;

    img {
      width: 70px;

      @media screen and (max-width: 600px) {
        width: 40px !important;
      }
    }

    @media screen and (max-width: 600px) {
      margin-top: -10px !important;
      padding: 10px 10px 10px 20px;
    }
  }
  .headerText {
    display: inline-block;
    line-height: 200%;
    margin-top: 0px;

    @media screen and (max-width: 600px) {
      line-height: 130%;
    }
  }

  .edLine {
    display: block;
    font-size: 1.12rem;
    padding-top: 15px;
    font-family: $header-font-family;
    font-weight: 700;
    text-transform: uppercase;
    color: #9C9C9C;

    @media screen and (max-width: 600px) {
      font-size: 0.6rem;

    }
  }

  .siteTitle {
    display: block;
    font-size: 2.24rem;
    font-family: $header-font-family;
    color: $white;
    @media screen and (max-width: 600px) {
      font-size: 1.19rem;
    }
  }

  #mobile-nav-icon{
    width: 20%;
    button{
      color: white;
    }
  }

  #nav-site-title{
    width: 50%;

    /*@media screen and (max-width: 670px) {*/
    /*  width:70%;*/
    /*}*/

    @media screen and (max-width: 960px) {
      width:80%;
    }
  }

  #nav-main-navigation{
    width: 50%;
    color: white;
    text-align: right;

    ul {
      list-style-type: none;

      li{
        display: inline;
      }

      li a{
        text-decoration: none;
        color: white !important;
        font-size: 1.4rem;
        padding: 0 10px;
      }

      li a:hover, a:focus{
        color: white;
      }

      li .nav-active{
        color: $nav-active-color !important;
      }

    }

    ul li a{
      text-decoration: none;
      color: white;
    }

    @media screen and (max-width: 960px) {
      // Text Resize
    }

  }

  #nav-search-container{
    border-radius: 50%;
    background-color: #0075B2;
    margin: 0 auto;
    width: 50px;
    height: 50px;
    padding-top: 8px;
  }

  #mobile-navigation-container{
    a{
      text-decoration: none;
      color: white !important;
      font-size: 1.4rem;
    }

    a:hover, a:focus{
      color: white;
    }
  }

}
</style>

<template>
  <div>
    <v-app-bar
      app
      clipped-left
      :height="$vuetify.breakpoint.xsOnly?80:105"
      color="#0e365b"
      class="pa-0 ma=0"
    >
      <div id="nav-site-title">
        <a :href="$baseUrl+'/'">
          <div class='logo'><img :src="$baseUrl+'/img/US-DeptOfEducation-Seal.svg'" alt="Department of Education Seal" /></div>
          <div class='headerText'>
            <span class='edLine'>U.S. Department of Education</span>
            <span class='siteTitle'>College Scorecard</span>
          </div>
        </a>
      </div>

      <!-- Medium and above navigation -->
      <div id="nav-main-navigation" class="d-none d-md-block">
        <nav aria-labelledby="primary-navigation">
          <ul>

            <li>
              <a :href="`${$baseUrl}/`"
                :class="{'nav-active' : activeLink === '/'}"
              >
                Home
              </a>
            </li>

            <li>
              <a :href="`${$baseUrl}/data`"
                 :class="{'nav-active' : activeLink === 'data'}"
              >
                About the Data
              </a>
            </li>

          </ul>
        </nav>
      </div>

      <div
        id="mobile-nav-icon"
        class="d-md-none"
      >
        <v-app-bar-nav-icon
          class="float-right"
          @click="drawer = true"
        >
        </v-app-bar-nav-icon>
      </div>

    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      v-if="drawer"
      absolute
      temporary
      disable-resize-watcher
      right
    >
      <v-list
        nav
      >
        <v-list-item-group
          v-model="group"
        >
          <v-list-item class="mobile-navigation-item" @click="mobileNavClick(`${$baseUrl}/`)">
            <v-list-item-content>
              <v-list-item-title>
                Home
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="mobile-navigation-item" @click="mobileNavClick(`${$baseUrl}/data`)">
            <v-list-item-content>
              <v-list-item-title class="mobile-navigation-item">
                About the Data
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>

</template>

<script>

export default {
  props:{
    activeLink:{
      type: String,
      default: null
    }
  },
  data(){
    return {
      drawer: false,
      group: false,
    }
  },
  computed:{
  },
  watch:{
  },
  methods:{
    mobileNavClick(urlString){
      window.location.href = urlString;
    }
  },
  created(){

  }
}
</script>
