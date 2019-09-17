<template>
  <v-app id="app">
    
  <!-- Search results -->
    <div class="school-bg " >

      <div class="container school-back">
        <a id="referrer-link" class="link-more" href="../search/">
          <i class="fa fa-chevron-left"></i> Back to search results
        </a>
      </div>

      <v-container>
        <v-row>
          <v-col lg='9' class="main-card_container-school">
    
            <!-- <div id="error" class="show-error">
              <h2>Something went wrong:</h2>
              <p class="error-message"></p>
              <form :action=" baseUrl +'/search/'" method="GET">
                <label for="name-school">Try searching for a school by name:</label>
                <input id="name-school" name="name" type="text" placeholder="Name of School" autocomplete="off"
                  autocorrect="off" autocapitalize="off">
                <input type="submit" value="Search" class="button-primary">
              </form>
            </div> -->

            <div v-if="!school.id" class="show-loading">
              <h1>Loading...</h1>
            </div>

            <div v-else class="show-loaded school-section" id="school" >
              <div class="school-card_container-school">
                <div class="school-heading">
                  <div class="investigation-major-wrapper" data-bind="under_investigation" aria-hidden="true">
                    <a>
                      <p class="investigation-major" aria-describedby="tip-hcm2" data-bind="branch_campus">
                        Under Ed Monitoring <i class="tooltip-target fa fa-info-circle"></i>
                      </p>
                    </a>
                  </div>

                  <div class="compare-wrapper">
                    <h1>{{ _.get(school, fields['NAME'], 'School Name') }}</h1>

                    <!-- <div class="compare-school">
                      { include compare_school_control.html }
                    </div> -->
                    <tooltip content="Hi mom!"></tooltip>
                  </div>

                  <h2 class="location">
                    <span>{{ _.get(school, fields['CITY'], 'City') }}</span>,
                    <span>{{ _.get(school, fields['STATE'], 'State') }}</span>
                  </h2>

                  <h2 class="population">
                    <span>{{ _.get(school, fields['SIZE'], 'NNNN') }}</span> undergraduate students
                  </h2>

                  <h2 class="school-url">
                    <a target="_blank" :href="_.get(school, fields['SCHOOL_URL'], 'ed.gov') | formatUrl">{{ _.get(school, fields['SCHOOL_URL'], 'ed.gov') | formatUrlText }}</a>
                  </h2>

                  <ul class="school-key_figures key-figures">
                    <li data-bind="years">
                      <span aria-describedby="tip-award-level" tabindex="0" data-bind="award_level">
                        <span data-bind="number" class="school-key_figures-year">{{ _.get(school, fields['PREDOMINANT_DEGREE'], '-1')}}</span>
                        <span class="label"></span>
                        <span class="tooltip-target u-new_line"></span>
                      </span>
                    </li>
                    <li :class="_.get(school, fields['OWNERSHIP'], '-1') | controlClass">
                      <span> {{ _.get(school, fields['OWNERSHIP'], '-1') | control }}</span>
                    </li>
                    <li :class="_.get(school, fields['LOCALE'], '-1') | localeClass">
                      <span>{{ _.get(school, fields['LOCALE'], '-1') | locale }}</span>
                    </li>
                    <li :class="_.get(school, fields['SIZE'], '-1') | sizeCategoryClass">
                      <span>{{ _.get(school, fields['SIZE'], '-1') | sizeCategory }}</span>
                    </li>
                  </ul>

                  <ul class="school-special_designation" v-if="specialDesignations.length>0">
                    <li class="special" v-for="designation in specialDesignations" :key="designation">
                      {{designation}}
                    </li>
                  </ul>

                </div>

                <div class="school-map" id="school-map">
                </div>
                <div class='u-clearfix'></div>
                <div class='row'>
                  <div class='col m6'>
                    Graduation Rate<br />
                    <span data-bind="grad_rate">XX%</span>
                    <!-- <donut
                      title="Graduation Rate"
                      value="57"
                      height="150px"
                      width="150px"
                    ></donut>
                    <name-autocomplete></name-autocomplete> -->
                  </div>
                  <div class='col m6'>
                    <bar-chart :labels="['Salary After Attending']" :data="[500]"/>
                    Salary After Attending<br />
                    <span data-bind="average_salary">$XX,XXX</span>
                    - <span data-bind="average_salary">$XX,XXX</span>
                    <hr />
                    Average Annual Cost
                    <span data-bind="average_cost">$XX,XXX</span>
                  </div>
                </div>
              </div><!-- /.school-card_container-school -->
              <div class='u-clearfix'></div>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header id="cost" aria-controls="costs-content">
                    Costs <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="costs-content">
                    <div class="school-two_col-left centered" data-bind="program_reporter_hidden">
                      
                      <bar-chart :labels="['Average Annual Cost']" :data="[_.get(school, fields['NET_PRICE'], '0')]"/>
                      <!-- <figure class="meter below_is_good">
                        <h2 class="figure-heading constrain_width" aria-describedby="tip-avg-cost-year" tabindex="0"
                          data-bind="average_cost_tip">
                          <span data-bind="average_cost_label" class="label-nowrap">Average<br>Annual Cost</span>
                          <span class="tooltip-target u-new_line">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <picc-meter id="cost-meter" { include net_price_meter_attributes.html }>
                        </picc-meter>
                        <figcaption>
                          <span class="average-value" data-bind="average_cost"></span>
                        </figcaption>
                      </figure> -->

                      <a class="btn" target="_blank" :href="_.get(school, fields['NET_PRICE_CALC_URL'], '#')">
                        <i class="fa fa-calculator"></i>
                        Calculate your personal net price
                      </a>

                    </div>

                    <div class="school-two_col-right" data-bind="program_reporter_hidden">
                      <h2>By Family Income</h2>
                      <p>Depending on the federal, state, or institutional grant aid available, students in your income
                        bracket may pay more or less than the overall average costs.</p>

                      <table class="school-table">
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
                            <td data-bind="net_price_income1">{{ income['0-30000'] | numeral('$0,0') }}</td>
                          </tr>
                          <tr>
                            <td>$30,001-$48,000</td>
                            <td data-bind="net_price_income2">{{ income['30001-48000'] | numeral('$0,0') }}</td>
                          </tr>
                          <tr>
                            <td>$48,001-$75,000</td>
                            <td data-bind="net_price_income3">{{ income['48001-75000'] | numeral('$0,0') }}</td>
                          </tr>
                          <tr>
                            <td>$75,001-$110,000</td>
                            <td data-bind="net_price_income4">{{ income['75001-110000'] | numeral('$0,0') }}</td>
                          </tr>
                          <tr>
                            <td>$110,001+</td>
                            <td data-bind="net_price_income5">{{ income['110001-plus'] | numeral('$0,0') }}</td>
                          </tr>
                        </tbody>
                      </table>

                    </div>

                    <div class="u-clearfix"></div>

                    <div class="school-single_col centered" data-bind="program_reporter_shown" aria-hidden="true">
                      <h2 class="figure-heading constrain_width" aria-describedby="tip-cost-six-largest-programs"
                        tabindex="0">
                        Largest Programs
                        <span class="tooltip-target">
                          <i class="fa fa-info-circle"></i>
                        </span>
                      </h2>

                      <aria-tabs>
                        <div data-name="Total" aria-selected="true">
                          <table class="school-table programs-table">
                            <caption class="sr-only">Total costs of largest programs</caption>
                            <thead>
                              <tr>
                                <th width="60%">Program Name</th>
                                <th width="15%">Program Months</th>
                                <th width="15%">Tuition, Fees, Books, Supplies</th>
                              </tr>
                            </thead>
                            <tbody class="program-table-body" data-bind="program_reporter_total">
                              <tr>
                                <td><span class="program">Program Name</span></td>
                                <td><span class="duration">XX</span></td>
                                <td><span class="cost">$XX,XXX</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div data-name="Per Academic Year">
                          <table class="school-table programs-table">
                            <caption class="sr-only">Costs of largest programs per academic year</caption>
                            <thead>
                              <tr>
                                <th width="60%">Program Name</th>
                                <th width="15%">Program Months</th>
                                <th width="15%">Tuition, Fees, Books, Supplies</th>
                              </tr>
                            </thead>
                            <tbody class="program-table-body" data-bind="program_reporter_per_year">
                              <tr>
                                <td><span class="program">Program Name</span></td>
                                <td><span class="duration">XX</span></td>
                                <td><span class="cost">$XX,XXX</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </aria-tabs>
                    </div>

                    <div class="u-new_line u-clearfix" style="margin-top: 15px;"></div>
                    <div class="centered" data-bind="program_reporter_shown">
                      <h2 class="figure-heading" aria-describedby="tip-avg-program-cost" tabindex="0">
                        Cost After Aid<br>for Largest Program
                        <span class="tooltip-target u-new_line">
                          <i class="fa fa-info-circle"></i>
                        </span>
                      </h2>
                      <div class="largest-program-cost" data-bind="program_reporter_largest">
                        <span><strong>Program: </strong>
                          <span class="program">Program Name</span>
                        </span>
                        <strong class="fact_number">
                          <span class="cost">$XX,XXX</span>
                        </strong>
                        <span class="costDescription">XXX</span>
                      </div>
                    </div>

                    <div class="school-single_col centered" data-bind="program_reporter_shown" aria-hidden="true">
                      <a class="button button-primary button-costs" target="_blank" :href="_.get(school, fields['NET_PRICE_CALC_URL'], '#')">
                        <i class="fa fa-calculator"></i>
                        Calculate your personal net price
                      </a>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="graduation" aria-controls="graduation-content">
                    Graduation &amp; Retention <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content  id="graduation-content">
                      <bar-chart :labels="['Graduation Rate']" :data="[_.get(school, fields['COMPLETION_RATE'], '0')]"/>
                      <bar-chart :labels="['Students Who Return After Their First Year']" :data="[_.get(school, fields['RETENTION_RATE'], '0')]"/>
                    <!-- <div class="school-two_col-left centered">
                      <figure class="meter above_is_good">
                        <h2 class="figure-heading constrain_width" aria-describedby="tip-graduation-rate" tabindex="0">
                          Graduation Rate
                          <span class="tooltip-target u-new_line">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <picc-meter id="grad-meter"  include graduation_meter_attributes.html }>
                        </picc-meter>
                        <figcaption>
                          <span class="average-value" data-bind="grad_rate">60%</span>
                        </figcaption>
                      </figure>
                    </div> -->

                    <!-- <div class="school-two_col-right centered">
                      <figure class="meter above_is_good">
                        <h2 class="figure-heading" aria-describedby="tip-retention-rate" tabindex="0">
                          Students Who Return<br>After Their First Year
                          <span class="tooltip-target u-new_line">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <picc-meter id="retention-meter" { include retention_rate_meter_attributes.html }>
                        </picc-meter>
                        <figcaption>
                          <span class="average-value" data-bind="retention_rate_value">XX%</span>
                        </figcaption>
                      </figure>
                    </div> -->

                    <div class="school-outcome-measures">
                      <h2 class="figure-heading u-align_c" aria-describedby="tip-outcome-measures" tabindex="0">
                        Outcomes 8 Years<br />After Attending
                        <span class="tooltip-target u-new_line">
                          <i class="fa fa-info-circle"></i>
                        </span>
                      </h2>
                      <div class=''>
                        <p class='outcomes_intro'>Show data for students who </p>
                        <div class='toggle_group enroll' id='enroll_toggle'>
                          <a class='outcome_toggle' href="#enroll_first_time">started college here</a><a
                            class='outcome_toggle' href="#enroll_not_first_time">transferred in</a><a
                            class='outcome_toggle active' href="#enroll_both">both</a>
                        </div>
                      </div>
                      <div class="">
                        <p class='outcomes_intro'>and started their studies </p>
                        <div class='toggle_group study' id="study_toggle">
                          <a class='outcome_toggle' href="#study_full_time">full-time</a><a class='outcome_toggle'
                            href="#study_part_time">part-time</a><a class='outcome_toggle active'
                            href="#study_both">both</a>
                        </div>
                        .
                      </div>
                      <div id="school_om_visualization" class="om_visualization" data-colors="multi">
                        <div class="om_group"></div>
                        <div class="om_sankey"></div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="aid" aria-controls="aid-content">
                    Financial Aid &amp; Debt <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="aid-content">
                    <div class="school-single_col no_finaid_banner" data-bind="no_finaid_shown" aria-hidden="true">
                      <div class="callout-banner-wrapper">
                        <p class="callout-banner" aria-describedby="tip-ogc" data-bind="ogc_tip">
                          This school does not distribute federal student aid.
                          <span class="tooltip-target">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </p>
                      </div>
                    </div>

                    <div data-bind="no_finaid_hidden">
                      <div class="row">
                        <div class="col m6">
                          <div>
                            <h2 aria-describedby="tip-student-aid" tabindex="0">
                              Students Receiving Federal Loans
                              <span class="tooltip-target">
                                <i class="fa fa-info-circle"></i>
                              </span>
                            </h2>
                            <strong class="fact_number">{{ _.get(school, fields['AID_PERCENTAGE']) | numeral('0.%') }}</strong>
                            <p>At some schools where few students borrow federal loans, the typical undergraduate may
                              leave
                              school with $0 in debt.</p>
                          </div>

                        </div>
                        <div class="col m6">
                          <div>
                            <h2 aria-describedby="tip-avg-debt" tabindex="0" data-bind="branch_campus">
                              Typical Total Debt After Graduation
                              <span class="tooltip-target">
                                <i class="fa fa-info-circle"></i>
                              </span>
                            </h2>
                            <strong class="fact_number" data-bind="average_total_debt">{{ _.get(school, fields['AVERAGE_TOTAL_DEBT'])  | numeral('$0,0') }}</strong>
                            <p>For undergraduate borrowers who complete college</p>
                          </div>

                          <div>
                            <h2 aria-describedby="tip-avg-loan-payment" tabindex="0" data-bind="branch_campus">
                              Typical Monthly Loan Payment
                              <span class="tooltip-target">
                                <i class="fa fa-info-circle"></i>
                              </span>
                            </h2>
                            <span class="fact_number">
                              <strong data-bind="average_monthly_loan_payment">{{ _.get(school, fields['MONTHLY_LOAN_PAYMENT']) | numeral('$0,0') }}</strong>/mo
                            </span>
                          </div>

                        </div>
                      </div>
                      <div class='row'>
                        <div class='col s12'>
                          <div class="container school-callout">

                            <h2>Get Help Paying for College</h2>
                            <p>Submit a free application for Federal Student Aid. You may be eligible to receive federal
                              grants or loans.</p>
                            <a href="https://fafsa.ed.gov/spa/fafsa" target="_blank" class="btn button-primary">
                              Start My Application
                            </a>

                          </div>

                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="earnings" aria-controls="earnings-content">
                    Earnings Completion by Field of Study <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content  id="earnings-content" aria-controls="earnings-content" v>
                    <div class="centered">

                      <picc-range data-bind="sat_reading_scores" max="800">
                      </picc-range>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="academics" aria-controls="academics-content">
                    Academic Programs <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="academics-content">
                    <div class="row">
                      <div class="col m6">

                        <h2 aria-describedby="tip-pop-prog" tabindex="0">
                          Most Popular Programs
                          <span class="tooltip-target">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <ol class="decimal school-programs" data-bind="popular_programs">
                          <li><span class="program"></span> (<span class="percent"></span>)</li>
                        </ol>
                      </div>

                      <div class="col m6">

                        <h2 aria-describedby="tip-avail-study" tabindex="0">
                          Available Areas of Study
                          <span class="tooltip-target">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <ul class="school-long_list" data-bind="available_programs">
                          <li><span class="program">Management</span></li>
                        </ul>

                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="demographics" aria-controls="demographics-content" v>
                    Student Body <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content  id="demographics-content">
                    <div class="school-student-intro">
                      <ul class="school-key_figures key-figures">
                        <li :class="_.get(school, fields['SIZE'], '-1') | sizeCategoryClass">
                          <span>{{ _.get(school, fields['SIZE'], '-1') | sizeCategory }}</span>
                        </li>
                        <li class="school-key_figures-stat">
                          <div class="group_inline">
                            <strong class="group_inline-left fact_number">{{ _.get(school, fields['SIZE']) | separator }}</strong>
                            <div class="group_inline-right">
                              <p>undergraduate <br>students</p>
                            </div>
                          </div>
                        </li>
                      </ul>

                    </div>

                    <div class="row school-student-body">

                      <div class="col m6">

                        <div class="school-student-stats-col">

                          <div class="school-student-stats-col-align">

                            <div>
                              <span class="fact_number">
                                <strong data-bind="full_time_percent">{{ 1 - (_.get(school, fields['PART_TIME_SHARE'])) | numeral('0.%') }}</strong>
                                <span class="small">%</span>
                              </span> Full-time
                            </div>
                            <div class="fact_number divide">/</div>
                            <div>
                              <span class="fact_number">
                                <strong data-bind="part_time_percent">{{ _.get(school, fields['PART_TIME_SHARE'])| numeral('0.%') }}</strong>
                                <span class="small">%</span>
                              </span> Part-time
                            </div>

                          </div>

                          <div class="school-student-socio_econ" data-bind="no_finaid_hidden">
                            <h2>
                              Socio-Economic Diversity
                            </h2>

                            <div class="school-student-socio_econ-stat">
                              <strong class="fact_number" data-bind="pell_grant_percentage">{{ _.get(school, fields['PELL_PERCENTAGE']) | numeral('0.%') }}</strong>
                              <strong>of students</strong>
                            </div>

                            <p>received an income-based federal Pell grant intended for low-income students.</p>
                          </div>

                        </div>

                      </div>


                      <!-- <div class="col m6">
                        <h2 aria-describedby="tip-race-eth" tabindex="0">
                          Race/Ethnicity
                          <span class="tooltip-target">
                            <i class="fa fa-info-circle"></i>
                          </span>
                        </h2>
                        <ol class="bars" data-bind="race_ethnicity_values">
                          { include bar_chart_template_item.html }
                        </ol>
                      </div> -->
                      <h2>Race/Ethnicity</h2>
                      <div v-for="(value, key) in raceEthnicity" :key="key">
                        {{key}} : {{value | numeral('0.%')}}
                      </div>

                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header id="selectivity" aria-controls="selectivity-content">
                    Test Scores &amp; Admittance <i class="material-icons">expand_more</i>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v id="selectivity-content">
                    <div>
                      <!--TODO-->
                      <h2 aria-describedby="tip-test-scores" tabindex="0">
                        Test Scores
                        <span class="tooltip-target">
                          <i class="fa fa-info-circle"></i>
                        </span>
                      </h2>
                      <p>Students who were admitted and enrolled typically had standardized test scores in these ranges.
                      </p>

                      <h3 class="h2">SAT</h3>

                      <figure data-bind="sat_reading_scores_visible">
                        <h4>Critical Reading</h4>
                        <picc-range data-bind="sat_reading_scores" max="800">
                        </picc-range>
                      </figure>
                      <p class="no-data" data-bind="sat_reading_scores_invisible">
                        No Critical Reading data available.
                      </p>

                      <figure data-bind="sat_math_scores_visible">
                        <h4>Math</h4>
                        <picc-range data-bind="sat_math_scores" max="800">
                        </picc-range>
                      </figure>
                      <p class="no-data" data-bind="sat_math_scores_invisible">
                        No Math data available.
                      </p>

                      <h3 class="h2">ACT</h3>

                      <figure data-bind="act_scores_visible">
                        <picc-range data-bind="act_scores" min="0" max="36">
                        </picc-range>
                      </figure>
                      <p class="no-data" data-bind="act_scores_invisible">
                        No data available.
                      </p>

                      <h3>Admittance Rate</h3>
                      <p>Coming soon!</p>

                    </div>
                  </v-expansion-panel-content >
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="3">

            <div class="school-share-wrapper">
              <div class="button button-share" data-share-button tabindex="0" role="button" onclick="void(0)">
                <span class="top xaxis content">Share this School</span>
                <ul class="social-share-list bottom xaxis content">
                  <li class="social-item">
                    <a data-href="https://twitter.com/intent/tweet?text=Take%20a%20look%20at%20this%20school&amp;url={url}"
                      data-bind="school_share_link_twt" data-social="Twitter" title="Share on Twitter" target="_blank">
                      <i class="fa fa-twitter"></i>
                      <span class="sr-only">Share on Twitter</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a data-href="https://www.facebook.com/sharer/sharer.php?u={url}" data-bind="school_share_link_fb"
                      title="Share on Facebook" data-social="Facebook" target="_blank">
                      <i class="fa fa-facebook"></i>
                      <span class="sr-only">Share on Facebook</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a data-href="mailto:?subject=Take%20a%20look%20at%20this%20school&amp;body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A{url}"
                      data-bind="school_share_link_mail" data-social="Email" title="Share via Email">
                      <i class="fa fa-envelope"></i>
                      <span class="sr-only">Share via Email</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a data-href="https://www.linkedin.com/shareArticle?mini=true&url={url}"
                      data-bind="school_share_link_li" data-social="LinkedIn" title="Share on LinkedIn" target="_blank">
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
import Donut from './components/vue/Donut.vue';
import NameAutocomplete from './components/vue/NameAutocomplete.vue'
import BarChart from './components/vue/Bar.vue'
import Tooltip from './components/vue/Tooltip.vue'

