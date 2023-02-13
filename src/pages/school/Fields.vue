<template>
  <v-main>
    <div class="school-heading">
      <div class="white">
        <v-container>
          <v-row class=" meta-nv">
            <v-col>
              <v-btn
                text
                small
                id="referrer-link"
                class="link-more"
                :href="this.$url(referrerLink)"
                >&laquo; Back</v-btn
              >
            </v-col>
            <v-col class="text-right">
              <share
                small
                text
                color=""
                label="Share these Fields of Study"
                :url="shareLink"
                show-copy
                :hide="['email']"
              />
              <v-btn :href="$url(schoolLink)" text small
                >School Profile &raquo;</v-btn
              >
            </v-col>
          </v-row></v-container
        >
      </div>
      <v-container class="mt-10">
        <v-row>
          <v-col class="school-lef mb-n10">
            <div class="show-loaded" id="school">
              <!-- School Header Info -->
              <v-row>
                <v-col cols="12" md="6" class="white--text">
                  <div v-if="school.id">
                    <p class="mb-3 text-uppercase">
                      All Fields of Study Offered at
                    </p>
                    <h1 class="display-1 mb-3 font-weight-bold">
                      {{ _.get(school, fields["NAME"], "School Name") }}
                    </h1>
                    <p class="mb-0">
                      <strong>{{ undergraduates | separator }}</strong>
                      undergraduate students
                    </p>
                    <p class="">
                      <a
                        target="_blank"
                        :href="$url('/school/transition/')"
                        class="white--text"
                        @click="transitionOutboundLink($event, schoolUrl)"
                        >{{ schoolUrlDisplay | formatUrlText
                        }}<v-icon x-small class="pl-1" color="white">
                          fas fa-external-link-alt
                        </v-icon>
                      </a>
                    </p>
                    <p
                      class="mb-10"
                      v-if="_.get(school, fields['UNDER_INVESTIGATION']) == 1"
                    >
                      <v-chip color="error" label>
                        <strong>Under ED Monitoring</strong>
                        <tooltip
                          definition="hcm2"
                          color="#FFFFFF"
                          class="ml-2"
                          :isBranch="isBranch"
                        />
                      </v-chip>
                    </p>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="pa-5">
                    <h2 class="mb-6 d-inline-block">
                      Filter Fields of Study Offered
                    </h2>
                    <v-avatar color="#fec005" size="40" class="ml-3">
                      <v-icon color="black">
                        fas fa-award
                      </v-icon>
                    </v-avatar>
                    <v-text-field
                      outlined
                      label="Search Fields of Study"
                      v-model="currentTextFilter"
                      clearable
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                    <v-select
                      id="school-field-fos-degree"
                      outlined
                      :items="filters"
                      item-text="credential"
                      item-value="id"
                      v-model="currentFilter"
                      label="Search Degree Type"
                      color="primary"
                      clearable
                      hide-details="auto"
                    ></v-select>
                  </v-card>
                </v-col>
              </v-row></div></v-col></v-row
      ></v-container>
    </div>
    <v-container class="my-10">
      <div v-if="!school.id" class="show-loading">
        <h1 class="title text-center my-15">
          <v-icon color="#00365e">fas fa-circle-notch fa-spin</v-icon>
          Loading
        </h1>
      </div>

      <v-row v-else
        ><v-col>
          <v-alert
            v-if="currentFilter === 4"
            colored-border
            border="left"
            dense
            color="#D16E00"
            elevation="2"
          >
            No data on the number of graduates are displayed because of
            definitional differences with other data sources. Fields of study on
            this page include undergraduate-level programs that may be
            classified as undergraduate certificates in other data sources.
          </v-alert>

          <v-alert
            v-if="currentFilter === 8"
            colored-border
            border="left"
            dense
            color="#D16E00"
            elevation="2"
          >
            Fields of study on this page include graduate-level programs that
            may be labeled “postbaccalaureate certificates” in other data
            sources.
          </v-alert>
          <h2 class="mb-4">{{ totalCount }} Results</h2>
          <!-- Fields of Study -->
          <v-expansion-panels
            v-if="!_.isEmpty(processedPrograms)"
            v-model="panels"
            multiple
          >
            <v-expansion-panel
              v-for="(prog, index) in processedPrograms"
              :key="index"
              class=""
            >
              <v-expansion-panel-header>{{
                _.startCase(_.toLower(prog.name).slice(0, -1))
              }}</v-expansion-panel-header>
              <v-expansion-panel-content eager>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="fos in prog.fields"
                    :key="fos.code + '-' + fos.credential.level"
                  >
                    <v-expansion-panel-header>
                      <span class="school-fields-fos-degree-title"
                        >{{ fos.title.replace(/\.$/, "") }} -
                        {{ fos.credential.title }}</span
                      >
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pa-0 ma-0">
                      <field-data-extended
                        :fos="fos"
                        :fos-salary-select-items="fosSalarySelectItems"
                        :fos-salary-select="fieldDataExtendedSalarySelect"
                        @update-salary-select="
                          fieldDataExtendedSalarySelect = $event
                        "
                        :fos-show-debt-prior-included.sync="
                          fieldDataExtendedShowPrior
                        "
                        @update-debt-show-prior="
                          fieldDataExtendedShowPrior = $event
                        "
                        :fields="fields"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-card v-else color="pa-5">
            <p class="ma-0 text-center">
              This institution does not offer any fields of study with this
              degree.
            </p>
          </v-card>
        </v-col></v-row
      >
    </v-container>
    <bottom-callouts />
  </v-main>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

