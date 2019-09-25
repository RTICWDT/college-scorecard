<template>
  <v-app>
    <data-navigation current="/data/documentation/" />
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <h1 class='display-1 pb-2'>Data Documentation</h1>

          <p>This page provides more details about the robust data set behind the College Scorecard efforts. You can get information on accessing and understanding the API; download the entire dataset spanning nearly 20 years of data and covering multiple sources including IPEDS, NSLDS, and Department of Treasury; or download smaller data sets, including the data provided on the College Scorecard.</p>

          <p>
            You can also learn more about the data through our full
            <a
              data-download
              :href="baseUrl+'/assets/FullDataDocumentation.pdf'"
              target="_blank"
            >Documentation Report</a> and the
            <a
              data-download
              :href="baseUrl+'/assets/'+dataDictionary"
              target="_blank"
            >Data Dictionary</a>. Our
            <a :href="baseUrl+'/data/changelog/'">Change Log</a> describes the changes to the dataset over time.
          </p>

          <p>
            For those who want to understand more about ways to use the data, the
            <a
              data-download
              :href="baseUrl+'/assets/UsingFederalDataToMeasureAndImprovePerformance.pdf'"
              target="_blank"
            >2015 Technical Paper</a> offers an in-depth exploration of the data and methodologies considered and used for this project.
          </p>

          <h2 class='title'>Accuracy and Privacy</h2>

          <p>Note that for many elements, we have taken additional steps to ensure data are stable from year to year and representative of a certain number of students. For most elements, data are pooled across years to reduce year-over-year variability in figures (i.e. repayment rate, completion rate, earnings). Moreover, for elements that we expect to publish for consumer use, a separate version of the element is available that suppresses the data for schools with fewer than 30 students in the denominator. All National Student Loan Data System (NSLDS) and Treasury elements are protected for privacy purposes; any data not reported in order to protect an individual’s privacy are shown as PrivacySuppressed.</p>

          <p>Additionally, many elements are available only for Title IV recipients, or students who receive federal grants and loans. While these data are reported at the individual level to NSLDS and used to distribute federal aid, they are published only at the aggregate institutional level. While some schools report these data at the campus level (8-digit OPE ID), we have rolled those up to the institution level (6-digit OPE ID).</p>

          <h2 class="title">Categories of Data</h2>

          <p>
            The data available from this website covers a wide range of topics. An overview of the available categories of data is below. For detailed information on each category and its individual fields, see the full
            <a
              data-download
              :href="baseUrl+'/assets/FullDataDocumentation.pdf'"
              target="_blank"
            >Documentation Report</a> and the
            <a
              data-download
              :href="baseUrl+'/assets/'+dataDictionary"
              target="_blank"
            >Data Dictionary</a>.
          </p>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Root</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  These select items refer to the most basic information in the data set,
                  including different IDs for each school.
                </p>

                <ul>
                  <li>Unit ID and OPE ID for the institution</li>
                  <li>Location (lat/long)</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>School</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>A number of the elements produced in this data set provide basic descriptive information about the school in question. Most of these elements are already available through the Integrated Postsecondary Education Data System (IPEDS).</p>

                <ul>
                  <li>Name</li>
                  <li>Currently Operating status</li>
                  <li>URLs for the Institution’s Homepage and Net Price Calculator</li>
                  <li>Main vs Branch Campus</li>
                  <li>Accrediting Agency</li>
                  <li>Degree Type</li>
                  <li>Public/Private Nonprofit/Private For-Profit</li>
                  <li>Carnegie Classifications</li>
                  <li>Specialized Mission or Religious Affiliation</li>
                  <li>Distance-Education-Only Indicator</li>
                  <li>School Revenue and Expenditures</li>
                  <li>Heightened Cash Monitoring 2 Indicator</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Academics</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>These metrics describe the types of academics available at each institution.</p>

                <ul>
                  <li>Percentage of Degrees Awarded by Program</li>
                  <li>Programs Offered by Degree Type</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Admissions</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>These metrics describe the admission statistics for each institution.</p>

                <ul>
                  <li>Acceptance Rate</li>
                  <li>SAT and ACT scores</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Student</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>Several elements, including some that haven’t been published before, identify demographic and other details about the student body of the school. Some of the elements are available through the Integrated Postsecondary Education Data System, and others were produced using the National Student Loan Data System.</p>

                <ul>
                  <li>Number of Undergraduate Students</li>
                  <li>Undergraduate Student Body by Race/Ethnicity</li>
                  <li>Undergraduate Students by Part-Time status</li>
                  <li>Undergraduate Students by Age (25 or Over)</li>
                  <li>Income Brackets of Federal Financial Aid Recipients</li>
                  <li>Share of First-Generation Students</li>
                  <li>Number of FAFSA Submissions to Colleges</li>
                </ul>

                <p>Some data were produced as contextual information for the earnings cohorts in particular; the most recent data for these elements are for the 2005 and 2006 cohorts. These data include undergraduate students by: gender, age at entry, veteran status, and marital status.</p>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Cost</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>Information about the costs to students of a school can provide important context for students and families as they seek to evaluate the tradeoffs of access, affordability, and outcomes. While several of the elements in this category are commonly used elements from the Integrated Postsecondary Education Data System, others are new and/or different elements derived from the National Student Loan Data System.</p>

                <ul>
                  <li>Average Cost of Attendance</li>
                  <li>Tuition and Fees</li>
                  <li>Average Net Price, by Income Level</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Aid</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>Financial aid can provide an important look at how much debt students take on to attend the college, the share of students who receive federal grants and loans to help pay for college, and how much the typical student can expect to owe each month after graduating.</p>

                <ul>
                  <li>Percent of Undergraduates Receiving Federal Loans</li>
                  <li>Percentage of Pell Grant Recipients</li>
                  <li>Cumulative Median Debt, Disaggregated by Student Subgroups</li>
                  <li>Typical Monthly Loan Payments of Graduates</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Repayment</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>To provide a sense for the debt burden of attending college and the loan performance metrics for each school, we produced several elements using the National Student Loan Data System. These elements can provide useful information for students and families concerned about borrowing for college and interested in seeing borrowers’ behavior after they leave the school.</p>

                <ul>
                  <li>Cohort Default Rate</li>
                  <li>Repayment Rate on Federal Student Loans, Disaggregated by Student Subgroups</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Completion</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>College completion is associated with other positive outcomes, like finding a job and successfully repaying student loans, and is an important metric for evaluating the experiences of students at the institution. However, both existing and new methods of measuring completion have limitations.</p>

                <ul>
                  <li>Completion Rates for First-Time, Full-Time Students</li>
                  <li>Retention Rates for First-Time Students</li>
                  <li>150 percent Completion Rate (IPEDS)</li>
                  <li>200 percent Completion Rate (IPEDS)</li>
                  <li>Completion and Transfer Outcomes for Title IV Students, Disaggregated by Student Subgroups</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Earnings</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>One of the most common reasons students cite in choosing to go to college is the expansion of employment opportunities. To that end, data on the earnings and employment prospects of former students can provide key information. To measure the labor market outcomes of individuals attending institutions of higher education, data on cohorts of federally aided students were linked with earnings data from de-identified tax records and reported back at the aggregate, institutional level.</p>

                <ul>
                  <li>Average and Median Earnings, Disaggregated by Student Subgroups</li>
                  <li>Share of Former Students Earning Over $25,000</li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Program</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p><em>Content Needed</em></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" md="4" offset-md="1">
          <h2 class='display-1 mb-2'>API Documentation</h2>

          <p>
            The College Scorecard API is a GET API that lives at
            <span>http://api.data.gov/ed/collegescorecard/</span>
          </p>
          <p>
            The endpoint for querying all data is
            <span>/v1/schools</span>
          </p>
          <p class="data-docs">
            Developers may register for an API key at
            <a href="https://api.data.gov/signup" target="_blank">https://api.data.gov/signup</a>.
          </p>

          <h3 class='title'>Structure</h3>

          <!--<p>The basic structure of an API call is <span>year.dev-category.dev-friendly-variable-name</span>,-->
          <!--except that the <span>school</span> category has no year and <span>id</span>, <span>ope6_id</span>,-->
          <!--<span>ope8_id</span> and <span>location</span>-->
          <!--have no category or year.</p>-->
          <p>
            The basic structure of an API call is
            <span>year.dev-category.dev-friendly-variable-name</span>.
          </p>
          <ul>
            <li>
              The
              <span>year</span> may be any year of data available (example: 2012), or use the word
              <span>latest</span> to get the most recent data available from the API.
              Using the "latest" key will allow your application to access the new data as soon as it is released.
            </li>
            <li>
              The
              <strong>school</strong> category has no year.
            </li>
            <li>
              <span>id</span>,
              <span>ope6_id</span>,
              <span>ope8_id</span> and
              <span>location</span> have no category or year.
            </li>
          </ul>

          <p>All variables are listed in the Data Dictionary.</p>

          <p ><v-btn
              data-download
              rounded
              color="secondary"
              :href="baseUrl+'/assets/'+dataDictionary"
              class="button data-home-button"
            >Download the Data Dictionary</v-btn></p>

          <p class="data-docs">
            For guidance on querying the API and extracting results, see the
            <a
              href="https://github.com/RTICWDT/open-data-maker/blob/master/API.md"
              target="_blank"
            >HTTP API documentation</a>.
          </p>

          <h3 class='title'>Sample API Calls</h3>

          <h4 class='overline mt-4'>All Data for Boston College</h4>

          <ul>
            <li>
              <a
                target="_blank"
                href="https://api.data.gov/ed/collegescorecard/v1/schools?school.name=boston%20college"
              >api.data.gov/ed/collegescorecard/v1/schools?school.name=boston%20college</a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://api.data.gov/ed/collegescorecard/v1/schools?id=164924"
              >api.data.gov/ed/collegescorecard/v1/schools?id=164924</a>
            </li>
          </ul>

          <h4 class='overline mt-4'>Completion By Race/Ethnicity</h4>

          <ul>
            <li>
              <a
                target="_blank"
                href="https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,latest.student.demographics.race_ethnicity.white,latest.student.demographics.race_ethnicity.black,latest.student.demographics.race_ethnicity.hispanic,latest.student.demographics.race_ethnicity.asian,latest.student.demographics.race_ethnicity.aian,latest.student.demographics.race_ethnicity.nhpi,latest.student.demographics.race_ethnicity.two_or_more,latest.student.demographics.race_ethnicity.non_resident_alien,latest.student.demographics.race_ethnicity.unknown,latest.student.demographics.race_ethnicity.white_non_hispanic,latest.student.demographics.race_ethnicity.black_non_hispanic,latest.student.demographics.race_ethnicity.asian_pacific_islander&sort=latest.completion.rate_suppressed.overall:desc"
              >api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,&#8203;latest.student.demographics.race_ethnicity.white,&#8203;latest.student.demographics.race_ethnicity.black,&#8203;latest.student.demographics.race_ethnicity.hispanic,&#8203;latest.student.demographics.race_ethnicity.asian,&#8203;latest.student.demographics.race_ethnicity.aian,&#8203;latest.student.demographics.race_ethnicity.nhpi,&#8203;latest.student.demographics.race_ethnicity.two_or_more,&#8203;latest.student.demographics.race_ethnicity.non_resident_alien,&#8203;latest.student.demographics.race_ethnicity.unknown,&#8203;latest.student.demographics.race_ethnicity.white_non_hispanic,&#8203;latest.student.demographics.race_ethnicity.black_non_hispanic,&#8203;latest.student.demographics.race_ethnicity.asian_pacific_islander&#8203;&sort=latest.completion.rate_suppressed.overall:desc</a>
            </li>
          </ul>

          <h4 class='overline mt-4'>Debt, Earnings, and Repayment</h4>

          <ul>
            <li>
              <a
                href="https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,latest.aid.median_debt.completers.overall,latest.repayment.1_yr_repayment.completers,latest.earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings&page=100"
              >api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,&#8203;latest.aid.median_debt.completers.overall,&#8203;latest.repayment.1_yr_repayment.completers,&#8203;latest.earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings&#8203;&page=100</a>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import DataNavigation from 'components/vue/DataNavigation.vue';
export default {
  components:{
    'data-navigation': DataNavigation
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary"]
};
</script>