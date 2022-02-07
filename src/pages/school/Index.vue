<template>
  <v-main>
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12" lg="9" class="school-left">
          <div v-if="!school.id && !error" class="show-loading">
            <v-card class="pa-5">
              <h1 class="title">
                Loading
                <v-icon color="#00365e">fas fa-circle-notch fa-spin</v-icon>
              </h1>
            </v-card>
          </div>
          <div v-else-if="error">
            <v-card class="pa-5">
              <h2>Something went wrong</h2>
              <p>Try searching for a school by name:</p>
              <name-autocomplete
                @school-name-selected="handleSchoolNameSelected"
              />
            </v-card>
          </div>

          <div v-else id="school">
            <v-card class="school-heading px-3 mb-5">
              <!--Top Control Row-->
              <v-row id="school-sub-nav-header" class="csGreenBg">
                <v-col cols="3">
                  <v-btn
                    small
                    color="white"
                    text
                    id="referrer-link"
                    class="link-more"
                    :href="searchURL"
                    >&laquo; Back to search</v-btn
                  >
                </v-col>

                <v-col cols="9" class="text-right d-flex justify-end">
                  <add-to-compare :school="school" />

                  <share
                    small
                    text
                    color="white"
                    label="Share this School"
                    :url="shareLink"
                    show-copy
                    :hide="['email']"
                  />
                </v-col>
              </v-row>

              <!-- Institution Summary Container-->
              <v-row class="px-5 pt-5">
                <!-- School Information and Icons-->
                <v-col cols="12" md="7" class="pl-sm-6 pr-sm-5">
                  <v-chip v-if="underInvestigation == 1" color="error" label>
                    <!--prettyhtml-ignore-->
                    <strong>Under ED Monitoring</strong>&nbsp;<tooltip
                      definition="hcm2"
                      color="#FFFFFF"
                      class="ml-2"
                      :isBranch="isBranch"
                    />
                  </v-chip>
                  <h1
                    id="profile-institution-title"
                    class="display-3 font-weight-bold pa-0 mb-2"
                  >
                    {{ schoolName }}
                  </h1>
                  <h2 class="title location">
                    <span>{{ city }}</span
                    >,
                    <span>{{ state }}</span>
                  </h2>
                  <h2 class="title population my-0">
                    <span>{{ undergraduates | separator }}</span>
                    undergraduate students
                  </h2>
                  <h2 class="title school-url mt-0">
                    <a
                      target="_blank"
                      :href="$url('/school/transition/?url=' + schoolUrl)"
                      >{{ schoolUrlDisplay | formatUrlText }}<v-icon
                    x-small
                    class="pl-1"
                    color="#007000"            
                  >
                    fas fa-external-link-alt
                  </v-icon>                        
                      </a
                    >
                  </h2>
                  <school-icons
                    :school="school"
                    :fields="fields"
                    class="my-5"
                  />
                </v-col>

                <!-- Map -->
                <v-col cols="12" md="5" class="pr-8 pl-sm-5 py-0">
                  <!-- <div class="school-map" ref="map"></div> -->
                  <div class="school-map mx-auto" v-if="school">
                    <v-img
                      contain
                      eager
                      max-height="380px"
                      max-width="420px"
                      :src="generateMapURL(school)"
                      :alt="`Map showing location of ${schoolName}`"
                    >
                    </v-img>
                  </div>
                </v-col>
              </v-row>

              <!--Special Designations-->
              <v-row class="mt-3 pl-5 pt-5" v-if="specialDesignations.length > 0">
                <v-col cols="12" class="px-sm-5">
                  <div class="school-special_designation">
                    <v-chip
                      class="special mr-1 mb-1"
                      color="blue lighten-3"
                      label
                      v-for="designation in specialDesignations"
                      :key="designation"
                      >{{ designation }}</v-chip
                    >
                  </div>
                </v-col>
              </v-row>

              <!-- Institution Summary and Field Of Study Select + Summary -->
              <v-row class="mt-3 pr-8 pl-5">
                <!--Institution Summary-->
                <v-col cols="12" class="pt-12 pb-8 pa-sm-5">
                    <median-toggle
                      :display-toggle="medianToggle"
                      @median-switch-click="handleMedianToggle"
                      @median-tab-change="handleMedianToggle"
                      :group-name="this.$options.filters.yearsText(groupName) + ' Schools'"
                      label-prefix="Midpoint for "
                      :tab-style="{
                        width: '32%',
                      }"
                    />                  
                </v-col>                 
                <v-col md="6" cols="12" class="pr-sm-3">                
                  <div id="school-completion-rate-bar" class="py-3 pa-sm-3">
                    <h2 class="mb-3">
                      <!--prettyhtml-ignore-->
                      Graduation Rate&nbsp;<tooltip
                        definition="graduation-rate"
                        :version="completionRateFieldDefinition"
                      />
                    </h2>
                    <h2
                      class="display-2 navy-text font-weight-bold pb-3"
                      v-if="completionRate"
                    >
                      {{ completionRate |  numeral("0%") }}
                    </h2>
                    <div  class="data-na pb-3" v-else>Data Not Available</div>
                    <em v-if="completionRate && (this.medianToggle === 'group' ? fakeGraduationRate[groupName][0] : fakeGraduationRate[groupName][1])">Midpoint for {{this.medianToggle === 'group' ? this.$options.filters.yearsText(groupName) + " " : "All"}} Schools: {{this.$options.filters.numeral(this.medianToggle === 'group' ? fakeGraduationRate[groupName][0] : fakeGraduationRate[groupName][1] ,'0%')}}</em>                    
                    <vertical-bar-median
                      v-if="completionRate"
                      :value="{
                        label: '',
                        value: Math.round(parseFloat(completionRate) * 100)
                      }"
                      :min="{
                        label: '0%',
                        value: 0,
                        style: { height: '60px' },
                      }"
                      :max="{
                        label: '100%',
                        value: 100,
                        style: { height: '60px' },
                      }"
                      :median="{
                        label: 'Midpoint for ' + (this.medianToggle === 'group' ? this.$options.filters.yearsText(groupName): 'All') + ' Schools',
                        value: this.medianToggle === 'group' ? fakeGraduationRate[groupName][0] * 100 : fakeGraduationRate[groupName][1] * 100,
                        style: { height: '60px' },
                      }"
                      color="#00365e"
                      :height="500"
                      :y-bar-thickness="50"
                      :label-font-size="16"
                      :labels="true"
                      class="mb-4"
                    ></vertical-bar-median>
                    <div v-else class="data-na">Data Not Available</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pr-sm-3">
                  <div id="school-avg-cost" class="mb-4">
                    <h2 class="mb-3" v-if="!isProgramReporter">
                      <!--prettyhtml-ignore-->
                      Average Annual Cost
                      <tooltip definition="avg-cost" />
                    </h2>
                    <h2 v-else class="mb-3">
                      <!--prettyhtml-ignore-->
                      Average Annual Cost for Largest Program
                      <tooltip
                        definition="avg-program-cost"
                        :isNegative="netPrice < 0"
                      />
                    </h2>

                    <h2
                      class="display-2 navy-text font-weight-bold pb-3"
                      v-if="netPrice"
                    >
                      {{ netPrice | numeral("$0,0") }}
                    </h2>
                    <div class="data-na pb-3" v-else>Data Not Available</div>
                    <em v-if="netPrice && (this.medianToggle === 'group' ? fakeAverageAnnualCosts[groupName][0] : fakeAverageAnnualCosts[groupName][1])">Midpoint for {{this.medianToggle === 'group' ? this.$options.filters.yearsText(groupName): "All"}} Schools: {{this.$options.filters.numeral(this.medianToggle === 'group' ? Math.round(parseFloat(fakeAverageAnnualCosts[groupName][0])) : Math.round(parseFloat(fakeAverageAnnualCosts[groupName][1])) ,'$0,0')}}</em>

                    <horizontal-bar-median
                      v-if="netPrice"
                      :value="{
                        label:  this.$options.filters.numeral(netPrice,'$0,0'),
                        value: netPrice
                      }"
                      :min="{
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      }"
                      :max="{
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      }"
                      :median="{
                        label: 'Midpoint for ' + (this.medianToggle === 'group' ? this.$options.filters.yearsText(groupName): 'All') + ' Schools',
                        value: this.medianToggle === 'group' ? fakeAverageAnnualCosts[groupName][0] : fakeAverageAnnualCosts[groupName][1],
                        style: { height: '60px' },
                        show: true
                      }"
                      :upperTipStyleOverride="{
                        display: 'none',
                      }"
                      :rangeChartStyle="{
                        height: '35px'
                        }"
                      color="#00365e"
                      :height="500"
                      :y-bar-thickness="50"
                      :label-font-size="24"
                      :labels="true"
                      class="pt-3"
                      style="height:140px"
                    ></horizontal-bar-median>
                    <div class="data-na" v-else>Data Not Available</div>                    
                  </div>

                  <div id="school-median-earnings" class="mb-4">
                    <h2 class="mb-3" v-if="!isProgramReporter">
                      <!--prettyhtml-ignore-->
                      Median Earnings
                      <tooltip definition="institution-median-earnings" />
                    </h2>
                    <h2 v-else class="mb-3">
                      <!--prettyhtml-ignore-->
                      Median Earnings for Largest Program
                      <tooltip
                        definition="institution-median-earnings"
                        :isNegative="medianEarnings < 0"
                      />
                    </h2>

                    <h2
                      class="display-2 navy-text font-weight-bold pb-3"
                      v-if="medianEarnings"
                    >
                      {{ medianEarnings | numeral("$0,0") }}
                    </h2>
                    <div class="data-na pb-3" v-else>Data Not Available</div>
                    <em v-if="medianEarnings && (this.medianToggle === 'group' ? fakeMedianEarnings[groupName][0] : fakeMedianEarnings[groupName][1])">Midpoint for {{this.medianToggle === 'group' ? this.$options.filters.yearsText(groupName): "All"}} Schools: {{this.$options.filters.numeral(this.medianToggle === 'group' ? Math.round(parseFloat(fakeMedianEarnings[groupName][0])) : Math.round(parseFloat(fakeMedianEarnings[groupName][1])) ,'$0,0')}}</em>

                    <horizontal-bar-median
                      v-if="medianEarnings"
                      :value="{
                        label:  this.$options.filters.numeral(medianEarnings,'$0,0'),
                        value: medianEarnings
                      }"
                      :min="{
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      }"
                      :max="{
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      }"
                      :median="{
                        label: 'Midpoint for ' + (this.medianToggle === 'group' ? this.$options.filters.yearsText(groupName): 'All') + ' Schools',
                        value: this.medianToggle === 'group' ? fakeMedianEarnings[groupName][0] : fakeMedianEarnings[groupName][1],
                        style: { height: '60px' },
                        show: true
                      }"
                      :upperTipStyleOverride="{
                        display: 'none',
                      }"                      
                      color="#00365e"
                      :height="500"
                      :y-bar-thickness="50"
                      :label-font-size="24"
                      :labels="true"
                      class="pt-3"
                      style="height:140px"                      
                    ></horizontal-bar-median>
                    <div class="data-na" v-else>Data Not Available</div>
                  </div>
                </v-col>                
              </v-row>
              <!-- end: Institution Quick Stats -->
            </v-card>

            <v-row>
              <v-col class="text-right">
                <v-btn primary @click="all" class="my-2 mr-2">Expand All</v-btn>
                <v-btn primary @click="none" class="my-2">Close All</v-btn>
              </v-col>
            </v-row>

            <!--Field Of Study Panel-->
            <v-expansion-panels multiple focusable v-model="panelsFOS">
              <v-expansion-panel class="fos-profile-panel">
                <v-expansion-panel-header
                  id="fields-of-study"
                  aria-controls="fos-content"
                  @click="trackAccordion('Fields of Study')"
                >
                  <span
                    class="field-of-study-select-icon mr-2"
                    style="width: 35px;height: 35px;"
                  >
                    <v-icon size="20">
                      fas fa-award
                    </v-icon>
                  </span>

                  <span>
                    Fields of Study
                  </span>
                </v-expansion-panel-header>

                <v-expansion-panel-content
                  id="fos-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <h2 class="mb-4 pt-2 pt-sm-4">
                    Fields of Study Offered At {{ schoolName }}
                  </h2>

                  <div
                    class="text-right pa-2 field-of-study-select-container-header"
                  >
                    <!-- <v-btn
                      v-if="selectedFOS"
                      text
                      small
                      :color="black"
                      @click="
                        $emit(
                          'toggle-compare-school',
                          generateCompareFieldOfStudy(selectedFOSDetail),
                          'compare-fos'
                        )
                      "
                    >
                      <v-icon
                        class="mr-2"
                        :color="
                          isSelected(
                            this.generateCompareFieldOfStudy(
                              this.selectedFOSDetail
                            ),
                            this.compareFieldsOfStudy
                          )
                            ? '#0075B2'
                            : 'black'
                        "
                        >fa fa-check-circle</v-icon
                      >
                      <div
                        v-if="
                          !isSelected(
                            this.generateCompareFieldOfStudy(
                              this.selectedFOSDetail
                            ),
                            this.compareFieldsOfStudy
                          )
                        "
                      >
                        Add to Compare Field of Study
                      </div>
                      <div v-else>&nbsp;Added to Compare</div>
                    </v-btn> -->
                  </div>

                  <div class="mb-4">
                    <field-of-study-select
                      :cip-two-nested-cip-four="fieldOfStudySelectItems"
                      v-model="selectedFOS"
                      @input-clear="handleFieldOfStudyClear"
                      container-id="field-of-study-select-search-container2"
                      result-id="field-of-study-select-search-result2"
                    />
                  </div>

                  <div v-if="selectedFOSDetail">
                    <div class="pa-sm-4 mb-4" id="fos-number-grads">
                      <!--TODO - Adjust Class-->
                      <h3 class="mr-4" style="font-weight: 500">
                        Number of Graduates
                        <tooltip
                          class="ml-2"
                          definition="fos-number-of-graduates"
                        />
                      </h3>

                      <h3
                        class="display-2 navy-text font-weight-bold"
                        style="vertical-align: center"
                        v-if="selectedFOSDetail.counts.ipeds_awards2"
                      >
                        {{ selectedFOSDetail.counts.ipeds_awards2 }}
                      </h3>

                      <div class="data-na d-sm-inline-block" v-else>
                        Data Not Available
                      </div>
                    </div>

                    <!-- Salary After Completing -->
                    <div class="fos-sub-title-header pa-4">
                      <h3>Salary After Completing</h3>
                    </div>

                    <div class="px-4 pb-5 px-sm-4 py-sm-4">
                      <v-row>
                        <!--Median Earnings-->
                        <v-col cols="12" sm="12" md="5">
                          <h4 class="mb-2">
                            Median Earnings&nbsp;
                            <tooltip definition="fos-median-earnings" />
                          </h4>

                          <div v-if="fosSalarySelect === 'aid'">
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  'earnings.highest.2_yr.overall_median_earnings'
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    "earnings.highest.2_yr.overall_median_earnings"
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div
                              v-else
                              class="mini-data-na text-center mr-sm-11"
                            >
                              Data Not Available
                            </div>
                          </div>
                        </v-col>

                        <!--Monthly Earnings-->
                        <v-col cols="12" sm="12" md="4" class="pl-sm-1">
                          <h4 class="mb-2">
                            Monthly Earnings&nbsp;
                            <tooltip definition="fos-monthly-earnings" />
                          </h4>

                          <div v-if="fosSalarySelect === 'aid'">
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_EARNINGS_FED
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  (_.get(
                                    selectedFOSDetail,
                                    fields.FOS_EARNINGS_FED
                                  ) /
                                    12)
                                    | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center">
                              Data Not Available
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>

                    <!-- Financial Aid &amp; Debt -->
                    <div class="fos-sub-title-header pa-4">
                      <h3>Financial Aid &amp; Debt</h3>
                    </div>

                    <div class="px-5 pb-5 px-sm-5 py-sm-4">
                      <v-row>
                        <v-col cols="12" md="5" class="d-flex">
                          <v-checkbox
                            class="mt-2"
                            hide-details
                            v-model="fosShowDebtAtPrior"
                            aria-label="Include debt borrowed at any prior institutions"
                            color="secondary"
                          >
                            <template v-slot:label>
                              <span class="profile-fos-include-prior-debt">
                                Include debt borrowed at any prior<br
                                  class="d-sm-none"
                                />
                                institution&nbsp;
                                <tooltip definition="include-debt-prior-inst" class="pt-2" /> 
                              </span>
                            </template>
                          </v-checkbox>
                         
                        </v-col>

                        <!--Median Total-->
                        <v-col cols="12" sm="12" md="4" class="pl-sm-1">
                          <h4 class="mb-2">
                            Median Total Debt
                            <br class="d-none d-md-block" />After
                            Graduation&nbsp;
                            <tooltip
                              v-if="!fosShowDebtAtPrior"
                              definition="fos-median-debt"
                            />
                            <tooltip
                              v-else
                              definition="fos-median-debt-all-schools"
                            />
                          </h4>

                          <div v-if="!fosShowDebtAtPrior">
                            <div
                              v-if="
                                _.get(selectedFOSDetail, fields.FOS_DEBT_MEDIAN)
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MEDIAN
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div
                              v-else
                              class="mini-data-na text-center mr-sm-11"
                            >
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_DEBT_MEDIAN_PRIOR
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MEDIAN_PRIOR
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center mr-sm-11">
                              Data Not Available
                            </div>
                          </div>
                        </v-col>

                        <!--Monthly Loan-->
                        <v-col cols="12" sm="12" md="3" class="pl-sm-1">
                          <h4 class="mb-2">
                            Monthly Loan Payment&nbsp;
                            <tooltip
                              v-if="!fosShowDebtAtPrior"
                              definition="fos-monthly-debt-payment"
                            />
                            <tooltip
                              v-else
                              definition="fos-monthly-debt-payment-all-schools"
                            />
                          </h4>

                          <div v-if="!fosShowDebtAtPrior">
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_DEBT_MONTHLY
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MONTHLY
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center mr-sm-11">
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_DEBT_MONTHLY_PRIOR
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MONTHLY_PRIOR
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center mr-sm-11">
                              Data Not Available
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </div>

                  <div class="fos-sub-title-header px-4 pt-4 pb-0 top-fos-sub-title-header" style="background:none !important;">
                    <h3>
                      Top Fields of Study at {{ schoolName }}
                      <tooltip definition="field-of-study" />
                    </h3>
                  </div>

                  <!-- Top Fields of Study -->
                  <div class="px-5 px-sm-5 pb-sm-4">
                    <p class="my-3" v-if="fieldsOfStudy.length">
                      Out of {{ fosUndergradCount | numeral }} undergraduate
                      {{ fosUndergradCount == 1 ? "field" : "fields" }} of study
                      at {{ schoolName }}, the
                      {{ fieldsOfStudy.length < 10 ? fieldsOfStudy.length : 10 }}
                      {{ hoistGroupText }} are shown below. ({{
                        hoistCount
                      }}
                      had relevant data on {{ hoistGroupData }}.)
                      <a :href="this.$url(fieldsLink)">See All Fields of Study &raquo;</a>
                    </p>

                    <p class="my-2">
                      <span class="d-block d-sm-inline">Sort by:</span>
                      <v-btn
                        class="ma-1 component-toggle-button"
                        :color="
                          field_sort == 'ipeds_award_count' ? 'secondary' : null
                        "
                        small
                        @click="field_sort = 'ipeds_award_count'"
                        >Largest Size</v-btn
                      >
                      <v-btn
                        class="ma-1 component-toggle-button"
                        :color="
                          field_sort == 'highest_earnings' ? 'secondary' : null
                        "
                        small
                        @click="field_sort = 'highest_earnings'"
                        >Highest Earnings</v-btn
                      >
                      <v-btn
                        class="ma-1 component-toggle-button"
                        :color="
                          field_sort == 'lowest_debt' ? 'secondary' : null
                        "
                        small
                        @click="field_sort = 'lowest_debt'"
                        >Lowest Debt</v-btn
                      >
                    </p>

                    <v-row
                      class="mx-5 mt-5 d-none d-sm-flex"
                      v-if="fieldsOfStudy.length"
                    >
                      <v-col
                        cols="12"
                        sm="8"
                        class="ma-0 px-2 py-0 font-weight-bold"
                        >Field of Study</v-col
                      >
                      <v-col
                        cols="12"
                        sm="4"
                        class="ma-0 pa-0 font-weight-bold"
                        >{{ currentHoist }}</v-col
                      >
                    </v-row>

                    <v-row
                      class="mx-0 mt-5 d-block d-sm-none"
                      v-if="fieldsOfStudy.length"
                    >
                      <v-col cols="12" class="ma-0 px-2 py-2 font-weight-bold"
                        >Field of Study ({{ currentHoist }})</v-col
                      >
                    </v-row>

                    <v-expansion-panels
                      class="my-3"
                      v-if="fieldsOfStudy.length"
                    >
                      <v-expansion-panel
                        v-for="fos in fieldsOfStudy"
                        :key="fos.code + '-' + fos.credential.level"
                      >
                        <v-expansion-panel-header class="py-0 pl-2 pl-sm-4">
                          <v-row
                            no-gutters
                            class="my-0 d-none d-sm-flex"
                            align="center"
                          >
                            <v-col cols="12" sm="8" class="pa-2"
                              >{{ fos.title.slice(0, -1) }} -
                              {{ fos.credential.title }}</v-col
                            >
                            <v-col
                              v-if="hoistCurrency"
                              cols="12"
                              class="navy-text px-5 font-weight-bold"
                              sm="4"
                              >{{ fos.hoist | numeral("$0,0") }}</v-col
                            >
                            <v-col
                              v-else
                              cols="12"
                              class="navy-text px-5 font-weight-bold"
                              sm="4"
                              >{{ fos.hoist | separator }}</v-col
                            >
                          </v-row>
                          <div class="d-block d-sm-none my-2 mx-1 pl-0">
                            {{ fos.title.slice(0, -1) }} -
                            {{ fos.credential.title }}
                            <span
                              v-if="hoistCurrency"
                              class="navy-text font-weight-bold"
                              >({{ fos.hoist | numeral("$0,0") }})</span
                            >
                            <span v-else class="navy-text font-weight-bold"
                              >({{ fos.hoist | separator }})</span
                            >
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <field-data-extended
                            :fos="fos"
                            :fos-salary-select="fieldDataExtendedSalarySelect"
                            :fos-salary-select-items="fosSalarySelectItems"
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

                    <div v-else>
                      <v-alert type="info" class="mt-3"
                        >There are no fields of study with data available for
                        {{ currentHoist }}.</v-alert
                      >
                    </div>

                    <p class="text-center">
                      <v-btn rounded color="secondary" :href="this.$url(fieldsLink)">
                        <span class="d-none d-sm-flex"
                          >See All Available Fields of Study</span
                        >
                        <span class="d-block d-sm-none">See All</span>
                      </v-btn>
                    </p>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels multiple focusable v-model="panels">
              <!--Costs - Panel-->
              <v-expansion-panel class="institution-profile-panel">
                <v-expansion-panel-header
                  id="cost"
                  aria-controls="costs-content"
                  @click="trackAccordion('Costs')"
                  >Costs</v-expansion-panel-header
                >
                <v-expansion-panel-content
                  id="costs-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <v-row>
                    <v-col cols="12" md="12">
                      <div v-if="!isProgramReporter">
                        <h2 class="mb-3">
                          Average Annual Cost&nbsp;
                          <tooltip definition="avg-cost" />
                        </h2>
                        <h2
                          v-if="netPrice"
                          class="display-2 navy-text font-weight-bold mb-3"
                        >
                          {{ netPrice | numeral("$0,0") }}
                        </h2>
                        <div class="data-na" v-else>Data Not Available</div>
                        <p class="mb-0">
                          Cost includes tuition, living costs, books and
                          supplies, and fees minus the average grants and
                          scholarships for federal financial aid recipients.
                        </p> 

                        <median-toggle
                          :display-toggle="medianToggle"
                          :control-tab="controlTab"
                          @median-switch-click="handleMedianToggle"
                          @median-tab-change="handleMedianToggle"
                          :group-name="this.$options.filters.yearsText(groupName) + ' Schools'"
                          class="pt-8 pb-8"
                        />  
                      <v-row>
                      <v-col cols="2"></v-col>
                      <v-col cols="8">
                      <horizontal-bar-median
                        v-if="netPrice"
                        :value="{
                        label:  this.$options.filters.numeral(netPrice,'$0,0'),
                        value: netPrice
                        }"
                        :min="{
                          label: '$0',
                          value: 0,
                          style: { height: '60px' },
                        }"
                        :max="{
                          label: '$100,000',
                          value: 100000,
                          style: { height: '60px' },
                        }"
                        :median="{
                          label: 'Midpoint: ' + this.$options.filters.numeral(this.medianToggle === 'group' ? Math.round(parseFloat(fakeAverageAnnualCosts[groupName][0])) : Math.round(parseFloat(fakeAverageAnnualCosts[groupName][1])) ,'$0,0'),
                          value: this.medianToggle === 'group' ? fakeAverageAnnualCosts[groupName][0] : fakeAverageAnnualCosts[groupName][1] ,
                          style: { height: '60px' },
                          show: true
                        }"
                        color="#00365e"
                        :height="500"
                        :y-bar-thickness="50"
                        :label-font-size="24"
                        :labels="true"
                      ></horizontal-bar-median>  
                      <div class="data-na" v-else>Data Not Available</div> 
                      </v-col>  
                       <v-col cols="2"></v-col>     
                      </v-row>                                                         
                      </div>
                      <div v-else>
                        <h2 class="mb-3">
                          Average Annual Cost for Largest Program
                          <tooltip
                            definition="avg-program-cost"
                            :isNegative="netPrice < 0"
                          />
                        </h2>
                        <h2 class="title my-3">
                          <span class="font-weight-bold navy-text">{{
                            programReporter[0].title
                          }}</span>
                        </h2>
                        <h2 class="title my-3" v-if="netPrice">
                          <span class="navy-text font-weight-bold">{{
                            netPrice | numeral("$0,0")
                          }}</span>
                          <span
                            v-if="
                              programReporter[0].annualized ==
                                programReporter[0].full_program
                            "
                            > for a
                            {{ programReporter[0].avg_month_completion }}-month
                            program</span
                          >
                          <span class="costDescription" v-else
                            > per year on average</span
                          >
                        </h2>
                        <div v-else class="data-na">Data Not Available</div>
                        <p>
                          Cost includes tuition, living costs, books and
                          supplies, and fees minus the average grants and
                          scholarships for federal financial aid recipients.
                        </p>            

                        <median-toggle
                          :display-toggle="medianToggle"
                          :control-tab="controlTab"
                          @median-switch-click="handleMedianToggle"
                          @median-tab-change="handleMedianToggle"
                          :group-name="this.$options.filters.yearsText(groupName) + ' Schools'"
                          class="pt-8 pb-8"
                        />  
                      <v-row>
                      <v-col cols="2"></v-col>
                      <v-col cols="8">
                        <horizontal-bar-median
                          v-if="netPrice"
                          :value="{
                          label:  this.$options.filters.numeral(netPrice,'$0,0'),
                          value: netPrice
                          }"
                          :min="{
                            label: '$0',
                            value: 0,
                            style: { height: '60px' },
                          }"
                          :max="{
                            label: '$100,000%',
                            value: 100000,
                            style: { height: '60px' },
                          }"
                          :median="{
                            label: 'Midpoint: ' + this.$options.filters.numeral(this.medianToggle === 'group' ? Math.round(parseFloat(fakeAverageAnnualCosts[groupName][0])) : Math.round(parseFloat(fakeAverageAnnualCosts[groupName][1])) ,'$0,0'),
                            value: this.medianToggle === 'group' ? fakeAverageAnnualCosts[groupName][0] : fakeAverageAnnualCosts[groupName][1] ,
                            style: { height: '60px' },
                            show: true
                          }"
                          color="#00365e"
                          :height="500"
                          :y-bar-thickness="50"
                          :label-font-size="24"
                          :labels="true"
                        ></horizontal-bar-median>
                      <div class="data-na" v-else>Data Not Available</div> 
                      </v-col>  
                       <v-col cols="2"></v-col>     
                      </v-row>                       
                      </div>
                      
                      <h2 class="mb-3 mt-5">By Family Income</h2>
                      <p>
                        Depending on the federal, state, or institutional grant
                        aid available, students in your income bracket may pay
                        more or less than the overall average costs.
                      </p>

                      <v-simple-table class="school-table mb-4">
                        <caption class="sr-only">
                          Average cost by family income
                        </caption>
                        <thead>
                          <tr>
                            <th>Family Income</th>
                            <th>Average Annual Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>$0-$30,000</td>
                            <td v-if="income['0-30000']">
                              {{ income["0-30000"] | numeral("$0,0") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>$30,001-$48,000</td>
                            <td v-if="income['30001-48000']">
                              {{ income["30001-48000"] | numeral("$0,0") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>$48,001-$75,000</td>
                            <td v-if="income['48001-75000']">
                              {{ income["48001-75000"] | numeral("$0,0") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>$75,001-$110,000</td>
                            <td v-if="income['75001-110000']">
                              {{ income["75001-110000"] | numeral("$0,0") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>$110,001+</td>
                            <td v-if="income['110001-plus']">
                              {{ income["110001-plus"] | numeral("$0,0") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                      <p class="text-center">
                        <net-price-link :url="netPriceCalculatorUrl" />                      
                      </p>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Graduation and Retention - Panel-->
              <v-expansion-panel class="institution-profile-panel">
                <v-expansion-panel-header
                  id="graduation"
                  aria-controls="graduation-content"
                  @click="trackAccordion('Graduation &amp; Retention')"
                  >Graduation &amp; Retention</v-expansion-panel-header
                >
                <v-expansion-panel-content
                  id="graduation-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <v-row>
                    <v-col cols="12" md="12" id="showPellOnlyGrad">
                      <v-row class="d-flex">
                      <v-col cols="7" md="7" sm="12">
                      <h2 class="mb-3">
                        Graduation Rate&nbsp;
                        <tooltip definition="graduation-rate" 
                        :version="completionRateFieldDefinition"
                        :isPell="showPellOnlyGrad" />
                      </h2>
                      </v-col>
                      <v-col cols="5" md="5" sm="12" class="d-flex justify-end">
                      <v-checkbox
                        v-model="showPellOnlyGrad"
                        label="Show Pell Grant Recipients Only"
                        color="secondary"
                        class="mt-0"
                      >
                        <template v-slot:label>
                          <span>
                            Show Pell Grant Recipients Only&nbsp;
                          </span>
                        </template>
                      </v-checkbox>                      
                      </v-col>  
                      </v-row>
                        <v-expand-transition>
                        <median-toggle
                          v-show="!showPellOnlyGrad"
                          :display-toggle="medianToggle"
                          :control-tab="controlTab"
                          @median-switch-click="handleMedianToggle"
                          @median-tab-change="handleMedianToggle"
                          :group-name="this.$options.filters.yearsText(groupName) + ' Schools'"
                          class="pt-0 pb-8"
                        />
                        </v-expand-transition>
                       <v-row>
                      <v-col cols="2"></v-col>
                      <v-col cols="8">                       
                    <horizontal-bar-median
                      v-if="(completionRate && !showPellOnlyGrad) || (completionRatePell && showPellOnlyGrad)"
                      :value="{
                        label: showPellOnlyGrad ? Math.round(parseFloat(completionRatePell) * 100) + '%' :  Math.round(parseFloat(completionRate) * 100) + '%',
                        value: showPellOnlyGrad ? Math.round(parseFloat(completionRatePell) * 100) : Math.round(parseFloat(completionRate) * 100)
                      }"
                      :min="{
                        label: '0%',
                        value: 0,
                        style: { height: '60px' },
                      }"
                      :max="{
                        label: '100%',
                        value: 100,
                        style: { height: '60px' },
                      }"
                      :median="{
                        label: 'Midpoint: ' + this.$options.filters.numeral(this.medianToggle === 'group' ? fakeGraduationRate[groupName][0] : fakeGraduationRate[groupName][1] ,'0%'),
                        value: this.medianToggle === 'group' ? fakeGraduationRate[groupName][0] * 100 : fakeGraduationRate[groupName][1] * 100,
                        style: { height: '60px' },
                        show: !showPellOnlyGrad
                      }"
                      color="#00365e"
                      :height="500"
                      :y-bar-thickness="50"
                      :label-font-size="24"
                      :labels="true"
                      class="pb-10"
                    ></horizontal-bar-median>                                         
                      <div v-else class="data-na">Data Not Available</div>
                      </v-col>  
                       <v-col cols="2"></v-col>     
                      </v-row>                       
                      <h2 class="mb-12 mt-5">
                        Students Who Return After Their First Year&nbsp;
                        <tooltip definition="retention-rate" />
                      </h2>
                       <v-row>
                      <v-col cols="2"></v-col>
                      <v-col cols="8">   
                    <horizontal-bar-median
                      v-if="retentionRate"
                      :value="{
                        label: Math.round(parseFloat(retentionRate) * 100) + '%',
                        value: Math.round(parseFloat(retentionRate) * 100)
                      }"
                      :min="{
                        label: '0%',
                        value: 0,
                        style: { height: '60px' },
                      }"
                      :max="{
                        label: '100%',
                        value: 100,
                        style: { height: '60px' },
                      }"
                      color="#00365e"
                      :height="500"
                      :y-bar-thickness="50"
                      :label-font-size="24"
                      :labels="true"
                    ></horizontal-bar-median> 
                      <div v-else class="data-na">Data Not Available</div>
                      </v-col>  
                       <v-col cols="2"></v-col>     
                      </v-row>  
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" id="showPellOnlyOutcomes">
                      <v-row class="d-flex">
                      <v-col cols="7" md="7" sm="12">
                      <h2 class="mb-3 mt-5">
                        Outcomes 8 Years After Attending&nbsp;
                        <tooltip definition="outcome-measures" :isPell="showPellOnlyOutcomes" />
                      </h2>
                      </v-col>
                      <v-col cols="5" md="5" sm="12" class="d-flex justify-end">                      
                      <v-checkbox
                        v-model="showPellOnlyOutcomes"
                        label="Show Pell Grant Recipients Only"
                        color="secondary"
                        class="mt-5  ml-auto"
                      >
                        <template v-slot:label>
                          <span>
                            Show Pell Grant Recipients Only&nbsp;
                          </span>
                        </template>
                      </v-checkbox>
                      </v-col>
                      </v-row>
                      <sankey-buttons
                        v-on:update-sankey="currentSankey = $event"
                      />
                      <sankey
                        :school="school"
                        colors="solid"
                        :currentSankey="currentSankey"
                        :showPellOnly="showPellOnlyOutcomes"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Financial Aid & Debt - Panel -->
              <v-expansion-panel class="institution-profile-panel">
                <v-expansion-panel-header
                  id="aid"
                  aria-controls="aid-content"
                  @click="trackAccordion('Financial Aid &amp; Debt')"
                  >Financial Aid &amp; Debt</v-expansion-panel-header
                >

                <v-expansion-panel-content
                  id="aid-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <v-card
                    v-if="aidFlag > 3 && aidFlag < 8"
                    color="blue"
                    class="pa-5 white--text"
                    >{{ site.data.glossary.ogc.default }}</v-card
                  >
                  <v-card
                    v-else-if="aidFlag == 3"
                    color="blue"
                    class="pa-5 white--text"
                    >{{ site.data.glossary.ogc.flag3 }}</v-card
                  >
                  <v-card
                    v-else-if="aidFlag == 8"
                    color="blue"
                    class="pa-5 white--text"
                    >{{ site.data.glossary.ogc.flag8 }}</v-card
                  >
                  <div v-else>
                    <v-row>
                      <v-col cols="12" md="8">
                        <v-select
                          :items="aidLoanSelectItems"
                          v-model="aidLoanSelect"
                          color="secondary"
                        />
                      </v-col>

                      <v-col cols="12" md="4" class="d-flex">
                        <v-checkbox
                          v-model="aidShowMedianDebtWithPrior"
                          label="Include debt borrowed at prior institutions"
                          color="secondary"
                          class="shrink"
                          hide-details
                          v-if="aidLoanSelect == 'plus'"
                        >
                          <template v-slot:label>
                            <span>
                              Include debt borrowed at any prior
                              institutions&nbsp;<tooltip definition="include-debt-prior-inst" class="pt-2 pl-2" />
                            </span>
                          </template>
                        </v-checkbox>
                        
                      </v-col>

                      <v-col cols="12" md="6">
                        <div v-if="aidLoanSelect === 'fed'">
                          <h2 class="mb-3">
                            Students Receiving Federal Loans
                            <tooltip definition="student-aid" />
                          </h2>
                          <div
                            v-if="studentsReceivingLoans ||
                                  studentsReceivingLoans == '0'">
                            <donut
                              color="#1874DC"
                              :value="studentsReceivingLoans * 100"
                              :height="200"
                              class="pb-3"
                            >                          
                          </donut>
                            <div class="sr-only">
                              Students Receiving Federal Loans: {{ Math.round(studentsReceivingLoans * 100)+"%" }}
                            </div>                          
                          </div>
                          <div v-else class="data-na pb-3">Data Not Available</div>
                          <p>
                            At some schools where few students borrow federal
                            loans, the typical undergraduate may leave school
                            with $0 in debt.
                          </p>

                          
                        </div>
                        <div v-else>
                          <h2 class="mb-3">
                            Parent Borrowing Rate
                            <!--TODO Update Tool Tip-->
                            <tooltip definition="parent-borrowing-rate" />
                          </h2>
                          <div
                            v-if="estimatedParentBorrowedText"
                            class="display-2 navy-text font-weight-bold"
                          >
                            {{ estimatedParentBorrowedText }}
                          </div>
                          <div v-else class="data-na">Data Not Available</div>
                          <p class="mt-2">
                            This is an estimated percentage of the number of
                            students who had a parent who borrowed a Parent PLUS
                            loan.
                          </p>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <h2 class="mb-3">
                          Median Total Debt After Graduation
                          <tooltip
                            v-if="
                              aidLoanSelect === 'fed'
                            "
                            definition="avg-debt"
                            :isBranch="isBranch"
                            :limitedFoS="fieldsLink"
                          />
                          <tooltip
                            v-else-if="
                              aidLoanSelect === 'plus' &&
                                !aidShowMedianDebtWithPrior
                            "
                            definition="parent-plus-avg-debt"
                            :isBranch="isBranch"
                          />
                          <tooltip
                            v-else-if="
                              aidLoanSelect === 'plus' &&
                                aidShowMedianDebtWithPrior
                            "
                            definition="parent-plus-avg-debt-all-schools"
                            :isBranch="isBranch"
                          />
                        </h2>
                        <p v-if="aidLoanSelect === 'fed'">
                          The typical total debt for undergraduate borrowers who complete college.
                        </p>
                        <!--                          <v-checkbox-->
                        <!--                            v-model="aidShowMedianDebtWithPrior"-->
                        <!--                            label="Include debt borrowed at prior institutions"-->
                        <!--                          />-->

                          <div
                            class="display-2 navy-text font-weight-bold  pb-5"
                            v-if="federalDebt &&
                              aidLoanSelect !== 'plus'"
                          >
                            {{ federalDebt | numeral("$0,0") }}
                          </div>

                        <h2
                          class="display-2 navy-text font-weight-bold  pb-5"
                          v-else-if="
                            parentPlusDebt &&
                              aidLoanSelect === 'plus' &&
                              !aidShowMedianDebtWithPrior
                          "
                        >
                          {{ parentPlusDebt | numeral("$0,0") }}
                        </h2>

                        <h2
                          class="display-2 navy-text font-weight-bold pb-5"
                          v-else-if="
                            parentPlusDebtAll &&
                              aidLoanSelect === 'plus' &&
                              aidShowMedianDebtWithPrior
                          "
                        >
                          {{ parentPlusDebtAll | numeral("$0,0") }}
                        </h2>

                        <div
                          class="data-na"
                          v-else
                        >
                          Data Not Available
                        </div>

                        <h2 class="mb-3 mt-3">
                          Typical Monthly Loan Payment<tooltip
                            v-if="
                              aidLoanSelect === 'fed'
                            "
                            definition="avg-loan-payment"
                            :isBranch="isBranch"
                            :limitedFoS="fieldsLink"
                            style="padding-left:2px;"
                          />
                          <tooltip
                            v-else-if="
                              aidLoanSelect === 'plus' &&
                                !aidShowMedianDebtWithPrior
                            "
                            definition="parent-plus-avg-loan-payment"
                            :isBranch="isBranch"
                            style="padding-left:2px;"
                          />
                          <tooltip
                            v-else-if="
                              aidLoanSelect === 'plus' &&
                                aidShowMedianDebtWithPrior
                            "
                            definition="parent-plus-avg-loan-payment-all-schools"
                            :isBranch="isBranch"
                            style="padding-left:2px;"
                          />
                        </h2>

                        <!--                          <v-checkbox-->
                        <!--                            v-model="aidShowMedianDebtWithPrior"-->
                        <!--                            label="Include debt borrowed at prior institutions"-->
                        <!--                          />-->

                        <div
                          v-if="
                            monthlyLoanPayment &&
                              aidLoanSelect === 'fed'
                          "
                        >
                          <div
                            class="display-2 navy-text font-weight-bold pb-3"
                          >{{
                              monthlyLoanPayment
                                | numeral("$0,0")
                            }}
                          </div>
                        </div>                       
                        <div
                          v-else-if="aidLoanSelect === 'fed'"
                          class="data-na pb-3"
                        >
                          Data Not Available
                        </div>

                        <div v-else-if="aidLoanSelect === 'plus'">
                          <div
                            v-if="
                              parentPlusPayment && !aidShowMedianDebtWithPrior
                            "
                          >
                            <h2 class="display-2 navy-text font-weight-bold">
                              {{
                                Math.round(parseFloat(parentPlusPayment))
                                  | numeral("$0,0")
                              }}
                            </h2>
                          </div>
                          <div
                            v-else-if="
                              parentPlusPaymentAll && aidShowMedianDebtWithPrior
                            "
                          >
                            <h2 class="display-2 navy-text font-weight-bold">
                              {{
                                Math.round(parseFloat(parentPlusPaymentAll))
                                  | numeral("$0,0")
                              }}
                            </h2>
                          </div>
                          <div v-else class="mini-data-na text-center">
                            Data Not Available
                          </div>
                        </div>

                        <p class="mt-3 mb-0 pb-15">
                          This is based on a standard 10-year payment plan,
                          other
                          <a
                            :href="$url('/school/transition/?url=' + encodeURIComponent('https://studentaid.gov/loan-simulator'))"
                            target="_blank"
                            @click="trackOutboundLink($event)"
                            >payment options<v-icon
                              x-small
                              class="pl-1"
                              color="#007000"
                            >
                              fas fa-external-link-alt
                            </v-icon> 
                          </a>
                          are available, like income-driven repayment. An 
                          <a 
                          target="_blank" 
                          :href="$url('/school/transition/?url=' + encodeURIComponent('https://studentaid.gov/manage-loans/repayment/plans/income-driven'))"
                          @click="trackOutboundLink($event)"
                          >income-driven repayment<v-icon
                            x-small
                            class="pl-1"
                            color="#007000"
                          >
                            fas fa-external-link-alt
                          </v-icon>   
                          </a> plan sets your monthly student loan payment at an amount that is intended to be affordable based on your income and family size.
                        </p>
                      </v-col>
                    </v-row>
                    <v-row v-if="aidLoanSelect === 'fed'">
                      <v-col cols="12" md="12" id="showGradOnly">
                        <h2 class="mb-3" v-if="showGradOnly">
                          Repayment Rate&nbsp;<tooltip
                            definition="repayment-rate"
                            :isBranch="isBranch"
                          />
                        </h2>
                        <h2 class="mb-3" v-else>
                          Repayment Rate&nbsp;<tooltip
                            definition="repayment-rate-completers"
                            :isBranch="isBranch"
                          />
                        </h2>
                        <span v-if="showGradOnly">
                          Percentage of borrowers in each category 2 years after
                          entering repayment. For category definitions, please
                          see
                          <a
                            v-bind:href="
                              $url('/data/glossary/#repayment-rate-completers')
                            "
                            >the glossary</a
                          >.
                        </span>
                        <span v-else>
                          Percentage of borrowers in each category 2 years after
                          entering repayment. For category definitions, please
                          see
                          <a v-bind:href="$url('/data/glossary/#repayment-rate')"
                            >the glossary</a
                          >.
                        </span>
                        <v-checkbox
                          v-model="showGradOnly"
                          label="Only show data for those who graduated"
                          color="secondary"
                          class="mt-0"
                        >
                          <template v-slot:label>
                            <span>
                              Only show data for those who graduated
                            </span>
                          </template>
                        </v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row v-if="aidLoanSelect === 'fed'" class="mb-2">
                      <v-col class="pt-0 pb-15">
                      <v-simple-table class="school-table">
                        <caption class="sr-only">
                          Repayment Rates
                        </caption>
                        <thead>
                          <tr>
                            <th>Repayment Status</th>
                            <th>Percent</th>
                          </tr>
                        </thead>
                        <tbody>

                          <tr v-for="(rate, index) in repaymentRates[gradSubgroup]" :key="index">
                            <td>{{ rate['label'] }}</td>
                            <td v-if="rate['value']">
                              {{ rate['value'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <!-- <tr>
                            <td>Not Making Progress</td>
                            <td v-if="repaymentRates[gradSubgroup]['noprogress']">
                              {{ repaymentRates[gradSubgroup]['noprogress'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>Deferment</td>
                            <td v-if="repaymentRates[gradSubgroup]['deferment']">
                              {{ repaymentRates[gradSubgroup]['deferment'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>Paid in Full</td>
                            <td v-if="repaymentRates[gradSubgroup]['fullypaid']">
                              {{ repaymentRates[gradSubgroup]['fullypaid'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>Forbearance</td>
                            <td v-if="repaymentRates[gradSubgroup]['forbearance']">
                              {{ repaymentRates[gradSubgroup]['forbearance'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>Defaulted</td>
                            <td v-if="repaymentRates[gradSubgroup]['default']">
                              {{ repaymentRates[gradSubgroup]['default']| numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>Delinquent</td>
                            <td v-if="repaymentRates[gradSubgroup]['delinquent']">
                              {{ repaymentRates[gradSubgroup]['delinquent'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>
                          <tr>
                            <td>Discharged</td>
                            <td v-if="repaymentRates[gradSubgroup]['discharge']">
                              {{ repaymentRates[gradSubgroup]['discharge'] | numeral("0%") }}
                            </td>
                            <td v-else>--</td>
                          </tr>    -->                                                                          
                        </tbody>
                      </v-simple-table>                        
                      </v-col>
                    </v-row>
                   <!-- <div
                      class="fos-profile-panel fos-profile-mini pl-4"
                      v-if="selectedFOSDetail && aidLoanSelect === 'fed'"
                    >
                      <span
                        class="field-of-study-select-icon mr-2"
                        style="width: 35px;height: 35px;float: left;"
                      >
                        <v-icon size="20">
                          fas fa-award
                        </v-icon>
                      </span>

                      <h3 class="fos-profile-mini">
                        {{ selectedFOSDetail.title | formatFieldOfStudyTitle }}
                        - {{ selectedFOSDetail.credential.title }}
                      </h3>

                      <v-row>
                        <v-col cols="12" md="4" sm="12"  class="d-flex">
                          <v-checkbox
                            hide-details
                            v-model="fosShowDebtAtPrior"
                            label="Include debt borrowed at any prior institutions"
                            color="secondary"
                          >
                            <template v-slot:label>
                              <span class="profile-fos-include-prior-debt">
                                Include debt borrowed at any prior
                                institutions&nbsp;
                              </span>
                            </template>
                          </v-checkbox>
                          <tooltip definition="include-debt-prior-inst" />
                        </v-col>

                        //Median Total
                        <v-col cols="12" md="4" sm="12">
                          <h4 class="mb-2">
                            Median Total Debt After Graduation&nbsp;
                            <tooltip
                              v-if="!fosShowDebtAtPrior"
                              definition="fos-median-debt"
                            />
                            <tooltip
                              v-else
                              definition="fos-median-debt-all-schools"
                            />
                          </h4>

                          <div v-if="!fosShowDebtAtPrior">
                            <div
                              v-if="
                                _.get(selectedFOSDetail, fields.FOS_DEBT_MEDIAN)
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MEDIAN
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center">
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_DEBT_MEDIAN_PRIOR
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MEDIAN_PRIOR
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center">
                              Data Not Available
                            </div>
                          </div>
                        </v-col>

                        //Monthly Loan
                        <v-col cols="12" md="4" sm="12">
                          <h4 class="mb-2">
                            Monthly Loan<br />
                            Payment&nbsp
                            <tooltip
                              v-if="!fosShowDebtAtPrior"
                              definition="fos-monthly-debt-payment"
                            />
                            <tooltip
                              v-else
                              definition="fos-monthly-debt-payment-all-schools"
                            />
                          </h4>

                          <div v-if="!fosShowDebtAtPrior">
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_DEBT_MONTHLY
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MONTHLY
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center">
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <div
                              v-if="
                                _.get(
                                  selectedFOSDetail,
                                  fields.FOS_DEBT_MONTHLY_PRIOR
                                )
                              "
                            >
                              <h5 class="fos-small-data-bold navy-text">
                                {{
                                  _.get(
                                    selectedFOSDetail,
                                    fields.FOS_DEBT_MONTHLY_PRIOR
                                  ) | numeral("$0,0")
                                }}
                              </h5>
                            </div>

                            <div v-else class="mini-data-na text-center">
                              Data Not Available
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div> -->

                    <v-row>
                      <v-col cols="12">
                        <v-card color="grey lighten-4 pa-4">
                          <h2 class="mb-3">Get Help Paying for College</h2>
                          <p>
                            Submit a
                            <em>Free Application for Federal Student Aid</em>
                            (FAFSA&reg;) form. You may be eligible to receive
                            federal grants or loans.
                          </p>
                          <p class="text-center">
                            <v-btn
                              rounded
                              color="secondary"
                              :href="$url('/school/transition/?url=' + encodeURIComponent('https://studentaid.gov/h/apply-for-aid/fafsa'))"
                              target="_blank"
                              @click="trackOutboundLink($event)"
                              >Start My FAFSA&reg; Form<v-icon
                                  x-small
                                  color="white"
                                  class="pl-1 pb-1 align-self-end"
                                  style=""
                                >
                                  fas fa-external-link-alt2
                                </v-icon>                                
                              </v-btn
                            >
                          </p>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Typical Earnings - Panel-->
              <v-expansion-panel class="institution-profile-panel">
                <v-expansion-panel-header
                  id="earnings"
                  aria-controls="earnings-content"
                  @click="
                    trackAccordion('Typical Earnings')
                  "
                >
                  Typical Earnings
                </v-expansion-panel-header>

                <v-expansion-panel-content
                  id="earnings-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <div>
                  <h2 class="pb-3">
                          Median Earnings&nbsp;<tooltip
                            definition="institution-median-earnings"
                            :isBranch="isBranch"
                          />
                        </h2>
                    <h2
                      class="display-2 navy-text font-weight-bold mb-3"
                      v-if="medianEarnings"
                    >
                      {{ medianEarnings | numeral("$0,0") }}
                    </h2>   
                    <p class="mb-0">
                      The median earnings of former students who received federal financial aid at 10 years after entering the school.
                    </p>
                    <median-toggle
                      :display-toggle="medianToggle"
                      :control-tab="controlTab"
                      @median-switch-click="handleMedianToggle"
                      @median-tab-change="handleMedianToggle"
                      :group-name="this.$options.filters.yearsText(groupName) + ' Schools'"
                      class="pt-12 pb-8"
                    />          
                       <v-row>
                      <v-col cols="2"></v-col>
                      <v-col cols="8">
                    <horizontal-bar-median
                      v-if="medianEarnings"
                      :value="{
                        label: this.$options.filters.numeral(medianEarnings,'$0,0'),
                        value: medianEarnings,
                      }"
                      :min="{
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      }"
                      :max="{
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      }"
                      :median="{
                        label: 'Midpoint: ' + this.$options.filters.numeral(this.medianToggle === 'group' ? Math.round(parseFloat(fakeMedianEarnings[groupName][0])) : Math.round(parseFloat(fakeMedianEarnings[groupName][1])) ,'$0,0'),
                        value: this.medianToggle === 'group' ? fakeMedianEarnings[groupName][0] : fakeMedianEarnings[groupName][1],
                        style: { height: '60px' },
                        show: true
                      }"
                      color="#00365e"
                      :height="500"
                      :y-bar-thickness="50"
                      :label-font-size="24"
                      :labels="true"
                    ></horizontal-bar-median> 
                      <div v-else class="data-na">Data Not Available</div>
                      </v-col>  
                       <v-col cols="2"></v-col>     
                      </v-row> 
                    <h2 class="mb-3 mt-10">
                          Percentage Earning More Than a High School Graduate&nbsp;<tooltip
                            definition="threshold-earnings"
                          />
                        </h2>
                    <div class="d-flex align-end mb-16" v-if="percentMoreThanHS"><h2
                      class="display-2 navy-text font-weight-bold"
                    >
                      {{ percentMoreThanHS |  numeral("0%") }}
                    </h2><span> &nbsp; of students</span></div>
                    <div v-else class="data-na mb-4">Data Not Available</div>
                    <h2 class="mb-3 mt-5">
                          Earnings After Completing Field of Study&nbsp;<tooltip
                            definition="fos-median-earnings"
                          />
                        </h2>

                    <p class="mt-2">
                      Salary information for Fields of Study available at this school are in the
                      <a :href="this.$url(fieldsLink)">All Fields of Study</a> page.
                    </p>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Student Body - Panel-->
              <v-expansion-panel class="institution-profile-panel">
                <v-expansion-panel-header
                  id="demographics"
                  aria-controls="demographics-content"
                  @click="trackAccordion('Student Body')"
                  >Student Body</v-expansion-panel-header
                >
                <v-expansion-panel-content
                  id="demographics-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <v-row>
                    <v-col cols="12" md="6" class="d-flex justify-space-around">
                      <school-icons
                        :school="school"
                        :fields="fields"
                        :sizeOnly="true"
                      />
                      <div class="text-center my-2 px-0 py-0 justify-space-around">
                        <div class="mb-2"><strong class="display-2 navy-text font-weight-bold pb-2">{{
                          undergraduates | separator
                        }}</strong></div>
                        <strong>Undergraduate Students</strong>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex justify-space-around">
                      <div class="text-center my-2 px-0 py-0 justify-space-around">
                        <div class="mb-2"><span class="display-2 navy-text font-weight-bold">{{
                          fullTimeEnrollment | numeral("0.%")
                        }}</span>
                        </div>
                        <strong>
                          Full-time&nbsp;
                          <tooltip definition="full-time" />
                        </strong>
                      </div>
                      <div class="text-center my-2 px-0 py-0 justify-space-around">
                       <!-- <span
                          class="display-2 navy-text font-weight-bold divide "
                          >/</span
                        > -->
                      </div>
                      <div class="text-center my-2 px-0 py-0 justify-space-around">
                        <div class="mb-2"><span class="display-2 navy-text font-weight-bold">{{
                          partTimeEnrollment | numeral("0.%")
                        }}</span>
                        </div>
                        <strong>Part-time</strong>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <h2 class="mb-3">
                        Socio-Economic Diversity
                        <tooltip definition="socio-eco" />
                      </h2>
                      <p class>
                        The percentage of students who received an income-based
                        federal Pell grant intended for low-income students.
                      </p>
                      <div v-if="aidFlag < 3 && socioEconomicDiversity">
                      <donut
                        color="#1874DC"
                        :value="socioEconomicDiversity * 100"
                        :height="200"
                        ></donut>
                          <div class="sr-only">
                            Socio-Economic Diversity: {{ Math.round(socioEconomicDiversity * 100)+"%" }}
                          </div>                          
                        </div>                        
                      <div v-else class="data-na">Data Not Available</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <h2 class="mb-3">
                        Race/Ethnicity
                        <tooltip definition="race-eth" />
                      </h2>
                      <div v-for="item in raceEthnicity" :key="item.label">
                        <horizontal-bar
                          :value="Math.round(item.value * 100)"
                          :min="0"
                          :max="100"
                          color="#1874DC"
                          :height="25"
                        ></horizontal-bar>
                        <strong>{{ item.value | numeral("0.%") }}</strong>
                        {{ item.label }}
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Test Scores and Acceptance - Panel-->
              <v-expansion-panel class="institution-profile-panel">
                <v-expansion-panel-header
                  id="selectivity"
                  aria-controls="selectivity-content"
                  @click="trackAccordion('Test Scores and Acceptance')"
                  >Test Scores &amp; Acceptance</v-expansion-panel-header
                >
                <v-expansion-panel-content
                  id="selectivity-content"
                  class="px-0 py-3 pa-sm-5"
                >
                  <v-row>
                    <v-col cols="12" md="7">
                      <h2>
                        Test Scores
                        <tooltip definition="test-scores" />
                      </h2>
                      <p>{{ standardizedTestText }}</p>
                    <div v-show="standardizedTestValue != 3 && standardizedTestValue != 4 && standardizedTestValue != 2 && standardizedTestValue != null">
                      <h3 class="h2 mb-2">SAT</h3>

                      <h4 class="overline">Critical Reading</h4>
                      <range
                        v-if="satReading.available"
                        :lower="{
                          value: satReading.lower,
                          label: satReading.lower,
                        }"
                        :upper="{
                          value: satReading.upper,
                          label: satReading.upper,
                        }"
                        :min="{
                          value: satReading.min,
                          label: satReading.min,
                        }"
                        :max="{
                          value: satReading.max,
                          label: satReading.max,
                        }"
                        hideMiddle
                      ></range>
                      <p v-else class="data-na">Data Not Available</p>

                      <h4 class="overline">Math</h4>
                      <range
                        v-if="satMath.available"
                        :lower="{
                          value: satMath.lower,
                          label: satMath.lower,
                        }"
                        :upper="{
                          value: satMath.upper,
                          label: satMath.upper,
                        }"
                        :min="{ value: satMath.min, label: satMath.min }"
                        :max="{ value: satMath.max, label: satMath.max }"
                        hideMiddle
                      ></range>
                      <p v-else class="data-na">Data Not Available</p>

                      <h3 class="h2 mt-4">ACT</h3>

                      <range
                        v-if="act.available"
                        :lower="{ value: act.lower, label: act.lower }"
                        :upper="{ value: act.upper, label: act.upper }"
                        :min="{ value: act.min, label: act.min }"
                        :max="{ value: act.max, label: act.max }"
                        hideMiddle
                      ></range>
                      <p v-else class="data-na">Data Not Available</p>
                    </div>
                    </v-col>
                    <v-col cols="12" md="5">
                      <h2 class="mb-3">
                        Acceptance Rate
                        <tooltip definition="acceptance-rate" />
                      </h2>
                      <div v-if="openAdmissions != 1 && acceptanceRate != null">
                      <donut
                        color="#1874DC"
                        :value="acceptanceRateActual * 100"
                        chart-id="acceptance-chart"
                        :height="200"
                        label="Acceptance Rate"
                      ></donut>
                          <div class="sr-only">
                            Acceptance Rate: {{ Math.round(acceptanceRateActual * 100)+"%" }}
                          </div>                          
                        </div>
                      <div v-else-if="openAdmissions == 1">
                      <donut
                        color="#1874DC"
                        :value="100"
                        chart-id="acceptance-chart"
                        :height="200"
                        label="Acceptance Rate"
                      ></donut>
                          <div class="sr-only">
                            Acceptance Rate: {{ Math.round(100)+"%" }}
                          </div>                          
                        </div>                            
                      <p v-else-if="!acceptanceRate" class="data-na">
                        Data Not Available
                      </p>
                      <!--<p v-else>This school has an open admissions policy.</p>-->
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>

        <v-col lg="3" v-if="!error" class="pt-0">
          <v-card outline v-bind:class="sidebarSearchClass" class="pa-4 mb-3">
            <p class="searchForTitle mb-2">SEARCH FOR:</p>
            <v-radio-group v-model="sidebarSearchToggle" column>
              <v-radio value="school" color="#007000"><template v-slot:label>
                    <div v-bind:style="{ 'font-weight': sidebarRadioSchoolStyle, 'color': 'black'}">School</div>
                  </template>
                </v-radio>

              <v-radio
                value="fos"
                color="#fdbf32"
              ><template v-slot:label>
                    <div v-bind:style="{ 'font-weight': sidebarRadioFOSStyle, 'color': 'black'}">Field of Study</div>
                  </template>
                </v-radio>
            </v-radio-group>

            <name-autocomplete
              v-if="sidebarSearchToggle === 'school'"
              id="school-name-auto-complete"
              @school-name-selected="handleSchoolNameSelected"
            />

            <field-of-study-search
              v-if="sidebarSearchToggle === 'fos'"
              id="school-fos-search"
              @field-of-study-selected="handleFieldOfStudySelected"
            />
            <div></div><!--Due to CSS styling where last element in card copies border radius of parent element-->
          </v-card>
          <v-card outline class="pa-5">
            <paying-for-college />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style lang="scss">
.leaflet-bottom {
  z-index: 100 !important;
}

.profile-fos-include-prior-debt {
  font-size: 12px;

  @media (min-width: 960px) {
    font-size: 16px;
  }
}
</style>

<style lang="scss" scoped>
@import "~/sass/_variables";

.compare-selected-text {
  background-color: $light-blue !important;
}

#profile-institution-title {
  line-height: 100% !important;
}

.school-map {
  border: 0px solid $black;
  border-radius: $base-border-radius;
  max-width: 420px;
  margin-top: $base-padding;
}

.field-of-study-select-container {
  border-radius: 4px !important;
  border-left: 20px solid $fos-color-gold !important;
}

.field-of-study-select-container-header {
  background-color: $lighter-yellow;
  border-radius: 5px 5px 0px 0px !important;
}

.institution-context-panel{
  border-radius: 4px !important;
  border-left: 20px solid $darker-green !important;
}

#field-of-study-select-header {
  h2 {
    margin-top: 7px;
    margin-left: 6px;
    font-size: 1.35rem;
    display: inline-block;
    vertical-align: top;
    text-transform: uppercase;
  }

  @media (min-width: 960px) {
    h2 {
      margin-top: 12px;
      margin-left: 10px;
    }
  }

  #field-of-study-select-icon {
    height: 34px;
    width: 34px;
    background: $fos-color-gold;
    border-radius: 50%;
    display: inline-block;
    color: black;
    text-align: center;

    i {
      font-size: 24px;
      margin-top: 5px;
    }

    @media (min-width: 960px) {
      width: 50px;
      height: 50px;

      i {
        font-size: 35px;
        margin-top: 8px;
      }
    }
  }
}

.fos-profile-panel {
  width: 100%;
  border-left: 10px solid $fos-color-gold;
  margin-bottom: 20px;

  @media (min-width: 960px) {
    font-size: 16px;
    border-left: 20px solid $fos-color-gold;
  }
}

.fos-profile-mini-summary-info {
  width: 100%;
  /*background-color: #eaeaea;*/
  border-left: 10px solid $fos-color-gold;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  -webkit-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  -moz-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  /*<!--box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);-->*/
  border-top: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.institution-profile-panel {
  width: 100%;
  border-left: 10px solid $institution-accent-color;

  @media (min-width: 960px) {
    font-size: 16px;
    border-left: 20px solid $institution-accent-color;
  }
}

.field-of-study-select-icon {
  width: 50px;
  height: 50px;
  background: $fos-color-gold;
  border-radius: 50%;
  color: black;
  text-align: center;
  display: inline-block !important;
  flex: none !important;
  z-index: 8; // Above highlight for active expansion panel
  i {
    font-size: 35px;
    margin-top: 8px;
  }
}

#fos-number-grads {
  h2,
  h3 {
    display: inline-block;
    vertical-align: middle;
  }
}

.fos-sub-title-header:not(.top-fos-sub-title-header) {
  background-color: #e5e5e5;

  h3 {
    font-weight: 500;
  }
}

.fos-small-data-bold {
  font-size: 1.5rem !important;
  font-weight: bold;
}

.fos-profile-mini {
  h3 {
    display: inline;
    vertical-align: middle;
  }
}

#school-completion-rate-bar {
  margin-bottom: 55px;
  padding-top: 0px !important;
}

#school-salary-after-complete {
  margin-bottom: 55px;
}

#profile-field-of-study-summary-metric-container {
  /*height: 320px;*/
  padding-top: 20px !important;
}

#profile-field-of-study-summary-metric-empty {
  /*height: 320px;*/
  height: auto;
}

#showGradOnly, #showPellOnlyGrad, #showPellOnlyOutcomes {
  .v-messages {
    display: none;
  }
}

span.arrow-left {
   $arrow-size: 7px;
  width: 0; 
  height: 0; 
  border-top: $arrow-size solid transparent;
  border-bottom: $arrow-size solid transparent;
  border-right: $arrow-size solid black;
  margin-top:0;
}
</style>

<script>
import Donut from "~/components/Donut.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import VerticalBarMedian from "~/components/VerticalBarMedian.vue"
import HorizontalBarMedian from "~/components/HorizontalBarMedian.vue"
import Tooltip from "~/components/Tooltip.vue"
import SankeyButtons from "~/components/SankeyButtons.vue"
import Sankey from "~/components/Sankey.vue"
import RepaymentRate from "~/components/RepaymentRate.vue"
import Range from "~/components/Range.vue"
import HorizontalBar from "~/components/HorizontalBar.vue"
import Share from "~/components/Share.vue"
import PayingForCollege from "~/components/PayingForCollege.vue"
import SchoolIcons from "~/components/SchoolIcons.vue"
import FieldData from "~/components/FieldData.vue"
import NetPriceLink from "~/components/NetPriceLink.vue"
import SearchForm from "~/components/SearchForm.vue"
import MultiRange from "~/components/MultiRange.vue"
import querystring from "querystring"
import FieldOfStudySelect from "~/components/FieldOfStudySelect.vue"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import FieldDataExtended from "~/components/FieldDataExtended.vue"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import URLHistory from "~/js/mixins/URLHistory.js"
import { apiGet } from "~/js/api.js"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import AddToCompare from "~/components/AddToCompare.vue"
import MedianToggle from "~/components/MedianToggle.vue"
import numeral from "numeral"

export default {
  mixins: [URLHistory, ComplexFields, AnalyticsEvents],
  components: {
    donut: Donut,
    "name-autocomplete": NameAutocomplete,
    "vertical-bar-median": VerticalBarMedian,
    "horizontal-bar-median": HorizontalBarMedian,
    tooltip: Tooltip,
    "sankey-buttons": SankeyButtons,
    sankey: Sankey,
    "repayment-rate": RepaymentRate,
    range: Range,
    "horizontal-bar": HorizontalBar,
    share: Share,
    "paying-for-college": PayingForCollege,
    "school-icons": SchoolIcons,
    "field-data": FieldData,
    "net-price-link": NetPriceLink,
    "search-form": SearchForm,
    "multi-range": MultiRange,
    "field-of-study-select": FieldOfStudySelect,
    "field-of-study-search": FieldOfStudySearch,
    "field-data-extended": FieldDataExtended,
    "add-to-compare": AddToCompare,
    "median-toggle": MedianToggle,
  },
  data() {
    return {
      school: {},
      panels: [],
      panelsFOS: [],
      num_panels: 7,
      field_sort: "ipeds_award_count",
      hoistCurrency: false,
      hoistGroupData: "numer of graduates",
      hoistGroupText: "largest",
      hoistCount: 0,
      error: false,
      currentSankey: {
        enroll: "enroll_both",
        study: "study_both",
      },
      currentRepayment: {
        enroll: "enroll_both",
        study: "study_both",
      },
      showGradOnly: false,
      showPellOnlyGrad: false,
      showPellOnlyOutcomes: false,
      selectedFOS: {
        text: "",
      },
      fosSalarySelect: "aid",
      fosSalarySelectItems: [
        { text: "Financial Aid Recipients", value: "aid" },
        { text: "Pell Grant Recipients", value: "pell" },
      ],
      fosShowDebtAtPrior: false,
      fosShowDebtAtPriorPanel: false,
      aidLoanSelect: "fed",
      aidLoanSelectItems: [
        { text: "Federal Student Loans", value: "fed" },
        { text: "Parent PLUS Loans", value: "plus" },
      ],
      aidShowMedianDebtWithPrior: false,
      aidShowMonthlyPaymentWithPrior: false,
      sidebarSearchToggle: "school",
      urlParams: null,
      fieldDataExtendedSalarySelect: "aid",
      fieldDataExtendedShowPrior: false,
      medianToggle: "group",
      controlTab: 0,
    }
  },
  computed: {
    referer() {
      return document.referrer || "/search/"
    },
    shareLink() {
      return encodeURI(window.location.href) || null
    },
    groupName() {
      return _.get(this.school, this.fields["PREDOMINANT_DEGREE"])
    },    
    fieldsOfStudy() {
      let self = this
      let fos = this.allFieldsOfStudy
      if (!fos) {
        return []
      } else if (fos.length) {
        for (let q = 0; q < fos.length; q++) {
          fos[q].ipeds_award_count = fos[q].counts.ipeds_awards2
          fos[q].highest_earnings =
            fos[q].earnings.highest["2_yr"].overall_median_earnings
          fos[q].lowest_debt = fos[q].debt.staff_grad_plus.all.eval_inst.median
          fos[q].hoist = fos[q][self.field_sort]
        }
        fos = fos.filter((field) => field.credential.level <= 3 && field.hoist)

        fos = _.sortBy(fos, [
          function(o) {
            return o[self.field_sort]
          },
        ])
        if (
          ["ipeds_award_count", "highest_earnings"].indexOf(self.field_sort) >=
          0
        ) {
          fos.reverse()
        }
        this.hoistCount = fos.length
        fos = fos.slice(0, 5)
      } else {
        fos = [fos]
      }
      return fos
    },
    currentHoist() {
      let sort = this.field_sort
      switch (sort) {
        case "ipeds_award_count":
          this.hoistCurrency = false
          this.hoistGroupText = "largest"
          this.hoistGroupData = "number of graduates"
          return "Graduates"
          break
        case "highest_earnings":
          this.hoistCurrency = true
          this.hoistGroupText = "highest earning"
          this.hoistGroupData = "earnings"
          return "Median Earnings"
          break
        case "lowest_debt":
          this.hoistCurrency = true
          this.hoistGroupText = "with the least amount of debt"
          this.hoistGroupData = "debt"
          return "Median Debt"
          break
      }
    },
    searchURL() {
      let qs = this.returnURLFromStorage()
      if (qs) {
        return this.$url("/search/" + qs)
      } else {
        return this.$url("/search/")
      }
    },
    fosUndergradCount() {
      if (!this.allFieldsOfStudy || this.allFieldsOfStudy.length === 0) {
        return 0
      }

      return this.allFieldsOfStudy.filter((fos) => {
        return fos.credential.level <= 3
      }).length
    },
    selectedFOSDetail() {
      // TODO - Deal with passing small amount of information, use find to get index;

      // Null if it is not set
      if (
        this.selectedFOS === "" ||
        this.selectedFOS === {} ||
        this.selectedFOS === null
      ) {
        return null
      }

      // Find full object
      let locatedFOS = this.locateFOSObject(
        this.allFieldsOfStudy,
        this.selectedFOS.code,
        this.selectedFOS.credential.level
      )

      return {
        title: this.selectedFOS.text,
        ...locatedFOS,
      }
      // return this.selectedFOS;
      // Find the index
      // let findIndex = _.findIndex(this.allFieldsOfStudy)
    },
    fieldOfStudySelectItems() {
      if (!this.school || !this.allFieldsOfStudy) return {}

      return this.organizeFieldsOfStudy(this.allFieldsOfStudy, this.CIP2)
    },
    gradSubgroup() {
      return this.showGradOnly ? 'ugcomp' : 'ug'
    },
    sidebarSearchClass(){
      if(this.sidebarSearchToggle === "fos"){
        return "field-of-study-select-container";
      }else{
        return "institution-context-panel";
      }
    },
    sidebarRadioSchoolStyle(){
      if(this.sidebarSearchToggle === "fos"){
        return "normal";
      }else{
        return "bold";
      }
    },
    sidebarRadioFOSStyle(){
      if(this.sidebarSearchToggle === "fos"){
        return "bold";
      }else{
        return "normal";
      }
    }
  },
  methods: {
    createMap(school) {
      var location = school.location

      if (!location || !Number(location.lat) || !Number(location.lon)) {
        container.classList.add("hidden")
        return false
      }

      var center = L.latLng(location.lat, location.lon)
      this.$nextTick(() => {
        var map = L.map(this.$refs["map"], {
          zoomControl: false,
          panControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          touchZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
        }).setView(center, 10)

        L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png") // jshint ignore:line
          .on("tileload", function(tileEvent) {
            tileEvent.tile.setAttribute("alt", "Map tile image")
          })
          .addTo(map)

        L.control
          .attribution({
            position: "bottomleft",
            prefix: false,
          })
          .addAttribution(
            '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use" target="_blank">Wikimedia</a>'
          )
          .addTo(map)

        var marker = L.circle(center, 1000, {
          color: "#183658",
          opacity: 1,
          strokeWidth: 1,
          fillColor: "white",
          fillOpacity: 1,
        }).addTo(map)

        marker.bindPopup(school.school.name)
        return map
      })
    },
    generateMapURL(school) {
      let googleMapsBaseURL = "https://maps.googleapis.com/maps/api/staticmap?"
      let params = {}
      params.center = school.location.lat + "," + school.location.lon
      params.zoom = 12
      params.size = "420x380"
      ;(params.key = process.env.GRIDSOME_GOOGLE_MAPS_KEY),
        (params.markers = params.center)
      params.style = "feature:poi|element:labels|visibility:off"
      let qs = querystring.stringify(params)
      return googleMapsBaseURL + qs
    },
    // expand all panels
    all() {
      this.panels = [...Array(this.num_panels).keys()].map((k, i) => i)
      this.panelsFOS = [0]
    },
    // Reset the panel
    none() {
      this.panels = []
      this.panelsFOS = []
    },
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        this.$router.push("/search/?name=" + encodeURIComponent(school))
      } else {
        this.$router.push("/search/?name=" +
          encodeURIComponent(school["school.name"]) +
          "&id=" +
          school.id)
      }
    },
    parseURLParams(url = location.search.substr(1)) {
      let query = querystring.parse(url)

      return query || {}
    },
    // TODO - Move? Make it more testible?
    organizeFieldsOfStudy(availableFieldsOfStudy4, allCip2, filter = null) {
      let processedPrograms = {}
      // let self = this;

      availableFieldsOfStudy4.forEach((program, idx) => {
        if (program.credential.level === 3) {
          program.credential.title = "Bachelor's Degree"
        }

        let twodigit = program.code.substr(0, 2)
        if (
          _.includes([1, 2, 3], program.credential.level) &&
          !processedPrograms[allCip2[twodigit]]
        ) {
          processedPrograms[allCip2[twodigit]] = []
        }

        if (_.includes([1, 2, 3], program.credential.level)) {
          processedPrograms[allCip2[twodigit]].push(this.formatFOS(program))
        }
      })

      let sorted = []
      for (var cip2 in processedPrograms) {
        sorted.push({
          name: this.$options.filters.formatCip2Title(cip2),
          fields: _.sortBy(processedPrograms[cip2], ["title"]),
        })
      }

      return _.sortBy(sorted, ["name"])
    },
    formatFOS(fosObject) {
      return {
        text: `${this.$options.filters.formatFieldOfStudyTitle(
          fosObject.title
        )} - ${fosObject.credential.title}`,
        value: `${fosObject.code}.${fosObject.credential.level}`,
        code: fosObject.code,
        credential: {
          level: fosObject.credential.level,
        },
      }
    },
    locateFOSObject(elements, code, credentialLevel) {
      return _.find(elements, (fos) => {
        return fos.code === code && fos.credential.level === credentialLevel
      })
    },
    mapFOSFromURL(params, elements) {
      // Exist and matches pattern
      if (
        typeof params.fos_code === "undefined" &&
        /^\d{3,4}$/.test(params.fos_code) === false
      ) {
        return null
      }

      if (
        typeof params.fos_credential === "undefined" &&
        /^\d{1}$/.test(params.fos_credential) === false
      ) {
        return null
      }

      // TODO - Replace with method
      // TODO - make sure values are the correct type when checking
      let locatedFOS = _.find(this.allFieldsOfStudy, (fos) => {
        return (
          fos.code == params.fos_code &&
          fos.credential.level == params.fos_credential
        )
      })

      if (typeof locatedFOS === "undefined") {
        return null
      } else {
        return this.formatFOS(locatedFOS)
      }
    },
    generateQueryString(params) {
      let qs = querystring.stringify(params)
      return (
        "?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")
      )
    },
    generateCompareFieldOfStudy(fosObject) {
      return {
        id: fosObject.unit_id,
        code: fosObject.code,
        credentialLevel: fosObject.credential.level,
        credentialTitle: fosObject.credential.title,
        institutionName: fosObject.school.name,
        fosTitle: fosObject.title,
      }
    },
    handleExtendedFieldSelect(event) {
      //console.log(event)
    },
    handleFieldOfStudyClear() {
      // console.log("Clear");
      this.$nextTick(() => {
        this.selectedFOS = null
      })
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      this.$router.push("/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4))
    },
    checkTipUpperStyle(upperValue, maxValue, upperStyleTipOverride) {
      // Fixing padding issue on max value
      let additionalPaddingStyles = upperStyleTipOverride

      // Checking for max
      if (Number(upperValue) >= maxValue * 0.85) {
        additionalPaddingStyles.left = "-3.1rem"
      }

      return additionalPaddingStyles
    },
    checkUpperStyle(value, maxValue, upperStyleOverride) {
      let additionalPaddingStyles = upperStyleOverride

      if (Number(value) >= maxValue * 0.97) {
        additionalPaddingStyles.left = "97%"
      }

      return additionalPaddingStyles
    },
    handleMedianToggle(toggleValue) {
      this.controlTab = toggleValue
      this.medianToggle = toggleValue === 0 ? "group" : "all"
    },
  },
  mounted() {
    
    let self = this
    
    if (!location.search) {
      return null
    }
    var match = location.search.match(/^\?(\d+)(\b|-)/)
    var id = match ? match[1] : null

    var params = {}
    params[this.fields.OPERATING] = 1
    params[
      this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
    ] = true
    params[this.fields.SIZE + "__range"] = "1.."
    params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
    params[this.fields.ID + "__range"] = "..999999"
    params["fields"] = "latest,school,id,location"
    params["keys_nested"] = true

    // Note, Must add key as a param.
    let request = apiGet("/schools/", {
      id: id,
    })
      .then((response) => {
        if (response.data.metadata.total > 1) {
          this.error = true
          console.warn('More than one school found for ID: "' + id + '"')
          return null
        } else if (response.data.results[0].latest.student.size <= 0) {
          this.error = true
          console.warn('School has size <= 0 for ID: "' + id + '"')
          return null
        }
        this.school = response.data.results[0]
        document.title =
          _.get(this.school, "school.name") + " | College Scorecard"
        // this.createMap(this.school);

        this.urlParams = this.parseURLParams(location.search.substr(1))
        this.selectedFOS = this.mapFOSFromURL(
          this.urlParams,
          this.fieldOfStudySelectItems
        )
        if (this.selectedFOS) {
          this.panelsFOS = [0]
        }
      })
      .catch((response) => {
        this.error = true
        console.warn("No School found for ID: " + id)
      })
  },
  watch: {  
    selectedFOS(val, oldVal) {
      // Update the URL when this value changes;
      if (val !== oldVal) {
        // To capture the first argument
        let params = _.cloneDeep(this.urlParams)

        if (
          val !== null &&
          typeof val.code != "undefined" &&
          typeof val.credential.level != "undefined"
        ) {
          // Set additional params
          params.fos_code = val.code
          params.fos_credential = val.credential.level
        } else {
          // Remove params if currently set
          delete params.fos_code
          delete params.fos_credential
        }

        // Generate string but remove first equals character due to current query structure '?schoolid-school-name' with no value;
        let qs = this.generateQueryString(params).replace("=", "")
        history.replaceState(params, "School Profile", qs)
      }
    },
  },
 metaInfo: {
    //title: this.schoolName + " | College Scorecard",
    meta: [
      {
        key: 'og:title',
        name: 'og:title',
        content: "College Scorecard"
      },     
      {
        key: 'twitter:title',
        name: 'twitter:title',
        content: "College Scorecard"
      },       
    ]

  }
}
</script>
