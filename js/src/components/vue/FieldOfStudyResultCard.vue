<style lang="scss">
  .all-fields-container{
    position: absolute;
    bottom: 0;
  }
</style>

<template>
  <v-card
    class="mx-auto pa-0 elevation-4"
    style="width:100%"
    outlined
  >
    <v-card-text class="pa-3">
      <v-row>
        <!--School Info-->
        <v-col
          cols="12"
          md="3"
        >
          <p class="mt-1 mb-2" v-if="underInvestigation==1">
            <v-card color="error" class="px-2 py-1" flat>
              <strong class="white--text">Under ED Monitoring</strong>
              <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
            </v-card>
          </p>

          <p class="overline font-weight-bold mb-1">{{ city }}, {{ state }}</p>
          <h2 class="title mt-0 font-weight-bold">
            <a class="nameLink" :href="schoolLink">{{ schoolName }}</a>
          </h2>
          <p class="body-2 mt-1">{{ undergraduates | separator }} undergrads</p>
          <v-divider />
          <v-row>
            <v-col cols="12">
              <small-school-icons :school="school" :fields="fields" size="small" />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="9"
        >
          <div
            v-for="fieldCategory in categorizedFieldsOfStudy"
            :key="`${school.id}-${fieldCategory.title}`"
          >
            <span class='overline'>{{fieldCategory.title}}</span>
            <div
              v-for="fieldOfStudy in fieldCategory.items"
              :key="`${school.id}-${fieldOfStudy.code}-${_.get(fieldOfStudy,'credential.level')}`"
              class="grey lighten-4 pa-2 mt-2 mb-2"
            >

              <div :class="selectedFieldOfStudyClass(fieldOfStudy)">
                <a
                  :href="`${schoolLink}&fos_code=${fieldOfStudy.code}&fos_credential=${_.get(fieldOfStudy,'credential.level')}`"
                  target="_blank"
                >
                  <span>{{fieldOfStudy.title | formatFieldOfStudyTitle}}</span>
                </a>

                <span class="float-right">
                  <v-btn
                    text
                    icon
                    @click="$emit('toggle-compare-item', fieldOfStudyCompareFormat(fieldOfStudy), 'compare-fos')"
                  >
                    <v-icon>fa fa-plus-circle</v-icon>
                    <span class='sr-only'>Compare</span>
                  </v-btn>
                </span>

              </div>
            </div>
          </div>

          <br />

          <div
            class="all-fields-container"
          >
            <p class="text-center">
              <a :href='fieldsLink'
                 class="text-center"
              >View all Fields of study at {{schoolName}}</a>
            </p>
          </div>
        </v-col>
      </v-row>

    </v-card-text>
  </v-card>
</template>

<script>
  import Tooltip from './Tooltip.vue';
  import SmallSchoolIcons from './SmallSchoolIcons.vue';
  import ComplexFields from '../../vue/mixins/ComplexFields.js';
  import { fieldOfStudyCompareFormat } from '../../vue/commonFormats';

  export default {
    mixins:[ComplexFields],
    props:{
      school:{
        // The School object
        type: Object,
        required: true
      },
      selectedFieldsOfStudy:{
        type: Array,
        required: true
      },
      fosTotalDisplayCap:{
        type: Number,
        default: 10
      },
      fosCredentialLevelDisplayCap:{
        type: Number,
        default: 5
      }
    },
    computed:{
      categorizedFieldsOfStudy(){
        // return this.categorizeFieldsOfStudy(this.school['latest.programs.cip_4_digit']);

        // Sort Item Arrays alpha ASC
        let categorizedFieldsOfStudy = this.categorizeFieldsOfStudy(this.school['latest.programs.cip_4_digit']);

        return categorizedFieldsOfStudy.map((fieldCategory) => {
          let objectCopy = fieldCategory;

          // Total cap per section
          if(objectCopy.items.length > this.fosCredentialLevelDisplayCap){
            objectCopy.items = objectCopy.items.slice(0,5);
          }

          objectCopy.items = objectCopy.items.sort((a,b) => {
            if(a.title < b.title) { return -1; }
            if(a.title > b.title) { return 1; }
            return 0;
          })



          return objectCopy;
        });
      },
      totalFieldOfStudyCount(){
        return this.allFieldsOfStudy.length;
        // return this.categorizedFieldsOfStudy.reduce((totalCount, fieldCategory) => {
        //   totalCount += fieldCategory.items.length;
        // },0);
      }
    },
    components: {
      tooltip: Tooltip,
      'small-school-icons': SmallSchoolIcons
    },
    methods:{
      selectedFieldOfStudyClass(fieldOfStudy, compareList = this.selectedFieldsOfStudy){
        if(_.findIndex(compareList, this.fieldOfStudyCompareFormat(fieldOfStudy)) >= 0){
          return 'result-card-selected';
        }
      }
    }


  }
</script>