<template>
  <div>
    <v-footer
      class="d-block pl-md-12"
      inset
      app
      absolute
      height="100"
      color="#0e365b"
    >
      <p class="pb-2 mt-5 mb-0 body-2 white--text">
        Powered by <a href="/data/">College Scorecard Data</a> |
        <a
          href="https://github.com/RTICWDT/college-scorecard/releases"
          target="_blank"
          >{{ version }}</a
        >
        | <a href="mailto:scorecarddata@rti.org">Contact Us</a> |
        <a href="http://www2.ed.gov/notices/index.html?src=ft" target="_blank"
          >Notices</a
        >
        | <a href="/data/glossary/">Glossary</a> |
        <a href="http://www.ed.gov/" target="_blank"
          >U.S. Department of Education</a
        >
      </p>

      <p class="py-0 body-2 white--text">
        ZIP Code latitude and longitude provided by
        <a href="http://www.geonames.org/">GeoNames</a>
        under a Creative Commons Attribution 3.0 License.
      </p>
    </v-footer>
  </div>
</template>

<script>
export default {
  computed: {
    version() {
      return window.scorecard_version
    },
  },
}
</script>
