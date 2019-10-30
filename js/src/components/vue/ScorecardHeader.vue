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
}
</style>

<template>
    <v-app-bar 
      app 
      clipped-left
      :height="$vuetify.breakpoint.xsOnly?80:105"
      color="#0e365b"
      class="pa-0 ma=0"
    >
      <a href="/">
        <div class='logo'><img src="/img/US-DeptOfEducation-Seal.svg" alt="Department of Education Seal" /></div>
        <div class='headerText'>
          <span class='edLine'>U.S. Department of Education</span>
          <span class='siteTitle'>College Scorecard</span>
        </div>
      </a>
    </v-app-bar>
</template>