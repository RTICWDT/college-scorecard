<template>
  <v-app id="school-fields" class="school-page">
    
    <scorecard-header
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" lg="9" class="school-left">

            <!-- Loader -->
            <div v-if="!school.id" class="show-loading">
              <v-card class="pa-5">
                <h1 class="title">
                  Loading
                  <v-icon color="#0e365b">fas fa-circle-notch fa-spin</v-icon>
                </h1>
              </v-card>
            </div>

            <div v-else class="show-loaded" id="school">

              <!-- School Header -->
              <v-card class="school-heading px-3 mb-5">

                <!-- Green Header Bar -->
                <v-row class='csGreenBg'>
                  <v-col cols="3">
                     <v-btn
                      small
                      color="white"
                      text
                      id="referrer-link"
                      class="link-more"
                      :href="referrerLink"
                    >&laquo; Back to School Profile</v-btn>

                  </v-col>
                  <v-col cols="9" class='text-right'>
                    <v-btn
                      text
                      small
                      class="d-none d-sm-inline"
                      :color="isSelected({schoolId:String(id)},this.compareSchools)?'black':'white'"
                      v-bind:class="{ 'compare-selected-text': isSelected({schoolId:String(id)},this.compareSchools), 'rounded-pill': '' }"
                      @click="$emit('toggle-compare-school', { schoolId: id, schoolName: schoolName } )"
                    >

                      <v-icon x-small class="mr-2" :color="isSelected({schoolId:String(id)},this.compareSchools)?'#0075B2':'white'">fa fa-check-circle</v-icon> 
                      <div v-if="isSelected({schoolId:String(id)},this.compareSchools)" >Added to Compare</div>
                      <div v-else>Add to Compare School</div>
                    </v-btn>

                    <v-btn
                      fab
                      x-small
                      :color="isSelected({schoolId:String(id)},this.compareSchools)?'black':'white'"
                      class="d-inline d-sm-none mr-2"
                      @click="$emit('toggle-compare-school', { schoolId: id, schoolName: schoolName } )"
                    >

                      <v-icon small class="" :color="isSelected({schoolId:String(id)},this.compareSchools)?'#0075B2':'grey'">fa fa-check-circle</v-icon> 
                      <div class="sr-only" v-if="isSelected({schoolId:String(id)},this.compareSchools)" >Added to Compare</div>
                      <div class="sr-only" v-else>Add to Compare School</div>
                    </v-btn>
                    <share small text color="white" label="Share this School" :url="shareLink" show-copy :hide="['email']" />
                  </v-col>
                </v-row>

                <!-- Monitoring Flag -->
                <v-row>
                  <v-col cols="12" md="6" class="pt-3 mb-n5" v-if="_.get(school, fields['UNDER_INVESTIGATION'])==1">
                    <v-chip
                      v-if="_.get(school, fields['UNDER_INVESTIGATION'])==1"
                      color="error"
                      label
                    >
                      <strong>Under ED Monitoring</strong>
                      <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" :isBranch="isBranch" />
                    </v-chip>
                  </v-col>
                </v-row>

                <!-- School Header Info -->
                <v-row>
                  <v-col cols="12" class="pa-sm-5">
                    <h1
                      class="display-1 pa-0 ma-0 font-weight-bold"
                    >
                      All Fields of Study Offered at <a :href="schoolLink">
                      {{ _.get(school, fields['NAME'], 'School Name') }}
                    </a>
                    </h1>
                  </v-col>
                </v-row>

              </v-card>

              <!-- School Selector -->
              <v-card class="mb-4 pa-3">
                <v-select
                  id="school-field-fos-degree"
                  outlined
                  dense
                  :items="filters"
                  item-text="credential"
                  item-value="id"
                  v-model="currentFilter"
                  label="Filter by Degree Level"
                  hide-details
                  color="secondary"
                  clearable
                ></v-select>
              </v-card>

              <!-- Warnings -->
              <v-alert
                v-if="currentFilter === 4"
                colored-border
                border="left"
                dense
                color="#D16E00"
              >
                No data on the number of graduates are displayed because of definitional differences
                with other data sources. Fields of study on this page include undergraduate-level
                programs that may be classified as undergraduate certificates in other data sources.
              </v-alert>

              <v-alert
                v-if="currentFilter === 8"
                colored-border
                border="left"
                dense
                color="#D16E00"
              >
                Fields of study on this page include graduate-level programs that may be labeled
                “postbaccalaureate certificates” in other data sources.
              </v-alert>

              <!-- Fields of Study -->
              <v-expansion-panels v-if="!_.isEmpty(processedPrograms)">
                <v-expansion-panel v-for="(prog, index) in processedPrograms" :key="index" class="fos-profile-panel">
                  <v-expansion-panel-header>{{ _.startCase(_.toLower(prog.name).slice(0,-1)) }}</v-expansion-panel-header>
                  <v-expansion-panel-content eager>
                    <v-expansion-panels>
                      <v-expansion-panel v-for="fos in prog.fields" :key="fos.code+'-'+fos.credential.level">
                        <v-expansion-panel-header>
                          <span class="school-fields-fos-degree-title">{{ fos.title.replace(/\.$/, '') }} - {{ fos.credential.title }}</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <field-data-extended
                            :fos="fos"
                            :fos-salary-select-items="fosSalarySelectItems"
                            :fos-salary-select="fieldDataExtendedSalarySelect"
                            @update-salary-select="fieldDataExtendedSalarySelect = $event"
                            :fos-show-debt-prior-included.sync="fieldDataExtendedShowPrior"
                            @update-debt-show-prior="fieldDataExtendedShowPrior = $event"
                            :fields="fields"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels> 
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-card v-else color="pa-5">
                <p class='ma-0 text-center'><em>This institution does not offer any fields of study with this degree.</em></p>
              </v-card>

            </div>
          </v-col>

          <!-- Sidbar -->
          <v-col lg="3">
            <v-card class="pa-5">
              <paying-for-college />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <scorecard-footer />
        <compare-header
          :showCompare.sync="showCompare"
          :schools="compareSchools"
          :fields-of-study="compareFieldsOfStudy"
        />
      <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
        <compare-drawer
          :schools="compareSchools"
          :fields-of-study="compareFieldsOfStudy"
          :show-info-text="showInfoText"
          @toggle-compare-school="handleToggleCompareItem"
          v-on:close-modal="closeModal()"
          @toggle-more-info="showInfoText = !showInfoText"
        ></compare-drawer>
      </v-bottom-sheet>
  </v-app>
