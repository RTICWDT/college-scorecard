<template>
  <DocumentationCard title="Data Home">
    <p class="mb-4">
      Download the data that appear on the College Scorecard, as well as
      supporting data on student completion, debt and repayment,
      earnings, and more.
    </p>
    <p class="pb-4">
      This data was
      <strong>last updated June 13, 2024</strong>.
    </p>

    <h2 class="my-5">
      All Data Files
      <v-btn class="ml-2" color="secondary-green"
        href="https://ed-public-download.scorecard.network/downloads/College_Scorecard_Raw_Data_06102024.zip">Download
        (.zip, 390 MB)
        <v-icon right dark size="x-small" class="ml-2" icon="fa:fas fa-download"/>
        </v-btn>
    </h2>

    <ul class="font-weight-regular">
      <li>
        Institution-level data files for 1996-97 through 2022-23
        containing aggregate data for each institution. Includes
        information on institutional characteristics, enrollment,
        student aid, costs, and student outcomes.
      </li>
      <li>
        Field of study-level data files for the pooled 2014-15, 2015-16
        award years through the pooled 2018-19, 2019-20 award years
        containing data at the credential level and 4-digit CIP code
        combination for each institution. Includes information on
        cumulative debt at graduation and earnings one year after
        graduation.
      </li>
      <li>
        Crosswalk files for 2000-01 through 2022-23 that link the
        Department’s OPEID with an IPEDS UNITID for each institution.
      </li>
    </ul>
    <v-row>
      <v-col>
        <h4 class="my-5 d-inline-block">
          Most Recent Institution-Level Data
        </h4>
        <v-btn size="small" color="secondary-green" class="ml-0 ml-sm-2"
          href="https://ed-public-download.scorecard.network/downloads/Most-Recent-Cohorts-Institution_06102024.zip">Download
          (.zip, 22 MB)
          <v-icon right dark size="x-small" class="ml-2" icon="fa:fas fa-download"/>
        </v-btn>
      </v-col><v-col>
        <h4 class="my-5 d-inline-block">
          Most Recent Data by Field of Study
        </h4>
        <v-btn size="small" class="ml-0 ml-sm-2" color="secondary-green"
          href=" https://ed-public-download.scorecard.network/downloads/Most-Recent-Cohorts-Field-of-Study_06102024.zip">Download
          (.zip, 13 MB)
          <v-icon right dark size="x-small" class="ml-2" icon="fa:fas fa-download"/></v-btn>
      </v-col>
    </v-row>

    <DocumentationHelp />
  </DocumentationCard>
</template>

<script setup>
useHead({
  title: "Data Home",
  meta: [
    {
      name: "description",
      content:
        "Download institution-level and field-of-study-level data files directly from the College Scorecard. Available data goes as far back as 1997.",
    },
    {
      name: "keywords",
      content:
        "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, institution level data, field of study data, API, OPEID, IPEDS UNITID",
    },
  ],
})
</script>

<style scoped lang="scss">
li {
  margin-left: 2rem;
}
</style>
