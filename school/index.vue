<template>
  <v-app id="app" class="school-page">
    <div class='backNav'>
      <div class="container school-back">
        <a id="referrer-link" class="link-more" href="../search/">
          <i class="fa fa-chevron-left"></i> Back to search results
        </a>
      </div>
    </div>
    <!-- Search results -->
    <div class="school-bg">


      <v-container>
        <v-row>
          <v-col cols="12" md="9" class="school-left">
            <!-- <div id="error" class="show-error">
              <h2>Something went wrong:</h2>
              <p class="error-message"></p>
              <form :action=" baseUrl +'/search/'" method="GET">
                <label for="name-school">Try searching for a school by name:</label>
                <input id="name-school" name="name" type="text" placeholder="Name of School" autocomplete="off"
                  autocorrect="off" autocapitalize="off">
                <input type="submit" value="Search" class="button-primary">
              </form>
            </div>-->
            <!-- <div class="compare-school">
              { include compare_school_control.html }
            </div>-->

            <div v-if="!school.id" class="show-loading">
              <v-card tile class='pa-5'>
              <h1 class='heading'>Loading...</h1>
              </v-card>
            </div>

            <div v-else id="school">
              <v-card tile class="school-heading pa-5 mb-5">
                <v-row>
                  <v-col cols="12" md="6" class='py-0'>
                    <v-chip
                      v-if="_.get(school, fields['UNDER_INVESTIGATION'])==1"
                      color="error"
                      label
                    ><strong>Under ED Monitoring</strong></v-chip>
                  </v-col>
                  <v-col cols="12" md="6" class='text-right py-0'>
                    [[ Add Compare ]]
                    <share label="Share this School" url="https://collegescorecard.ed.gov" />
                  </v-col>
                </v-row>
                <v-row class='mt-4'>
                  <v-col cols="12" md="8" class="py-0">
                    <h1 class="display-2 pa-0 mb-4">{{ _.get(school, fields['NAME'], 'School Name') }}</h1>
                    <v-divider />
                    
                    <h2 class="title location mb-0 mt-2">
                      <span>{{ _.get(school, fields['CITY'], 'City') }}</span>,
                      <span>{{ _.get(school, fields['STATE'], 'State') }}</span>
                    </h2>
                    <h2 class="title population my-0">
                      <span>{{ _.get(school, fields['SIZE'], 'NNNN') | separator }}</span> undergraduate students
                    </h2>
                    <h2 class="title school-url mt-0">
                      <a
                        target="_blank"
                       
                        :href="_.get(school, fields['SCHOOL_URL'], 'ed.gov') | formatUrl"
                      >{{ _.get(school, fields['SCHOOL_URL'], 'ed.gov') | formatUrlText }}</a>
                    </h2>
                    <ul class="school-key_figures key-figures ma-5">
                      <li>
                        <span v-if="years==1" class="school-key_figures-year">
                          <v-icon x-large color="black">fa fa-certificate</v-icon>
                        </span>
                        <span v-else class="school-key_figures-year">{{ years | formatYearsText }}</span>
                        <span class="label">{{ years | formatYearsLabel }}</span>
                      </li>
                      <li :class="_.get(school, fields['OWNERSHIP'], '-1') | controlClass">
                        <span>{{ _.get(school, fields['OWNERSHIP'], '-1') | control }}</span>
                      </li>
                      <li :class="_.get(school, fields['LOCALE'], '-1') | localeClass">
                        <span>{{ _.get(school, fields['LOCALE'], '-1') | locale }}</span>
                      </li>
                      <li :class="_.get(school, fields['SIZE'], '-1') | sizeCategoryClass">
                        <span>{{ _.get(school, fields['SIZE'], '-1') | sizeCategory }}</span>
                      </li>
                    </ul>
                    <ul class="school-special_designation" v-if="specialDesignations.length>0">
                      <li
                        class="special"
                        v-for="designation in specialDesignations"
                        :key="designation"
                      >{{designation}}</li>
                    </ul>
                  </v-col>
                  <v-col cols="12" md="4" class="py-0">
                    <div class="school-map" ref="map"></div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col col="12" md="6">
                    <h4 class='subtitle-2 font-weight-bold'>Graduation Rate</h4>
                    <donut
                      color="#00adf2"
                      :value="_.get(school, this.fields['COMPLETION_RATE']) * 100"
                      height="200px"
                    ></donut>
                  </v-col>
                  <v-col col="12" md="6">
                    <h4 class='subtitle-2 font-weight-bold'>Salary After Completing</h4>
                    <div class='my-5' style='height: 70px'>
                    <range
                      :lower="{ value: 25000, label: 'Basketweaving<br />$25,0000' }"
                      :upper="{ value: 84000, label: 'Brain Surgeon<br />$84,000' }"
                      :min="{ value: 0, label: '0' }"
                      :max="{ value: 125000, label: '$125,000' }"
                      hideMiddle
                      
                    ></range>
                    </div>

                    <h4 class='subtitle-2 font-weight-bold'>Average Annual Cost</h4>
                    <div v-if="!isProgramReporter">
                      <h2 class='display-2 secondary--text'>{{_.get(school, this.fields['NET_PRICE']) | numeral('$0,0') }}</h2>
                    </div>
                    <div v-else>
                      <p>The average annual net price is not available for this program-reporting school.</p>
                    </div>
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
                  <v-expansion-panel-content id="costs-content" class='pa-5'>
                    <v-row v-if="!isProgramReporter">
                      <v-col cols="12" md="6" class='text-center'>
                        <bar-chart
                          :labels="['Average Annual Cost']"
                          :data="[_.get(school, fields['NET_PRICE'], '0')]"
                          color="#d37c39"
                        />

                        <v-btn
                          rounded
                          color="secondary"
                          target="_blank"
                          :href="_.get(school, fields['NET_PRICE_CALC_URL'], '#')"
                        >
                          <i class="fa fa-calculator"></i>
                          Calculate your personal net price
                        </v-btn>
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
                              >{{ income['0-30000'] | numeral('$0,0') }}</td>
                            </tr>
                            <tr>
                              <td>$30,001-$48,000</td>
                              <td
                                data-bind="net_price_income2"
                              >{{ income['30001-48000'] | numeral('$0,0') }}</td>
                            </tr>
                            <tr>
                              <td>$48,001-$75,000</td>
                              <td
                                data-bind="net_price_income3"
                              >{{ income['48001-75000'] | numeral('$0,0') }}</td>
                            </tr>
                            <tr>
                              <td>$75,001-$110,000</td>
                              <td
                                data-bind="net_price_income4"
                              >{{ income['75001-110000'] | numeral('$0,0') }}</td>
                            </tr>
                            <tr>
                              <td>$110,001+</td>
                              <td
                                data-bind="net_price_income5"
                              >{{ income['110001-plus'] | numeral('$0,0') }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                    <div v-else>
                      <div class="school-single_col centered">
                        <h2
                          class="figure-heading constrain_width"
                          aria-describedby="tip-cost-six-largest-programs"
                          tabindex="0"
                        >
                          Largest Programs
                          <span class="tooltip-target">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <v-btn-toggle v-model="program_reporter_table" mandatory color="secondary">
                          <v-btn small text value="program_reporter_total">Total</v-btn>
                          <v-btn small text value="program_reporter_per_year">Per Academic Year</v-btn>
                        </v-btn-toggle>

                        <v-simple-table class="school-table programs-table">
                          <caption v-if="program_reporter_table=='program_reporter_total'">Total costs of largest programs</caption>
                          <caption v-else>Costs of largest programs per academic year</caption>

                          <thead>
                            <tr>
                              <th width="60%">Program Name</th>
                              <th width="15%">Program Months</th>
                              <th width="15%">Tuition, Fees, Books, Supplies</th>
                            </tr>
                          </thead>
                          <tbody
                            class="program-table-body"
                            v-for="(item, index) in programReporter"
                            :key="index"
                          >
                            <tr>
                              <td>
                                <span class="program">{{item.title}}</span>
                              </td>
                              <td>
                                <span class="duration">{{item.avg_month_completion}}</span>
                              </td>
                              <td v-if="program_reporter_table=='program_reporter_total'">
                                <span class="cost">{{item.full_program | numeral('$0,0')}}</span>
                              </td>
                              <td v-else>
                                <span class="cost">{{item.annualized | numeral('$0,0')}}</span>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>

                      <div class="u-new_line u-clearfix" style="margin-top: 15px;"></div>
                      <div class="centered">
                        <h2
                          class="figure-heading"
                          aria-describedby="tip-avg-program-cost"
                          tabindex="0"
                        >
                          Cost After Aid for Largest Program
                          <span class="tooltip-target u-new_line">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <div class="largest-program-cost">
                          <span>
                            <strong>Program:</strong>
                            <span class="program">{{ programReporter[0].title}}</span>
                          </span>
                          <strong class="fact_number">
                            <span
                              class="cost"
                            >{{ _.get(school, fields['NET_PRICE']) | numeral('$0,0')}}</span>
                          </strong>
                          <span
                            class="costDescription"
                            v-if="programReporter[0].annualized== programReporter[0].full_program"
                          >for a {{programReporter[0].avg_month_completion}}-month program</span>
                          <span class="costDescription" v-else>per year on average</span>
                        </div>
                      </div>

                      <div class="school-single_col centered" aria-hidden="true">
                        <a
                          class="button button-primary button-costs"
                          target="_blank"
                          :href="_.get(school, fields['NET_PRICE_CALC_URL'], '#')"
                        >
                          <i class="fa fa-calculator"></i>
                          Calculate your personal net price
                        </a>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="graduation" aria-controls="graduation-content">
                    Graduation &amp; Retention
                    
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="graduation-content" class='pa-5'>
                    <v-row>
                      <v-col cols="12" md="6">
                        <h2>Graduation Rate</h2>
                        <donut
                          color="#00adf2"
                          :value="_.get(school, this.fields['COMPLETION_RATE']) * 100"
                          height="200px"
                         
                        ></donut>
                      </v-col>
                      <v-col cols="12" md="6" class='text-center'>
                        <h2>Students Who Return After Their First Year</h2>
                        <donut 
                          color="#00adf2" 
                          :value="retentionRate * 100"
                          height="200px"
                        ></donut>
                      </v-col>
                    </v-row>
                    <div class="school-outcome-measures">
                      <h2
                        class="figure-heading u-align_c"
                        aria-describedby="tip-outcome-measures"
                        tabindex="0"
                      >
                        Outcomes 8 Years After Attending
                        <span class="tooltip-target u-new_line">
                          <i class="fa fa-info-circle"></i>
                        </span>
                      </h2>
                      <sankey :school="school" />
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="aid" aria-controls="aid-content">
                    Financial Aid &amp; Debt
                    
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="aid-content" class='pa-5'>
                    <v-alert v-if="_.get(school, fields['AID_ELIGIBILITY'])> 3 && _.get(school, fields['OPEFLAG']) < 8" type="info">This institution does not participate in the Federal student financial aid program administered by the U.S. Department of Education.</v-alert>
                    <v-alert v-if="_.get(school, fields['AID_ELIGIBILITY'])===3" type="info">This institution does not participate in the Federal student financial aid programs administered by the U.S. Department of Education, but is approved by the Department for purposes of allowing students to receive deferments on repayment of Federal student loans received at other institutions.</v-alert>
                    <v-alert v-if="_.get(school, fields['AID_ELIGIBILITY'])===8" type="info">Data is not yet available. This institution only recently began administering Federal aid.</v-alert>
                    <div v-else>
                      <div class="row">
                        <div class="col m6">
                          <div>
                            <h2 aria-describedby="tip-student-aid" tabindex="0">
                              Students Receiving Federal Loans
                              <span class="tooltip-target">
                                <i class="fa fa-info-circle"></i>
                              </span>
                            </h2>
                           
                             <donut
                              color="#00adf2"
                              :value="_.get(school, this.fields['AID_PERCENTAGE']) * 100"
                              height="200px"                         
                            ></donut>

                            <p>
                              At some schools where few students borrow federal loans, the typical undergraduate may
                              leave
                              school with $0 in debt.
                            </p>
                          </div>
                        </div>
                        <div class="col m6">
                          <div>
                            <h2
                              aria-describedby="tip-avg-debt"
                              tabindex="0"
                              data-bind="branch_campus"
                            >
                              Typical Total Debt After Graduation
                              <span class="tooltip-target">
                                <i class="fa fa-info-circle"></i>
                              </span>
                            </h2>
                            <strong
                              class="fact_number"
                              data-bind="average_total_debt"
                            >{{ _.get(school, fields['AVERAGE_TOTAL_DEBT']) | numeral('$0,0') }}</strong>
                            <p>For undergraduate borrowers who complete college</p>
                            <range
                              :lower="{ value: 25000, label: 'Basketweaving<br />$25,0000' }"
                              :upper="{ value: 84000, label: 'Brain Surgeon<br />$84,000' }"
                              :min="{ value: 0, label: '0' }"
                              :max="{ value: 125000, label: '$125,000' }"
                              hideMiddle
                            ></range>
                          </div>

                          <div>
                            <h2
                              aria-describedby="tip-avg-loan-payment"
                              tabindex="0"
                              data-bind="branch_campus"
                            >
                              Typical Monthly Loan Payment
                              <span class="tooltip-target">
                                <i class="fa fa-info-circle"></i>
                              </span>
                            </h2>
                            <span class="fact_number">
                              <strong
                                data-bind="average_monthly_loan_payment"
                              >{{ _.get(school, fields['MONTHLY_LOAN_PAYMENT']) | numeral('$0,0') }}</strong>/mo
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s12">
                          <div class="container school-callout">
                            <h2>Get Help Paying for College</h2>
                            <p>
                              Submit a free application for Federal Student Aid. You may be eligible to receive federal
                              grants or loans.
                            </p>
                            <a
                              href="https://fafsa.ed.gov/spa/fafsa"
                              target="_blank"
                              class="btn button-primary"
                            >Start My Application</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="earnings" aria-controls="earnings-content">
                    Earnings Completion by Field of Study
                    
                  </v-expansion-panel-header>
                  <v-expansion-panel-content
                    id="earnings-content"
                    aria-controls="earnings-content"
                    class='pa-5'
                  >
                    <p>One-year post-completion earnings with range of highest and lowest median earnings for undergraduate and credential programs for which there is data. For more information, see Fields of Study for this school.</p>
                    <range
                      :lower="{ value: 25000, label: 'Basketweaving<br />$25,0000' }"
                      :upper="{ value: 84000, label: 'Brain Surgeon<br />$84,000' }"
                      :min="{ value: 0, label: '0' }"
                      :max="{ value: 125000, label: '$125,000' }"
                      hideMiddle
                    ></range>
                    
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="academics" aria-controls="academics-content">
                    Fields of Study
                    
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="academics-content" class='pa-5'>
                   
                    <v-btn-toggle v-model="field_sort" mandatory class='my-3' color="secondary" >
                      <v-btn small text value="ipeds_award_count">Popular</v-btn>
                      <v-btn small text value="earnings">Highest Earnings</v-btn>
                      <v-btn small text value="median_debt">Lowest Debt</v-btn>
                    </v-btn-toggle>
                    <v-expansion-panels class='my-3'>
                      <v-expansion-panel v-for="fos in fieldsOfStudy" :key="fos.code">
                        <v-expansion-panel-header>{{ fos.title.slice(0,-1) }} / {{ fos.credential.title }} / {{ fos.hoist }}</v-expansion-panel-header>
                        <v-expansion-panel-content >
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
                    <v-btn
                      rounded
                      color="secondary"
                      :href="'/school/fields/?'+school.id"
                    >See All Available Programs at {{_.get(school,this.fields.NAME) }}</v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    id="demographics"
                    aria-controls="demographics-content"
                    v
                  >
                    Student Body
                    
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="demographics-content" class='pa-5'>
                    <v-row>
                      <v-col cols="12" md="12">
                        <!-- <ul class="school-key_figures key-figures">
                        <li :class="_.get(school, fields['SIZE'], '-1') | sizeCategoryClass">
                          <span>{{ _.get(school, fields['SIZE'], '-1') | sizeCategory }}</span>
                        </li>
                        </ul>-->
                        <strong
                          class="group_inline-left fact_number"
                        >{{ _.get(school, fields['SIZE']) | separator }}</strong>
                        undergraduate students
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <div>
                          <span class="fact_number">
                            <strong
                              data-bind="full_time_percent"
                            >{{ 1 - (_.get(school, fields['PART_TIME_SHARE'])) | numeral('0.%') }}</strong>
                            <span class="small">%</span>
                          </span> Full-time
                        </div>
                        <div class="fact_number divide">/</div>
                        <div>
                          <span class="fact_number">
                            <strong
                              
                            >{{ _.get(school, fields['PART_TIME_SHARE'])| numeral('0.%') }}</strong>
                            <span class="small">%</span>
                          </span> Part-time
                        </div>

                        <div v-if="_.get(school, fields['AID_ELIGIBILITY'])<3">
                          <h2>Socio-Economic Diversity</h2>

                          <div class="school-student-socio_econ-stat">
                     
                            <donut
                              color="#00adf2"
                              :value="_.get(school, this.fields['PELL_PERCENTAGE']) * 100"
                              height="200px"                         
                            ></donut>

                            <strong>of students</strong>
                          </div>

                          <p>received an income-based federal Pell grant intended for low-income students.</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <h2>Race/Ethnicity</h2>
                        <div v-for="item in raceEthnicity" :key="item.label">
                          <horizontal-bar
                            :value="Math.round(item.value*100)"
                            :min="0"
                            :max="100"
                            color="#77b713"
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
                  <v-expansion-panel-header id="selectivity" aria-controls="selectivity-content">
                    Test Scores &amp; Admittance
                    
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="selectivity-content" class='pa-5'>
                    <v-row>
                      <v-col cols="12" md="7">
                      <h2 aria-describedby="tip-test-scores" tabindex="0">
                        Test Scores
                        <span class="tooltip-target">
                          <i class="fa fa-info-circle"></i>
                        </span>
                      </h2>
                      <p>Students who were admitted and enrolled typically had standardized test scores in these ranges.</p>

                      <h3 class="h2">SAT</h3>

                      <h4>Critical Reading</h4>
                      <range
                        v-if="_.get(school, fields['SAT_READING_MIDPOINT']) != null"
                        :lower="{ value: _.get(school, fields['SAT_READING_25TH_PCTILE']), label: _.get(school, fields['SAT_READING_25TH_PCTILE']) }"
                        :upper="{ value: _.get(school, fields['SAT_READING_75TH_PCTILE']), label: _.get(school, fields['SAT_READING_75TH_PCTILE']) }"
                        :min="{ value: 0, label: '0' }"
                        :max="{ value: 800, label: '800' }"
                        hideMiddle
                      ></range>
                      <p v-else class="no-data">No Critical Reading data available.</p>

                      <h4>Math</h4>
                      <range
                        v-if="_.get(school, fields['SAT_MATH_MIDPOINT']) != null"
                        :lower="{ value: _.get(school, fields['SAT_MATH_25TH_PCTILE']), label: _.get(school, fields['SAT_MATH_25TH_PCTILE']) }"
                        :upper="{ value: _.get(school, fields['SAT_MATH_75TH_PCTILE']), label: _.get(school, fields['SAT_MATH_75TH_PCTILE']) }"
                        :min="{ value: 0, label: '0' }"
                        :max="{ value: 800, label: '800' }"
                        hideMiddle
                      ></range>
                      <p v-else class="no-data">No Math data available.</p>

                      <h3 class="h2">ACT</h3>

                      <range
                        v-if="_.get(school, fields['ACT_MIDPOINT']) != null"
                        :lower="{ value: _.get(school, fields['ACT_25TH_PCTILE']), label: _.get(school, fields['ACT_25TH_PCTILE']) }"
                        :upper="{ value: _.get(school, fields['ACT_75TH_PCTILE']), label: _.get(school, fields['ACT_75TH_PCTILE']) }"
                        :min="{ value: 0, label: '0' }"
                        :max="{ value: 36, label: '36' }"
                        hideMiddle
                      ></range>
                      <p v-else class="no-data">No data available.</p>
                      </v-col>
                      <v-col cols="12" md="4">
                      <h3>Admittance Rate</h3>
                      <div style="width:150px">
                      <donut
                        color="#00adf2"
                        :value="_.get(school, this.fields['ADMITTANCE_RATE'])*100"
                        chart-id="admittance-chart"
                        height="200px"
                        width="300px"
                      ></donut>
                      </div>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="3">
            
            <v-card outline tile class='pa-5'>
              <paying-for-college />
            </v-card>
            <!-- { include paying_for_college.html } -->
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<style lang="scss" scoped>
@import 'sass/_variables';


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
import Sankey from "components/vue/Sankey.vue";
import Range from "components/vue/Range.vue";
import HorizontalBar from "components/vue/HorizontalBar.vue";
import Share from "components/vue/Share.vue";
import PayingForCollege from "components/vue/PayingForCollege.vue";
export default {
  props: ["baseUrl"],
  components: {
    donut: Donut,
    "name-autocomplete": NameAutocomplete,
    "bar-chart": BarChart,
    tooltip: Tooltip,
    sankey: Sankey,
    range: Range,
    "horizontal-bar": HorizontalBar,
    share: Share,
    'paying-for-college': PayingForCollege
  },
  data() {
    return {
      school: {},
      fields: [],
      panels: [],
      num_panels: 7,
      program_reporter_table: "program_reporter_total",
      field_sort: 'ipeds_award_count'
    };
  },
  computed: {
    years() {
      return _.get(this.school, this.fields["PREDOMINANT_DEGREE"]);
    },
    awardLevels() {
      // return values are whether the institution offers other kind of degrees/certs than the predominant degree
      // if they do we return the glossary term key to display or false to disable the tooltip
      switch (this.years) {
        case 1:
          return _.get(
            this.school,
            this.fields.DEGREE_OFFERED + ".assoc_or_bachelors"
          )
            ? "certificate"
            : false;
        case 2:
          return _.get(
            this.school,
            this.fields.DEGREE_OFFERED + ".certificate"
          ) || _.get(this.school, this.fields.DEGREE_OFFERED + ".bachelors")
            ? "2-year"
            : false;
        case 3:
          return _.get(
            this.school,
            this.fields.DEGREE_OFFERED + ".certificate"
          ) || _.get(this.school, this.fields.DEGREE_OFFERED + ".assoc")
            ? "4-year"
            : false;
      }
      return false;
    },
    yearsStyle() {
      switch (+this.years) {
        case 2: // 2-year (AKA less than 4-year)
          return "lt_four_year";
        case 3: // 4-year
          return "four_year";
      }
    },
    publicPrivate() {
      var ownership = _.get(this.school, this.fields["OWNERSHIP"]);
      switch (+ownership) {
        case 1: // public
          return "public";

        case 2: // private
        case 3:
          return "private";
      }
      return null;
    },
    income() {
      let income = _.get(this.school, this.fields["NET_PRICE_BY_INCOME"]);
      return income[this.publicPrivate]["by_income_level"];
    },
    specialDesignations() {
      var designations = [];
      var SPECIAL_DESIGNATIONS = picc.SPECIAL_DESIGNATIONS || {};

      if (+_.get(this.school, this.fields.WOMEN_ONLY)) {
        designations.push(SPECIAL_DESIGNATIONS.women_only);
      } else if (+_.get(this.school, this.fields.MEN_ONLY)) {
        designations.push(SPECIAL_DESIGNATIONS.men_only);
      }

      var religious = _.get(this.school, this.fields.RELIGIOUS);
      if (religious in picc.RELIGIOUS_AFFILIATIONS_BY_NUMBER) {
        designations.push(picc.RELIGIOUS_AFFILIATIONS_BY_NUMBER[religious]);
      }

      var minorityServing = _.get(this.school, this.fields.MINORITY_SERVING);
      if (minorityServing) {
        for (var key in SPECIAL_DESIGNATIONS) {
          if (+minorityServing[key]) {
            designations.push(SPECIAL_DESIGNATIONS[key]);
          }
        }
      }
      return designations;
    },

    raceEthnicity() {
      let output = [];
      let re = _.get(this.school, this.fields["RACE_ETHNICITY"]);
      let include = [
        "aian",
        "asian",
        "black",
        "hispanic",
        "nhpi",
        "non_resident_alien",
        "two_or_more",
        "unknown",
        "white"
      ];
      for (let p = 0; p < include.length; p++) {
        output.push({
          label: picc.RACE_ETHNICITY_LABELS[include[p]],
          value: re[include[p]]
        });
      }

      return _.sortBy(output, ["value"]).reverse();
    },
    retentionRate() {
      let retention = _.get(this.school, this.fields.RETENTION_RATE);
      if (retention) {
        let fourYear = retention.four_year.full_time_pooled;
        return fourYear || fourYear === 0
          ? fourYear
          : retention.lt_four_year.full_time_pooled;
      }
      retention = _.get(
        this.school,
        this.fields.RETENTION_RATE + ".four_year.full_time_pooled"
      );
      return retention || retention === 0
        ? retention
        : _.get(
            this.school,
            this.fields.RETENTION_RATE + ".lt_four_year.full_time_pooled"
          );
    },
    programReporter() {
      let reporterData = [];
      let programs = _.get(this.school, this.fields.PROGRAM_REPORTER_PROGRAM);
      let cost = _.get(this.school, this.fields.PROGRAM_REPORTER_COST);
      for (let q = 1; q <= 6; q++) {
        if (programs["program_" + q].cip_6_digit.code) {
          reporterData.push({
            ...programs["program_" + q].cip_6_digit,
            ...cost["program_" + q].cip_6_digit
          });
        }
      }
      return reporterData;
    },
    isProgramReporter(){
      return _.get(this.school, this.fields.PROGRAM_REPORTER_OFFERED)>0;
    },
    fieldsOfStudy(){
      let self = this;
      let fos = _.get(this.school, "latest.programs.aid.debt.cip_4_digit");
      if(fos.length)
      {
        fos = fos.filter(field=> field.credential.level<=3 && field[self.field_sort])
        
        fos = _.sortBy(fos, [function(o) { return o[self.field_sort]; }]);
        if(['ipeds_award_count','highest_earnings'].indexOf(self.field_sort)>=0)
        {
          fos.reverse();
        }
        fos = fos.slice(0,10);
        fos.map(field=>{ field.hoist = field[self.field_sort]; return field; })
      }
      else
      {
        fos = [fos];
      }
      return fos;
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
      self.createMap(school);
    });
  }
};
</script>