export default {
  props: ['baseUrl'],
  components:{
    'donut': Donut,
    'name-autocomplete': NameAutocomplete,
    'bar-chart': BarChart,
    'tooltip': Tooltip
  },
  data(){
    return{
      school: {},
      fields: []
    }
  },
  computed: {
    publicPrivate(){
      var ownership = _.get(this.school, this.fields['OWNERSHIP']);
      switch (+ownership) {
        case 1: // public
          return 'public';

        case 2: // private
        case 3:
          return 'private';
      }
      return null;
    },
    income(){
      let income = _.get(this.school, this.fields['NET_PRICE_BY_INCOME']);
      return income[this.publicPrivate]['by_income_level'];
    },
    specialDesignations(){
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
      return designations
    },

    raceEthnicity(){
        let output = {};
        let re = _.get(this.school, this.fields['RACE_ETHNICITY']);
        let include = ['aian','asian','black','hispanic','nhpi','non_resident_alien','two_or_more','unknown','white'];
        for(let p=0; p<include.length; p++)
        {
          output[picc.RACE_ETHNICITY_LABELS[include[p]]] = re[include[p]];
        }
        return output;
    }
  },

  methods:{
    createMap(school, container) {
      if (!container) {
        console.error('got null container in createMap(); bailing');
        return false;
      }

      var location = school.location;

      if (!location || !Number(location.lat) || !Number(location.lon)) {
        container.classList.add('hidden');
        return false;
      }

      var center = L.latLng(location.lat, location.lon);
      var map = L.map(container, {
          zoomControl:        false,
          panControl:         false,
          attributionControl: false,
          dragging:           false,
          scrollWheelZoom:    false,
          touchZoom:          false,
          doubleClickZoom:    false,
          boxZoom:            false
        })
        .setView(center, 10);

      L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png') // jshint ignore:line
        .on('tileload', function(tileEvent){
          tileEvent.tile.setAttribute('alt', 'Map tile image');
        })
        .addTo(map);

      L.control.attribution({
          position: 'bottomleft',
          prefix: false
        })
        .addAttribution([
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under ',
          '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.',
          '<br>Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
          'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        ].join(''))
        .addTo(map);

      var marker = L.circle(center, 1200, {
          color: 'black',
          opacity: 1,
          strokeWidth: 1,
          fillColor: 'white',
          fillOpacity: 1
        })
        .addTo(map);

      marker.bindPopup(school.school.name);
      return map;
    }

  },
  mounted(){
    let self = this;
    this.fields = picc.fields;

    if (!location.search) {
        return null;
    }
    var match = location.search.match(/^\?(\d+)(\b|-)/);
    var id= match ? match[1] : null;

    if (!id) {
    //  loadable.classed('js-error', true);
    //  return showError(picc.errors.NO_SCHOOL_ID);
    }

    d3.select('#referrer-link')
      .attr('href', document.referrer || null);


    var params = {};
    console.log(picc);
    // only display scorecard school (from default search)
    params[picc.fields.OPERATING] = 1;
    params[picc.fields.DEGREE_OFFERED + '.assoc_or_bachelors_or_certificate'] = true;
    params[picc.fields.SIZE + '__range'] = '0..';
    params[picc.fields.PREDOMINANT_DEGREE + '__range'] = '1..3';
    params[picc.fields.ID + '__range'] = '..999999';

    picc.API.getSchool(id, params, function onSchoolLoad(error, school) {
      self.school = school;
      var mapElement = document.getElementsByClassName('school-map');
      self.createMap(school, 'school-map');
    });
  }
}
</script>