</template>

<style lang="scss" scoped>
  @import 'sass/_variables';
  
  .fos-profile-panel{
    width: 100%;
    border-left: 10px solid $fos-color-gold;

    @media (min-width: 960px){
      font-size: 16px;
      border-left: 20px solid $fos-color-gold;
    }
  }

.compare-selected-text {
  background-color: $light-blue !important;
}

</style>

<script>
import Tooltip from "components/vue/Tooltip.vue";
import Share from "components/vue/Share.vue";
import PayingForCollege from "components/vue/PayingForCollege.vue";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import FieldData from "components/vue/FieldData.vue";
import FieldDataExtended from '../../components/vue/FieldDataExtended.vue';
import { compare } from 'vue/mixins.js';
import { apiGet } from '../api.js';
// import { fields } from '../constants.js';
import { SiteData } from '../mixins/SiteData.js';
import ComplexFields from "vue/mixins/ComplexFields.js";
import { EventBus } from "../EventBus.js";

export default {
  mixins: [compare,SiteData,ComplexFields],
  props: ["baseUrl", "compareSchools","compareFieldsOfStudy"],
  components: {
    tooltip: Tooltip,
    share: Share,
    "paying-for-college": PayingForCollege,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
    'field-data': FieldData,
    'field-data-extended': FieldDataExtended,
  },
  data() {
    return {
      school: {},
      panels: [],
      num_panels: 7,
      cip2: {},
      programs: [],
      filters: [
        { id: 1, credential: "Undergraduate Certificate or Diploma" },
        { id: 2, credential: "Associate's Degree" },
        { id: 3, credential: "Bachelor's Degree" },
        { id: 4, credential: "Post-baccalaureate Certificate" },
        { id: 5, credential: "Master's Degree" },
        { id: 6, credential: "Doctoral Degree" },
        { id: 7, credential: "First Professional Degree" },
        { id: 8, credential: "Graduate/Professional Certificate" }
      ],
      currentFilter: 0,
      fieldDataExtendedSalarySelect: 'aid',
      fieldDataExtendedShowPrior: false,
      fosSalarySelectItems: [
        { text: "Financial Aid Recipients", value: "aid"},
        { text: "Pell Grant Recipients", value: "pell"}
      ]
    };
  },
  computed: {
    processedPrograms() {
      let programs = _.get(this.school, "latest.programs.cip_4_digit");
      if(!programs) return null; 
      
      this.programs = programs;
      let processedPrograms = {};
      let self = this;

      programs.forEach(function(program, idx) {
        if(program.credential.level==3) {
          program.credential.title = "Bachelor's Degree";
        }
        if (
          !self.currentFilter ||
          self.currentFilter == program.credential.level
        ) {
          let twodigit = program.code.substr(0, 2);
          if (!processedPrograms[self.cip2[twodigit]]){
            processedPrograms[self.cip2[twodigit]] = [];
          }
          processedPrograms[self.cip2[twodigit]].push(program);
        }
      });

      let sorted = [];
      for(var cip2 in processedPrograms){
        sorted.push({
          name: cip2,
          fields: _.sortBy(processedPrograms[cip2], ['title'])
        });
      };
      return _.sortBy(sorted, ['name']);
    },
    referrerLink(){
      let id = _.get(this.school, this.fields['ID']);
      let name = _.get(this.school, this.fields['NAME'], '(unknown)');
      return this.$baseUrl+'/school/?' + id + '-' + name.replace(/\W+/g, '-');
    },
    shareLink(){
      return encodeURIComponent(window.location.href) || null;
    }
  },
  mounted() {
    let self = this;
    // this.fields = fields;
    this.cip2 = this.CIP2; // From SiteData mixin.

    if (!location.search) {
      return null;
    }
    var match = location.search.match(/^\?(\d+)(\b|-)/);
    var id = match ? match[1] : null;

    if (!id) {
      //  loadable.classed('js-error', true);
      //  return showError(picc.errors.NO_SCHOOL_ID);
    }

    var params = {};
    params[this.fields.OPERATING] = 1;
    params[
      this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
    ] = true;
    params[this.fields.SIZE + "__range"] = "0..";
    params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3";
    params[this.fields.ID + "__range"] = "..999999";
    //params["fields"] = "latest,school,id,location";
    params["keys_nested"] = true;

    // TODO - Handle Error.
    let request = apiGet(window.api.url, window.api.key, '/schools/', {id:id})
      .then((response) => {
        if(response.data.metadata.total > 1){
          console.warn('More than one school found for ID: "' + id + '"');
          return null;
        }

        this.school = response.data.results[0];
        document.title = _.get(this.school, "school.name") + " | College Scorecard";

      }).catch((response) => {
        console.warn('No School found for ID: ' + id);
      });

    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
        this.showCompare = true;
        this.showInfoText = showCompareInfo;
    });
  }
};
</script>