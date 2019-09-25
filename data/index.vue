<template>
  <v-app>
    <div class="data-home-convo">
      <section class="container section">
        <aside class="data-home-intro-convo-right">
          <p>
            <strong>Join the Conversation:</strong>
            <a
              href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"
              target="_blank"
            >
              <i class="fa fa-stack-exchange"></i>StackExchange
            </a>
          </p>
        </aside>
      </section>
    </div>

    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <h2>Download the Data</h2>

          <p class="padded-bottom">
            Download the data that appear on the College Scorecard, as well as
            supporting data on student completion, debt and repayment, earnings,
            and more. The files include data from 1996 through 2017 for all
            undergraduate degree-granting institutions of higher education.
          </p>

          <p>
            This data was
            <strong>last updated August 26, 2019</strong>. Our
            <a :href="baseUrl+'/data/changelog/'">Change Log</a> describes the changes to the
            dataset over time.
          </p>

          <p>
            <v-btn
              rounded
              primary
              data-download
              :href="dataBase_url+'/CollegeScorecard_Raw_Data.zip'"
              class="btn"
            >
              <i class="material-icons left">cloud_download</i> Download All Data
            </v-btn>265 MB zip
          </p>

          <h3>Featured Downloads</h3>

          <p>
            These data downloads provide quick access to some of the data in which
            users may be most interested, including a file that offers the most
            current data for each element.
          </p>

          <ul class="data-download-list">
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-Scorecard-Elements.csv'"
              >Scorecard data</a> 8 MB CSV
            </li>
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-All-Data-Elements.csv'"
              >Most recent data</a> 143 MB CSV
            </li>
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-NSLDS-Elements.csv'"
              >What's new from NSLDS</a> 116 MB CSV
            </li>
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-Treasury-Elements.csv'"
              >Post-school earnings</a> 6 MB CSV
            </li>
          </ul>

          <hr />

          <div class="data-prelim">
            <h3>
              <i class="fa fa-warning"></i> Preliminary Data Downloads
              <i class="fa fa-warning"></i>
            </h3>
            <br />
            <ul class="data-download-list">
              <li>
                <a
                  data-download
                  :href="baseUrl +'/data/preliminary/'"
                >Preliminary Loan Debt Data by Field of Study</a>
              </li>
            </ul>
          </div>

          <hr />
        </v-col>
        <v-col md="4">
          <h2>Data Documentation</h2>

          <p>
            The College Scorecard is designed to increase transparency, putting
            the power in the hands of the public &mdash; from those choosing
            colleges to those improving college quality &mdash; to see how well
            different schools are serving their students. This documentation
            provides more on how to use the data and includes:
          </p>

          <ul class="u-unordered_list">
            <li>
              <a
                data-download
                :href="dataBase_url+'/assets/FullDataDocumentation.pdf'"
                target="_blank"
              >Documentation Report</a>
            </li>
            <li>
              <a
                data-download
                :href="dataBase_url+'/assets/'+dataDictionary"
                target="_blank"
              >Data Dictionary</a>
            </li>
            <li>
              <a :href="baseUrl+'/data/changelog/'">Change Log</a>
            </li>
            <li>API Documentation</li>
          </ul>

          <a :href="baseUrl+'/data/documentation/'" class="link-more">
            View Full Documentation
            <i class="fa fa-chevron-right"></i>
          </a>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <h2>Outside Organizations Collecting Voluntary Data</h2>
          <p>Some other organizations have recently launched efforts to collect more accurate data on college completion, remedial education and workforce outcomes.</p>
        </v-col>
        <v-col cols="12" md="4">
          <h2>Websites</h2>
          <ul class="data-download-list u-unordered_list">
            <li>
              <a href="http://www.studentachievementmeasure.org" target="_blank">
                Student Achievement Measure initiative
                <i class="fa fa-external-link"></i>
              </a>
            </li>
            <li>
              <a href="http://vfa.aacc.nche.edu/Pages/default.aspx" target="_blank">
                Voluntary Framework of Accountability initiative
                <i class="fa fa-external-link"></i>
              </a>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  props: ["baseUrl", "dataBase_url", "dataDictionary"]
};
</script>