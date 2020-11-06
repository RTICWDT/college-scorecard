<template>
  <div id="compare-header"
       class='header pa-3 elevation-4'
       @click="toggleDrawer()"
       v-if="currentSchoolCount > 0 || currentFieldOfStudyCount > 0"
  >
    <div>
        <div  v-if="currentSchoolCount < 10"  style="display:inline-block;">
          <div class="compare-icon-wrapper d-inline-block mr-2"
               style="background: #91C191;"
          >
            <v-icon
              class="mt-1"
              color="#122E51"
              small
            >
              fas fa-university
            </v-icon>
          </div>{{currentSchoolCount}} {{schoolText}} and &nbsp;&nbsp;</div>
      <div v-else  style="display:inline-block;">
        &nbsp;<v-icon color="red" small class='pr-2'>fas fa-exclamation-circle</v-icon>&nbsp;Maximum of 10 Schools reached. &nbsp;&nbsp;
      </div>
        <div v-if="currentFieldOfStudyCount < 10" style="display:inline-block;">
          <div class="compare-icon-wrapper d-inline-block mr-2"
               style="background: #fec005;"
          >
            <v-icon
              class="mt-1"
              color="black"
              small
            >
              fas fa-award
            </v-icon>
            </div>{{currentFieldOfStudyCount}} {{fieldOfStudyText}} to compare and share.</div>
      <div v-else  style="display:inline-block;">
        &nbsp;<v-icon color="red" small class='pr-2'>fas fa-exclamation-circle</v-icon>&nbsp;Maximum of 10 Fields of Study reached.
      </div>
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

  .compare-icon-wrapper{
    border-radius: 50%;
    box-shadow: 0px 3px 6px #00000029;
    border: white 3px solid;
    width: 36px;
    height: 36px;
    text-align: center;
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