.school-heading {
  background-color: $bg-blue;
}
.v-expansion-panel-header--active {
  background-color: $bg-yellow;
  & + div {
    background-color: $bg-yellow;
    .v-expansion-panel-header--active {
      background-color: white;
      & + div {
        background-color: white;
      }
    }
  }
}
</style>

<script>
import Tooltip from "~/components/Tooltip.vue"
import Share from "~/components/Share.vue"
import FieldData from "~/components/FieldData.vue"
import FieldDataExtended from "~/components/FieldDataExtended.vue"
import { apiGet } from "~/js/api.js"
import { SiteData } from "~/js/mixins/SiteData.js"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import AddToCompare from "~/components/AddToCompare.vue"
import BottomCallouts from "~/components/BottomCallouts.vue"

export default {
  mixins: [SiteData, ComplexFields],
  components: {
    tooltip: Tooltip,
    share: Share,
    "field-data": FieldData,
    "field-data-extended": FieldDataExtended,
    "add-to-compare": AddToCompare,
    "bottom-callouts": BottomCallouts,
  },
  data() {
    return {
      school: {},
      panels: [],
      num_panels: 0,
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
        { id: 8, credential: "Graduate/Professional Certificate" },
      ],
      currentFilter: 0,
      currentTextFilter: "",
      fieldDataExtendedSalarySelect: "aid",
      fieldDataExtendedShowPrior: false,
      fosSalarySelectItems: [
        { text: "Financial Aid Recipients", value: "aid" },
        { text: "Pell Grant Recipients", value: "pell" },
      ],
      totalCount: 0,
    }
  },
  computed: {
    processedPrograms() {
      let programs = _.get(this.school, "latest.programs.cip_4_digit")
      if (!programs) return null

      this.programs = programs
      let processedPrograms = {}
      let self = this

      programs.forEach(function(program, idx) {
        if (program.credential.level == 3) {
          program.credential.title = "Bachelor's Degree"
        }
        if (
          (!self.currentFilter ||
            self.currentFilter == program.credential.level) &&
          (!self.currentTextFilter ||
            program.title.match(new RegExp(self.currentTextFilter, "ig")))
        ) {
          let twodigit = program.code.substr(0, 2)
          if (!processedPrograms[self.cip2[twodigit]]) {
            processedPrograms[self.cip2[twodigit]] = []
          }
          processedPrograms[self.cip2[twodigit]].push(program)
          //this.totalCount = this.totalCount + 1
        }
      })

      this.totalCount = 0
      this.num_panels = 0
      let sorted = []
      for (var cip2 in processedPrograms) {
        sorted.push({
          name: cip2,
          fields: _.sortBy(processedPrograms[cip2], ["title"]),
        })
        this.totalCount = this.totalCount + processedPrograms[cip2].length
        this.num_panels++
      }

      if (this.currentTextFilter || this.currentFilter) {
        this.panels = [...Array(this.num_panels).keys()].map((k, i) => i)
      } else {
        this.panels = []
      }
      return _.sortBy(sorted, ["name"])
    },
    referrerLink() {
      let id = _.get(this.school, this.fields["ID"])
      let name = _.get(this.school, this.fields["NAME"], "(unknown)")
      return "/school/?" + id + "-" + name.replace(/\W+/g, "-")
    },
    shareLink() {
      let path = process.isClient ? window.location.href : ""
      return encodeURIComponent(this.$url(path)) || null
    },
  },
  mounted() {
    let self = this
    // this.fields = fields;
    this.cip2 = this.CIP2 // From SiteData mixin.

    if (!location.search) {
      return null
    }
    var match = location.search.match(/^\?(\d+)(\b|-)/)
    var id = match ? match[1] : null

    if (!id) {
      //  loadable.classed('js-error', true);
      //  return showError(picc.errors.NO_SCHOOL_ID);
    }

    var params = {}
    params[this.fields.OPERATING] = 1
    //params[this.fields.OPEID + "__not"] = "null"
    /*params[
      this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
    ] = true*/
    params[this.fields.SIZE + "__range"] = "0.."
    params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
    params[this.fields.ID + "__range"] = "..999999"
    //params["fields"] = "latest,school,id,location";
    params["keys_nested"] = true

    // TODO - Handle Error.
    let request = apiGet("/schools/", {
      id: id,
    })
      .then((response) => {
        if (response.data.metadata.total > 1) {
          console.warn('More than one school found for ID: "' + id + '"')
          return null
        }

        this.school = response.data.results[0]
        document.title =
          _.get(this.school, "school.name") + " | College Scorecard"
      })
      .catch((response) => {
        console.warn("No School found for ID: " + id)
      })
  },
}
</script>
