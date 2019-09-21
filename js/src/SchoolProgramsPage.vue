<template>
  <v-app id="app" class="school-page">
    <!-- Search results -->
    <div class="school-bg">
      <div class="container school-back">
        <a id="referrer-link" class="link-more" href="../search/">
          <i class="fa fa-chevron-left"></i> Back to {{school.name }}
        </a>
      </div>

      <v-container>
        <v-row>
          <v-col cols="12" md="9" class="school-left">
            <div v-if="!school.id" class="show-loading">
              <h1>Loading...</h1>
            </div>

            <div v-else class="show-loaded" id="school">
              <div class>
                <div class="school-heading pa-5 mb-5">
                  <div
                    class="investigation-major-wrapper"
                    data-bind="under_investigation"
                    aria-hidden="true"
                  >
                    <a>
                      <p
                        class="investigation-major"
                        aria-describedby="tip-hcm2"
                        data-bind="branch_campus"
                      >
                        Under Ed Monitoring
                        <i class="tooltip-target fa fa-info-circle"></i>
                      </p>
                    </a>
                  </div>
                  <v-row>
                    <v-col cols="12" md="8" class="py-0">
                      <h1 class="pa-0 ma-0">{{ _.get(school, fields['NAME'], 'School Name') }}</h1>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <!-- /.school-card_container-school -->
              <v-card class='px-4 pt-2 mb-4'>
              <v-select
                :items="filters"
                item-text="credential"
                item-value="id"
                v-model="currentFilter"
                label= "Filter by Degree"
              ></v-select>
              </v-card>
              <v-expansion-panels>
                <v-expansion-panel v-for="(program, key) in processedPrograms" :key="key">
                  <v-expansion-panel-header>{{ key.slice(0,-1) }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-expansion-panels dark>
                      <v-expansion-panel v-for="fos in program" :key="fos.code">
                        <v-expansion-panel-header>{{ fos.title.slice(0,-1) }} / {{ fos.credential.title }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-simple-table>
                            <tr>
                              <th>Count</th>
                              <th>Median Debt</th>
                            </tr>
                            <tr>
                              <td>{{fos.ipeds_award_count}}</td>
                              <td v-if="fos.median_debt">{{fos.median_debt | numeral('$0,0') }}</td>
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
            <div class="school-share-wrapper">
              <div
                class="button button-share"
                data-share-button
                tabindex="0"
                role="button"
                onclick="void(0)"
              >
                <span class="top xaxis content">Share this School</span>
                <ul class="social-share-list bottom xaxis content">
                  <li class="social-item">
                    <a
                      data-href="https://twitter.com/intent/tweet?text=Take%20a%20look%20at%20this%20school&amp;url={url}"
                      data-bind="school_share_link_twt"
                      data-social="Twitter"
                      title="Share on Twitter"
                      target="_blank"
                    >
                      <i class="fa fa-twitter"></i>
                      <span class="sr-only">Share on Twitter</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a
                      data-href="https://www.facebook.com/sharer/sharer.php?u={url}"
                      data-bind="school_share_link_fb"
                      title="Share on Facebook"
                      data-social="Facebook"
                      target="_blank"
                    >
                      <i class="fa fa-facebook"></i>
                      <span class="sr-only">Share on Facebook</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a
                      data-href="mailto:?subject=Take%20a%20look%20at%20this%20school&amp;body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A{url}"
                      data-bind="school_share_link_mail"
                      data-social="Email"
                      title="Share via Email"
                    >
                      <i class="fa fa-envelope"></i>
                      <span class="sr-only">Share via Email</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a
                      data-href="https://www.linkedin.com/shareArticle?mini=true&url={url}"
                      data-bind="school_share_link_li"
                      data-social="LinkedIn"
                      title="Share on LinkedIn"
                      target="_blank"
                    >
                      <i class="fa fa-linkedin"></i>
                      <span class="sr-only">Share on LinkedIn</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- { include paying_for_college.html } -->
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import Tooltip from "./components/vue/Tooltip.vue";
export default {
  props: ["baseUrl"],
  components: {
    tooltip: Tooltip
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
          { id: 8, credential: "Graduate/Professional Certificate" },
        ],
      currentFilter: 0
    };
  },
  computed: {
    processedPrograms() {
      let programs = _.get(this.school, "latest.programs.aid.debt.cip_4_digit");
      this.programs = programs;
      let processedPrograms = {};
      let self = this;
      programs.forEach(function(program, idx) {
        if (
          !self.currentFilter ||
          self.currentFilter == program.credential.level
        ) {
          let twodigit = program.code.substr(0, 2);
          if (!processedPrograms[self.cip2[twodigit]]) processedPrograms[self.cip2[twodigit]] = [];
          processedPrograms[self.cip2[twodigit]].push({
            title: program.title,
            count: program.ipeds_award_count,
            credential: program.credential,
            median_debt: program.median_debt
          });
        }
      });
      return processedPrograms;
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
    params["fields"] = "latest,school,id,location";
    params["keys_nested"] = true;
    picc.API.getSchool(id, params, function onSchoolLoad(error, school) {
      self.school = school;
    });
  }
};
</script>