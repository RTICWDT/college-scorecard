<template>
  <v-app id="app" class="school-page">
    <div class="backNav">
      <div class="container school-back">
        <v-btn
          small
          color="secondary"
          rounded
          id="referrer-link"
          class="link-more"
          :href="searchURL"
        >&laquo; Back to search</v-btn>
      </div>
    </div>
    <!-- Search results -->
    <div class="school-bg">
      <v-container>
        <v-row>
          <v-col cols="12" md="9" class="school-left">
            <div v-if="!school.id && !error" class="show-loading">
              <v-card class="pa-5">
                <h1 class="heading">
                  Loading
                  <v-icon color="#0e365b">fas fa-circle-notch fa-spin</v-icon>
                </h1>
              </v-card>
            </div>
            <div v-else-if="error">
              <v-card class="pa-5">
                <h2>Something went wrong</h2>
                <p>Try searching for a school by name:</p>
                <name-autocomplete />
              </v-card>
            </div>

            <div v-else id="school">
              <v-card class="school-heading pa-5 pt-2 mb-5">
                <v-row class="mt-4">
                  <v-col cols="12" md="8" class="py-0">
                    <h1 class="display-2 pa-0 mb-4">
                      {{ schoolName }}
                      <v-chip
                        v-if="underInvestigation==1"
                        color="error"
                        label
                      >
                        <strong>Under ED Monitoring</strong>
                        <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
                      </v-chip>
                    </h1>
                    <v-divider />

                    <h2 class="title location mb-0 mt-4">
                      <span>{{ city }}</span>,
                      <span>{{ state }}</span>
                    </h2>
                    <h2 class="title population my-0">
                      <span>{{ undergraduates | separator }}</span> undergraduate students
                    </h2>
                    <h2 class="title school-url mt-0">
                      <a
                        target="_blank"
                        :href="'/school/transition/?url='+schoolUrl"
                      >{{ schoolUrlDisplay | formatUrlText }}</a>
                    </h2>
                    <school-icons :school="school" :fields="fields" class="my-5" />
                    <div class="school-special_designation" v-if="specialDesignations.length>0">
                      <v-chip
                        class="special mr-1 mb-1"
                        color="blue lighten-3"
                        label
                        v-for="designation in specialDesignations"
                        :key="designation"
                      >{{designation}}</v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="py-0 text-right">
                    <v-btn
                      text
                      icon
                      :color="isSelected?'amber':'grey'"
                      @click="$emit('toggle-compare-school', { schoolId: id, schoolName: schoolName } )"
                    >
                      <v-icon>fa fa-plus-circle</v-icon>
                    </v-btn>
                    <share label="Share this School" :url="shareLink" />
                    <div class="school-map" ref="map"></div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col col="12" md="6">
                    <h2 class="mb-4">
                      Graduation Rate&nbsp;
                      <tooltip definition="graduation-rate" />
                    </h2>
                    <donut
                      v-if="completionRate"
                      color="#0e365b"
                      :value="completionRate * 100"
                      :height="200"
                    ></donut>
                    <div v-else class="data-na">Data Not Available</div>
                  </v-col>
                  <v-col col="12" md="6">
                    <h2 class="mb-3">
                      Salary After Completing&nbsp;
                      <tooltip definition="avg-salary" />
                    </h2>
                    <p>Salary after completing depends on field of study.</p>
                    <multi-range
                      :minmax="earningsRange"
                      variable="earnings.median_earnings"
                      :max=" { label: '$150,000', value: 150000 }"
                      />
                    <h2 class="mb-3" v-if="!isProgramReporter">
                      Average Annual Cost&nbsp;
                      <tooltip definition="avg-cost-year" />
                    </h2>
                    <h2 v-else>
                      Average Annual Cost for Largest Program&nbsp;
                      <tooltip definition="coming-soon" />
                    </h2>
                    <h2
                      class="display-2 navy-text font-weight-bold"
                      v-if="netPrice"
                    >{{ netPrice | numeral('$0,0') }}</h2>
                    <div class="data-na" v-else>Data Not Available</div>
                  </v-col>
                </v-row>
              </v-card>

              <v-row>
                <v-col class="text-right">
                  <v-btn primary @click="all">Expand All</v-btn>
                  <v-btn primary @click="none">Close All</v-btn>
                </v-col>
              </v-row>
              <v-expansion-panels multiple focusable v-model="panels">
                <v-expansion-panel>
                  <v-expansion-panel-header id="cost" aria-controls="costs-content">Costs</v-expansion-panel-header>
                  <v-expansion-panel-content id="costs-content" class="px-0 py-3 pa-sm-5">
                    <v-row>
                      <v-col cols="12" md="6">
                        <div v-if="!isProgramReporter">
                          <h2 class="mb-3">
                            Average Annual Cost&nbsp;
                            <tooltip definition="avg-cost-year" />
                          </h2>
                          <h2
                            class="display-2 navy-text font-weight-bold"
                          >{{ netPrice | numeral('$0,0')}}</h2>
                        </div>
                        <div v-else>
                          <h2>
                            Cost After Aid for Largest Program
                            <tooltip definition="avg-program-cost" />
                          </h2>
                          <h2 class="title my-3">
                            <span class="font-weight-bold navy-text">{{ programReporter[0].title}}</span>
                          </h2>
                          <h2 class="title my-3" v-if="netPrice">
                            <span
                              class="navy-text font-weight-bold"
                            >{{ netPrice | numeral('$0,0')}}</span>
                            <span
                              v-if="programReporter[0].annualized== programReporter[0].full_program"
                            >for a {{programReporter[0].avg_month_completion}}-month program</span>
                            <span class="costDescription" v-else>per year on average</span>
                          </h2>
                          <div v-else class="data-na">Data Not Available</div>
                        </div>
                        <h2 class="mb-3 mt-5">Personal Net Price</h2>
                        <p>Institutions provide a custom net price calculator.</p>
                        <net-price-link :url="netPriceCalculatorUrl" />
                      </v-col>

                      <v-col cols="12" md="6">
                        <h2>By Family Income</h2>
                        <p>
                          Depending on the federal, state, or institutional grant aid available, students in your income
                          bracket may pay more or less than the overall average costs.
                        </p>

                        <v-simple-table class="school-table">
                          <caption class="sr-only">Average cost by family income</caption>
                          <thead>
                            <tr>
                              <th>Family Income</th>
                              <th>Average Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>$0-$30,000</td>
                              <td
                                data-bind="net_price_income1"
                                v-if="income['0-30000']"
                              >{{ income['0-30000'] | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                            </tr>
                            <tr>
                              <td>$30,001-$48,000</td>
                              <td
                                data-bind="net_price_income2"
                                v-if="income['30001-48000']"
                              >{{ income['30001-48000'] | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                            </tr>
                            <tr>
                              <td>$48,001-$75,000</td>
                              <td
                                data-bind="net_price_income3"
                                v-if="income['48001-75000']"
                              >{{ income['48001-75000'] | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                            </tr>
                            <tr>
                              <td>$75,001-$110,000</td>
                              <td
                                data-bind="net_price_income4"
                                v-if="income['75001-110000']"
                              >{{ income['75001-110000'] | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                            </tr>
                            <tr>
                              <td>$110,001+</td>
                              <td
                                data-bind="net_price_income5"
                                v-if="income['110001-plus']"
                              >{{ income['110001-plus'] | numeral('$0,0') }}</td>
                              <td v-else>--</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="graduation"
                    aria-controls="graduation-content"
                  >Graduation &amp; Retention</v-expansion-panel-header>
                  <v-expansion-panel-content id="graduation-content" class="px-0 py-3 pa-sm-5">
                    <v-row>
                      <v-col cols="12" md="6">
                        <h2 class="mb-3 text-center">
                          Graduation
                          <br />Rate&nbsp;
                          <tooltip definition="graduation-rate" />
                        </h2>
                        <donut
                          v-if="completionRate"
                          color="#0e365b"
                          :value="completionRate * 100"
                          :height="200"
                        ></donut>
                        <div v-else class="data-na">Data Not Available</div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <h2 class="mb-3 text-center">
                          Students Who Return After Their First Year&nbsp;
                          <tooltip definition="retention-rate" />
                        </h2>
                        <donut
                          v-if="retentionRate"
                          color="#0e365b"
                          :value="retentionRate * 100"
                          :height="200"
                        ></donut>
                        <div v-else class="data-na">Data Not Available</div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <h2 class="mb-3 mt-5">
                          Outcomes 8 Years After Attending&nbsp;
                          <tooltip definition="outcome-measures" />
                        </h2>
                        <sankey-buttons v-on:update-sankey="currentSankey = $event" />
                        <sankey :school="school" colors="solid" :currentSankey="currentSankey" />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="aid"
                    aria-controls="aid-content"
                  >Financial Aid &amp; Debt</v-expansion-panel-header>
                  <v-expansion-panel-content id="aid-content" class="px-0 py-3 pa-sm-5">
                    <v-alert
                      v-if="(aidFlag > 3) && (aidFlag < 8)"
                      type="info"
                    >This institution does not participate in the Federal student financial aid program administered by the U.S. Department of Education.</v-alert>
                    <v-alert
                      v-else-if="aidFlag==3"
                      type="info"
                    >This institution does not participate in the Federal student financial aid programs administered by the U.S. Department of Education, but is approved by the Department for purposes of allowing students to receive deferments on repayment of Federal student loans received at other institutions.</v-alert>
                    <v-alert
                      v-else-if="aidFlag==8"
                      type="info"
                    >Data is not yet available. This institution only recently began administering Federal aid.</v-alert>
                    <div v-else>
                      <v-row>
                        <v-col cols="12" md="6">
                          <h2 class="mb-3">
                            Students Receiving Federal Loans
                            <tooltip definition="student-aid" />
                          </h2>
                          <donut
                            color="#0e365b"
                            :value="studentsReceivingLoans * 100"
                            :height="200"
                            v-if="studentsReceivingLoans"
                          ></donut>
                          <div v-else class="data-na">Data Not Available</div>
                          <p>At some schools where few students borrow federal loans, the typical undergraduate may leave school with $0 in debt.</p>
                        </v-col>
                        <v-col cols="12" md="6">
                          <h2 class="mb-3">
                            Typical Total Debt After Graduation
                            <tooltip definition="avg-debt" />
                          </h2>
                          <p>Total debt after graudation depends on field of study for undergraduate borrowers who complete college.</p>
                          <multi-range
                            :minmax="debtRange"
                            variable="debt.median_debt"
                            :max=" { label: '$100,000', value: 100000 }"
                            />

                          <h2 class="mb-3">
                            Typical Monthly Loan Payment&nbsp;
                            <tooltip definition="avg-loan-payment" />
                          </h2>
                          <div v-if="debtRange.singleDebt">
                            <div
                              class="display-2 navy-text font-weight-bold"
                              v-if="debtRange.min"
                            >{{ debtRange.min.debt.monthly_debt_payment | numeral('$0,0') }}/mo</div>
                          </div>
                          <div v-else-if="debtRange.min">
                            <div
                              class="display-2 navy-text font-weight-bold"
                              v-if="debtRange.min"
                            >{{ debtRange.min.debt.monthly_debt_payment | numeral('$0,0') }}-{{ debtRange.max.debt.monthly_debt_payment | numeral('0,0') }}/mo</div>
                          </div>
                          <div v-else class="data-na">Data not available.</div>
                          <p class="mt-2">
                            This is based on a standard 10-year payment plan, other
                            <a
                              href="https://studentloans.gov/myDirectLoan/repaymentEstimator.action"
                              target="_blank"
                            >payment options</a> are available.
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-card color="grey lighten-4 pa-4">
                            <h2 class="mb-3">Get Help Paying for College</h2>
                            <p>
                              Submit a Free Application for Federal Student Aid (FAFSA). You may be eligible to receive federal
                              grants or loans.
                            </p>
                            <v-btn
                              rounded
                              color="secondary"
                              href="https://fafsa.ed.gov/spa/fafsa"
                              target="_blank"
                            >Start My FAFSA</v-btn>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="earnings"
                    aria-controls="earnings-content"
                  >Salary After Completing by Field of Study</v-expansion-panel-header>
                  <v-expansion-panel-content
                    id="earnings-content"
                    aria-controls="earnings-content"
                    class="px-0 py-3 pa-sm-5"
                  >
                    <p>One-year post-completion earnings with range of highest and lowest median earnings for undergraduate and credential programs for which there is data. For more information, see Fields of Study/Majors for this school.</p>
                    <multi-range
                      :minmax="earningsRange"
                      variable="earnings.median_earnings"
                      :max="{ label: '$150,000', value: 150000 }"
                      />
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="academics"
                    aria-controls="academics-content"
                  >Fields of Study / Majors</v-expansion-panel-header>
                  <v-expansion-panel-content id="academics-content" class="px-0 py-3 pa-sm-5">
                    <!-- <div if=''> -->
                    <h2 class="mb-3">Top Fields of Study</h2>
                    <p class="my-0">
                      <span class="d-block d-sm-inline">Sort by:</span>
                      <v-btn
                        class="ma-1"
                        :color="field_sort == 'ipeds_award_count'? 'secondary':null"
                        small
                        @click="field_sort = 'ipeds_award_count'"
                      >Largest Size</v-btn>
                      <v-btn
                        class="ma-1"
                        :color="field_sort == 'highest_earnings'? 'secondary':null"
                        small
                        @click="field_sort = 'highest_earnings'"
                      >Highest Earnings</v-btn>
                      <v-btn
                        class="ma-1"
                        :color="field_sort == 'lowest_debt'? 'secondary':null"
                        small
                        @click="field_sort = 'lowest_debt'"
                      >Lowest Debt</v-btn>
                    </p>
                    <v-row class="mx-5 mt-5 d-none d-sm-flex" v-if="fieldsOfStudy.length">
                      <v-col
                        cols="12"
                        sm="8"
                        class="ma-0 px-2 py-0 font-weight-bold"
                      >Field of Study - Degree</v-col>
                      <v-col cols="12" sm="4" class="ma-0 pa-0 font-weight-bold">{{currentHoist}}</v-col>
                    </v-row>
                    <v-row class="mx-0 mt-5 d-block d-sm-none" v-if="fieldsOfStudy.length">
                      <v-col
                        cols="12"
                        class="ma-0 px-2 py-2 font-weight-bold"
                      >Field of Study - Degree ({{currentHoist}})</v-col>
                    </v-row>
                    <v-expansion-panels class="my-3" v-if="fieldsOfStudy.length">
                      <v-expansion-panel
                        v-for="fos in fieldsOfStudy"
                        :key="fos.code+'-'+fos.credential.level"
                      >
                        <v-expansion-panel-header class="py-0 pl-2 pl-sm-4">
                          <v-row no-gutters class="my-0 d-none d-sm-flex" align="center">
                            <v-col
                              cols="12"
                              sm="8"
                              class="pa-2"
                            >{{ fos.title.slice(0,-1) }} - {{ fos.credential.title }}</v-col>
                            <v-col
                              v-if="hoistCurrency"
                              cols="12"
                              class="navy-text px-5 font-weight-bold"
                              sm="4"
                            >{{ fos.hoist | numeral('$0,0') }}</v-col>
                            <v-col
                              v-else
                              cols="12"
                              class="navy-text px-5 font-weight-bold"
                              sm="4"
                            >{{ fos.hoist | separator }}</v-col>
                          </v-row>
                          <div class="d-block d-sm-none my-2 mx-1 pl-0">
                            {{ fos.title.slice(0,-1) }} - {{ fos.credential.title }}
                            <span
                              v-if="hoistCurrency"
                              class="navy-text font-weight-bold"
                            >({{ fos.hoist | numeral('$0,0') }})</span>
                            <span
                              v-else
                              class="navy-text font-weight-bold"
                            >({{ fos.hoist | separator }})</span>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <field-data :fos="fos" />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <div v-else>
                      <v-alert
                        type="info"
                      >There are no fields of study with data available for {{currentHoist}}.</v-alert>
                    </div>
                    <v-btn rounded color="secondary" :href="fieldsLink">
                      <span class="d-none d-sm-flex">See All Available Fields of Study/Majors</span>
                      <span class="d-block d-sm-none">See All</span>
                    </v-btn>
                    <!--</div>
                     <div v-else>
                      <v-alert type="info">Fields of Study/Majors are not available for this institution. </v-alert>
                    </div>-->
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="demographics"
                    aria-controls="demographics-content"
                    v
                  >Student Body</v-expansion-panel-header>
                  <v-expansion-panel-content id="demographics-content" class="px-0 py-3 pa-sm-5">
                    <v-row>
                      <v-col cols="12" md="6" class="d-flex justify-space-around">
                        <school-icons :school="school" :fields="fields" :sizeOnly="true" />
                        <div class="text-center">
                          <strong
                            class="display-2 navy-text font-weight-bold"
                          >{{ undergraduates | separator }}</strong>
                          <br />
                          <strong>undergraduate students</strong>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6" class="d-flex justify-space-around">
                        <div class="text-right">
                          <span
                            class="display-2 navy-text font-weight-bold"
                          >{{ fullTimeEnrollment | numeral('0.%') }}</span>
                          <br />
                          <strong>Full-time</strong>
                        </div>
                        <div>
                          <span class="display-2 navy-text font-weight-bold divide">/</span>
                        </div>
                        <div class="text-left">
                          <span
                            class="display-2 navy-text font-weight-bold"
                          >{{ partTimeEnrollment | numeral('0.%') }}</span>
                          <br />
                          <strong>Part-time</strong>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6" v-if="aidFlag<3">
                        <h2 class="mb-3">Socio-Economic Diversity</h2>
                        <p
                          class
                        >The percentage of students who received an income-based federal Pell grant intended for low-income students.</p>
                        <donut
                          color="#0e365b"
                          :value="socioEconomicDiversity * 100"
                          :height="200"
                          v-if="socioEconomicDiversity"
                        >></donut>
                        <div v-else class="data-na">Data Not Available</div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <h2 class="mb-3">
                          Race/Ethnicity&nbsp;
                          <tooltip definition="race-eth" />
                        </h2>
                        <div v-for="item in raceEthnicity" :key="item.label">
                          <horizontal-bar
                            :value="Math.round(item.value*100)"
                            :min="0"
                            :max="100"
                            color="#0e365b"
                            :height="25"
                          ></horizontal-bar>
                          <strong>{{item.value | numeral('0.%')}}</strong>
                          {{item.label}}
                        </div>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="selectivity"
                    aria-controls="selectivity-content"
                  >Test Scores &amp; Admittance</v-expansion-panel-header>
                  <v-expansion-panel-content id="selectivity-content" class="px-0 py-3 pa-sm-5">
                    <v-row>
                      <v-col cols="12" md="7">
                        <h2>
                          Test Scores
                          <tooltip definition="test-scores" />
                        </h2>
                        <p>Students who were admitted and enrolled typically had standardized test scores in these ranges.</p>

                        <h3 class="h2 mb-2">SAT</h3>

                        <h4 class="overline">Critical Reading</h4>
                        <range
                          v-if="satReading.available != null"
                          :lower="{ value: satReading.lower, label: satReading.lower }"
                          :upper="{ value: satReading.upper, label: satReading.upper}"
                          :min="{ value: satReading.min, label: satReading.min }"
                          :max="{ value: satReading.max, label: satReading.max }"
                          hideMiddle
                        ></range>
                        <p v-else class="data-na">Data Not Available</p>

                        <h4 class="overline">Math</h4>
                        <range
                          v-if="satMath.available != null"
                          :lower="{ value: satMath.lower, label: satMath.lower }"
                          :upper="{ value: satMath.upper, label: satMath.upper}"                       
                          :min="{ value: satMath.min, label: satMath.min }"
                          :max="{ value: satMath.max, label: satMath.max }"
                          hideMiddle
                        ></range>
                        <p v-else class="data-na">Data Not Available</p>

                        <h3 class="h2 mt-4">ACT</h3>

                        <range
                          v-if="act.available != null"
                          :lower="{ value: act.lower, label: act.lower }"
                          :upper="{ value: act.upper, label: act.upper}"                        
                          :min="{ value: act.min, label: act.min }"
                          :max="{ value: act.max, label: act.max }"
                          hideMiddle
                        ></range>
                        <p v-else class="data-na">Data Not Available</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <h2 class="mb-3">Admittance Rate</h2>
                        <donut
                          color="#0e365b"
                          :value="admittanceRate*100"
                          v-if="openAdmissions!=1"
                          chart-id="admittance-chart"
                          :height="200"
                          :width="300"
                        ></donut>
                        <p v-else>This school has an open admissions policy.</p>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="3" v-if="!error">
            <v-card outline class="pa-5 mb-3">
              <p class="title mb-2">Find Another School</p>
              <name-autocomplete />
            </v-card>
            <v-card outline class="pa-5">
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
<style lang="scss">
.leaflet-bottom {
  z-index: 100 !important;
}
</style>

<style lang="scss" scoped>
@import "sass/_variables";

.school-map {
  border: 1px solid $black;
  border-radius: $base-border-radius;
  height: 280px;
  margin-top: $base-padding;
  width: 100%;
}
</style>

<script>
import Donut from "components/vue/Donut.vue";
import NameAutocomplete from "components/vue/NameAutocomplete.vue";
import BarChart from "components/vue/Bar.vue";
import Tooltip from "components/vue/Tooltip.vue";
import SankeyButtons from "components/vue/SankeyButtons.vue";
import Sankey from "components/vue/Sankey.vue";
import Range from "components/vue/Range.vue";
import HorizontalBar from "components/vue/HorizontalBar.vue";
import Share from "components/vue/Share.vue";
import PayingForCollege from "components/vue/PayingForCollege.vue";
import SchoolIcons from "components/vue/SchoolIcons.vue";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import FieldData from "components/vue/FieldData.vue";
import NetPriceLink from "components/vue/NetPriceLink.vue";
import SearchForm from "components/vue/SearchForm.vue";
import MultiRange from "components/vue/MultiRange.vue";

import { compare } from "vue/mixins.js";
import ComplexFields from "vue/mixins/ComplexFields.js";
import URLHistory from "vue/mixins/URLHistory.js";
import { apiGet } from '../api.js';

export default {
  mixins: [compare, URLHistory, ComplexFields],
  props: ["baseUrl", "compareSchools"],
  components: {
    donut: Donut,
    "name-autocomplete": NameAutocomplete,
    "bar-chart": BarChart,
    tooltip: Tooltip,
    "sankey-buttons": SankeyButtons,
    sankey: Sankey,
    range: Range,
    "horizontal-bar": HorizontalBar,
    share: Share,
    "paying-for-college": PayingForCollege,
    "school-icons": SchoolIcons,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
    "field-data": FieldData,
    "net-price-link": NetPriceLink,
    "search-form": SearchForm,
    "multi-range": MultiRange
  },
  data() {
    return {
      school: {},
      panels: [],
      num_panels: 7,
      field_sort: "ipeds_award_count",
      hoistCurrency: false,
      error: false,
      currentSankey: {
          enroll: "enroll_both",
          study: "study_both"
      }
    };
  },
  computed: {
    referer() {
      return document.referrer || "/search/";
    },
    shareLink() {
      return window.location.href || null;
    },
    fieldsOfStudy() {
      let self = this;
      let fos = this.allFieldsOfStudy;
      if (!fos) {
        return [];
      } else if (fos.length) {
        for (let q = 0; q < fos.length; q++) {
          fos[q].ipeds_award_count = fos[q].counts.ipeds_awards2;
          fos[q].highest_earnings = fos[q].earnings.median_earnings;
          fos[q].lowest_debt = fos[q].debt.median_debt;
          fos[q].hoist = fos[q][self.field_sort];
        }
        fos = fos.filter(field => field.credential.level <= 3 && field.hoist);

        fos = _.sortBy(fos, [
          function(o) {
            return o[self.field_sort];
          }
        ]);
        if (
          ["ipeds_award_count", "highest_earnings"].indexOf(self.field_sort) >=
          0
        ) {
          fos.reverse();
        }
        fos = fos.slice(0, 10);
      } else {
        fos = [fos];
      }
      return fos;
    },
    currentHoist() {
      let sort = this.field_sort;
      switch (sort) {
        case "ipeds_award_count":
          this.hoistCurrency = false;
          return "Graduates";
          break;
        case "highest_earnings":
          this.hoistCurrency = true;
          return "Median Earnings";
          break;
        case "lowest_debt":
          this.hoistCurrency = true;
          return "Median Debt";
          break;
      }
    },
    searchURL() {
      let qs = this.returnURLFromStorage();
      if (qs) {
        return "/search" + qs;
      } else {
        return "/search";
      }
    }
  },
  methods: {
    createMap(school) {
      var location = school.location;

      if (!location || !Number(location.lat) || !Number(location.lon)) {
        container.classList.add("hidden");
        return false;
      }

      var center = L.latLng(location.lat, location.lon);
      this.$nextTick(() => {
        var map = L.map(this.$refs["map"], {
          zoomControl: false,
          panControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          touchZoom: false,
          doubleClickZoom: false,
          boxZoom: false
        }).setView(center, 10);

        L.tileLayer(
          "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png"
        ) // jshint ignore:line
          .on("tileload", function(tileEvent) {
            tileEvent.tile.setAttribute("alt", "Map tile image");
          })
          .addTo(map);

        L.control
          .attribution({
            position: "bottomleft",
            prefix: false
          })
          .addAttribution(
            [
              'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under ',
              '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.',
              '<br>Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
              'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
            ].join("")
          )
          .addTo(map);

        var marker = L.circle(center, 1200, {
          color: "black",
          opacity: 1,
          strokeWidth: 1,
          fillColor: "white",
          fillOpacity: 1
        }).addTo(map);

        marker.bindPopup(school.school.name);
        return map;
      });
    },
    // expand all panels
    all() {
      this.panels = [...Array(this.num_panels).keys()].map((k, i) => i);
    },
    // Reset the panel
    none() {
      this.panels = [];
    },
    
    
  },
  mounted() {
    let self = this;

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

    // Note, Must add key as a param.
    let request = apiGet(window.api.url, window.api.key, '/schools/', {id:id})
      .then((response) => {
        if(response.data.metadata.total > 1){
          this.error = true;
          console.warn('More than one school found for ID: "' + id + '"');
          return null;
        }

        this.school = response.data.results[0];
        document.title = _.get(this.school, "school.name") + " | College Scorecard";
        this.createMap(this.school);

      }).catch((response) => {
        this.error = true;
        console.warn('No School found for ID: ' + id);
      });

    // TODO - Remove if not needed.
    // picc.API.getSchool(id, params, function onSchoolLoad(error, school) {
    //   if (error) {
    //     self.error = true;
    //   } else {
    //     self.school = school;
    //     document.title = _.get(school, "school.name") + " | College Scorecard";
    //     self.createMap(school);
    //   }
    // });
  }
};
</script>