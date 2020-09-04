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
        color: black !important;
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

            <li>
              <a href="mailto:scorecarddata@rti.org">
                Contact
              </a>
            </li>

            <li>
              <div id="nav-search-container" class="d-inline-block">
                <a :href="`${$baseUrl}/search`"
                   aria-label="Navigate to Search Page"
                >
                  <v-icon color="white" size="30">mdi mdi-magnify</v-icon>
                </a>
              </div>
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

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      disable-resize-watcher
      right
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <a :href="`${$baseUrl}/`">Home</a>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-satellite-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <a :href="`${$baseUrl}/search`">Search</a>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-book-open</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <a :href="`${$baseUrl}/data`">About the Data</a>
            </v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>

</template>

<script>

export default {
  // since the header is set page level, we can just pass it which page is currently active via prop.
  props:{
    activeLink:{
      type: String,
      required: true
    }
  },
  data(){
    return {
      drawer: false,
      group: false,
    }
  },
  computed:{
    // Computed property for URL
    // currentURLLocationObject(){
    //   return {
    //     pathname: location.pathname,
    //     search: location.search
    //   }
    // },
    // activeNavElement(){
    //   // This is ugly
    //   if(this.isActive('/')){
    //     return '/';
    //   }else if (this.isActive('search', 'toggle=fos')){
    //     return 'search-fos';
    //   }else if(this.isActive('search', 'toggle=institutions')){
    //     return 'search-institutions';
    //   }else if(this.isActive('search')){
    //     return 'search';
    //   }else if(this.isActive('data')){
    //     return 'data';
    //   }
    // }
  },
  watch:{
    // Watch for changes, deal with it.
  },
  methods:{
    // isActive(activeURLString, activeQueryString = null, urlPathName = location.pathname, urlQueryString = location.search){
    //
    //   let isActive = false;
    //
    //   // For Home Page
    //   if(activeURLString === '/' && urlPathName === '/'){
    //     isActive =  true;
    //
    //   }else{
    //     let splitURL = urlPathName.split('/');
    //     let lastURLSegment = splitURL.pop() || splitURL.pop();
    //     isActive = activeURLString === lastURLSegment;
    //
    //     // Check URL for query string with Regular Expressions;
    //     if(activeQueryString){
    //       let regexPattern = new RegExp('[?&]' + activeQueryString,'gi');
    //       isActive = regexPattern.test(urlQueryString);
    //     }
    //
    //   }
    //
    //   return isActive;
    // }
  },
  created(){
    // document.addEventListener('popstate', function() {
    //   console.log('The hash has changed!')
    // }, false);
  }
}
</script>
