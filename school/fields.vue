<template>
  <v-app id="app" class="school-page">
    <div class="backNav">
      <div class="container school-back">
        <a id="referrer-link" class="link-more" href="./index/">
          <i class="fa fa-chevron-left"></i>
          Back to {{_.get(school, fields['NAME']) }}
        </a>
      </div>
    </div>
    <!-- Search results -->
    <div class="school-bg">
      <v-container>
        <v-row>
          <v-col cols="12" md="9" class="school-left">
            <div v-if="!school.id" class="show-loading">
              <v-card tile class="pa-5">
                <h1 class="heading">
                  Loading
                  <v-icon color="pink darken-4">fas fa-circle-notch fa-spin</v-icon>
                </h1>
              </v-card>
            </div>

            <div v-else class="show-loaded" id="school">
              <v-card tille class="school-heading pa-5 mb-5">
                <v-row>
                  <v-col cols="12" md="6" class="py-0">
                    <v-chip
                      v-if="_.get(school, fields['UNDER_INVESTIGATION'])==1"
                      color="error"
                      label
                    >
                      <strong>Under ED Monitoring</strong>
                    </v-chip>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="8" class="py-0">
                    <h1
                      class="pa-0 ma-0"
                    >All Fields of Study Available at {{ _.get(school, fields['NAME'], 'School Name') }}</h1>
                  </v-col>
                  <v-col cols="12" md="4" class="text-right py-0">
                    <v-btn
                      text
                      icon
                      :color="isSelected?'amber':'grey'"
                      @click="$emit('toggle-compare-school', { schoolId: _.get(school, fields['ID']), schoolName: _.get(school, fields['NAME'])} )"
                    >
                      <v-icon>fa fa-star</v-icon>
                    </v-btn>
                    <share label="Share this School" :url="shareLink" />
                  </v-col>
                </v-row>
              </v-card>
              <!-- /.school-card_container-school -->
              <v-card class="px-4 pt-2 mb-4">
                <v-select
                  :items="filters"
                  item-text="credential"
                  item-value="id"
                  v-model="currentFilter"
                  label="Filter by Degree"
                ></v-select>
              </v-card>
              <v-alert
                v-if="currentFilter === 4"
                color="warning"
              >Note about Post-baccalaureate Certificate coming soon!</v-alert>
              <v-alert
                v-if="currentFilter === 8"
                color="warning"
              >Note about Graduate/Professional Certificate coming soon!</v-alert>
              <v-expansion-panels>
                <v-expansion-panel v-for="(program, key) in processedPrograms" :key="key">
                  <v-expansion-panel-header>{{ _.startCase(_.toLower(key.slice(0,-1))) }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-expansion-panels dark>
                      <v-expansion-panel v-for="fos in program" :key="fos.code">
                        <v-expansion-panel-header>
                          <v-row no-gutters>
                            <v-col cols="6">{{ fos.title.slice(0,-1) }}</v-col>
                            <v-col cols="6">{{ fos.credential.title }}</v-col>
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-simple-table>
                            <tr>
                              <th>Count</th>
                              <th>Median Debt</th>
                              <th>Median Earnings</th>
                            </tr>
                            <tr>
                              <td>{{fos.count | separator}}</td>
                              <td v-if="fos.median_debt">{{fos.median_debt | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                              <td
                                v-if="fos.median_earnings"
                              >{{fos.median_earnings | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                            </tr>
                          </v-simple-table>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="3">
            <v-card tile class="pa-5">
              <paying-for-college />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
        <compare-header :showCompare.sync="showCompare" :schools="compareSchools" />
      <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
        <compare-drawer
          :schools="compareSchools"
          @toggle-compare-school="handleToggleCompareSchool"
          v-on:close-modal="closeModal()"
        ></compare-drawer>
      </v-bottom-sheet>
  </v-app>
</template>

<script>
import Tooltip from "components/vue/Tooltip.vue";
import Share from "components/vue/Share.vue";
import PayingForCollege from "components/vue/PayingForCollege.vue";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import { compare } from 'vue/mixins.js';

export default {
  mixins: [compare],
  props: ["baseUrl", "compareSchools"],
  components: {
    tooltip: Tooltip,
    share: Share,
    "paying-for-college": PayingForCollege,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader
  },
  data() {
    return {
      school: {},
      fields: [],
      panels: [],
      num_panels: 7,
      cip2: picc.CIP2,
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
      currentFilter: 0
    };
  },
  computed: {
    processedPrograms() {
      let programs = _.get(this.school, "latest.programs.cip_4_digit");
      this.programs = programs;
      let processedPrograms = {};
      let self = this;

      programs.forEach(function(program, idx) {
        if (
          !self.currentFilter ||
          self.currentFilter == program.credential.level
        ) {
          let twodigit = program.code.substr(0, 2);
          if (!processedPrograms[self.cip2[twodigit]])
            processedPrograms[self.cip2[twodigit]] = [];
          processedPrograms[self.cip2[twodigit]].push({
            title: program.title,
            count: program.ipeds_award_count,
            credential: program.credential,
            median_debt: program.median_debt
          });
        }
      });
      return processedPrograms;
    },
    shareLink(){
      return window.location.href || null;
    }
  },
  mounted() {
    let self = this;
    this.fields = picc.fields;

    if (!location.search) {
      return null;
    }
    var match = location.search.match(/^\?(\d+)(\b|-)/);
    var id = match ? match[1] : null;

    if (!id) {
      //  loadable.classed('js-error', true);
      //  return showError(picc.errors.NO_SCHOOL_ID);
    }

    d3.select("#referrer-link").attr("href", document.referrer || null);

    var params = {};
    params[picc.fields.OPERATING] = 1;
    params[
      picc.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
    ] = true;
    params[picc.fields.SIZE + "__range"] = "0..";
    params[picc.fields.PREDOMINANT_DEGREE + "__range"] = "1..3";
    params[picc.fields.ID + "__range"] = "..999999";
    //params["fields"] = "latest,school,id,location";
    params["keys_nested"] = true;
    picc.API.getSchool(id, params, function onSchoolLoad(error, school) {
      self.school = school;
    });
  }
};
</script>