<template>
  <div id="compare-header"
       class='header pa-3 elevation-4'
       @click="toggleDrawer()"
       v-if="currentSchoolCount > 0 || currentFieldOfStudyCount > 0"
  >
    <div>
      <span v-if="currentSchoolCount < 10">
        <v-icon color="#0075B2" small class='pr-2'>fas fa-check-circle</v-icon>
        {{currentSchoolCount}} {{schoolText}} and
      </span>
      <span v-else>
        <v-icon color="red" small class='pr-2'>fas fa-exclamation-circle</v-icon>
        Maximum of 10 schools reached.
      </span>

      <span v-if="currentFieldOfStudyCount < 10">{{currentFieldOfStudyCount}} {{fieldOfStudyText}} to compare and share.</span>
      <span v-else>
        &nbsp;<v-icon color="red" small class=''>fas fa-exclamation-circle</v-icon>&nbsp;Maximum of 10 fields of study reached.
      </span>
    </div >


  </div>
</template>

<style lang="scss" scoped>
  @import 'sass/_variables';
  .header{
    position:fixed;
    width: 50%;
    left: 25%;
    bottom: 0px;
    background-color: rgba(0,0,0,0.9);
    color: #FFFFFF;
    z-index: 200;
    border-radius: 3px 3px 0 0;
    cursor: pointer;
    @media only screen and (max-width: 600px) {
      width: 100%;
      left: 0;
    }

  }
</style>

<script>
  export default {
    props:['schools','fieldsOfStudy'],
    data(){
      return{
      }
    },
    methods:{
      toggleDrawer(){
        this.$emit('update:showCompare', true);
      }
    },
    computed:{
      // currentCount(){
      //     return this.schools.length
      // },
      currentSchoolCount(){
        return this.schools.length;
      },
      currentFieldOfStudyCount(){
        return this.fieldsOfStudy.length;
      },
      schoolText(){
        return(this.schools.length > 1 || this.schools.length === 0)?'schools':'school';
      },
      fieldOfStudyText(){
        return(this.fieldsOfStudy.length > 1 || this.fieldsOfStudy.length === 0)?'fields of study':'field of study';
      }
    }
  }
</script>