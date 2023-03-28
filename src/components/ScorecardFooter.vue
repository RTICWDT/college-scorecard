<template>
  <div class="d-print-none">
    <v-footer
      class="d-block pl-md-12 white--text"
      inset
      app
      absolute
      :height="$vuetify.breakpoint.smAndDown ? 300 : 250"
      color="#10274E"
    >
      <v-container class="py-8">
        <v-row>
          <v-col>
            <ul class="d-md-flex justify-space-between  ma-0 pa-0">
              <li>
                <a
                  :href="$url('/')"
                  :class="{ 'nav-active': activeLink === '/' }"
                  >Home</a
                >
              </li>

              <li>
                <a
                  :href="$url('/data')"
                  :class="{ 'nav-active': activeLink === 'data' }"
                  >About the Data</a
                >
              </li>

              <li>
                <a
                  :href="$url('/search')"
                  :class="{ 'nav-active': activeLink === 'search' }"
                  >Search</a
                >
              </li>

              <li>
                <a
                  :class="{
                    'nav-active': activeLink === 'compare',
                  }"
                  :href="$url('/compare')"
                  aria-label="Navigate to compare page"
                  @click="handleCompareLinkClick(`/compare`)"
                  >Compare</a
                >
              </li>

              <li></li>
            </ul>
          </v-col>
          <v-col>
            <div class="float-right">
            <p class="mb-0">
              <small>
                Powered by <a :href="$url('/data')">College Scorecard Data</a>
              </small>
            </p>
            <p class="mb-0">
              <small>
                <a
                  href="https://github.com/RTICWDT/college-scorecard/releases"
                  target="_blank"
                  @click="
                    trackOutboundLink(
                      $event,
                    )
                  "
                  >{{ version }}
                  <v-icon x-small class="pl-1" color="white">
                    fas fa-external-link-alt
                  </v-icon>
                </a>
                | <a href="mailto:scorecarddata@rti.org">Contact Us</a> |
                <a
                  href="http://www2.ed.gov/notices/index.html?src=ft"
                  target="_blank"
                  @click="
                    trackOutboundLink(
                      $event,
                    )
                  "
                  >Notices<v-icon x-small class="pl-1" color="white">
                    fas fa-external-link-alt
                  </v-icon>
                </a>
                | <a :href="$url('/data/glossary/')">Glossary</a>
              </small>
            </p>
            <p>
              <small>
                <a
                  href="http://www.ed.gov/"
                  @click="trackOutboundLink($event)"
                  target="_blank"
                  >U.S. Department of Education<v-icon
                    x-small
                    class="pl-1"
                    color="white"
                  >
                    fas fa-external-link-alt
                  </v-icon>
                </a></small
              >
            </p>
          </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <client-only>
      <compare-header app />
      <v-bottom-sheet
        id="compare-modal"
        v-model="$store.state.drawerOpen"
        inset
      >
        <compare-drawer :show-info-text="false"></compare-drawer>
      </v-bottom-sheet>
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";

li {
  list-style-type: none;
}
a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>

<script>
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"

export default {
  mixins: [AnalyticsEvents],
  components: {
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  computed: {
    version() {
      return this.$static.metadata.version
    },
  },
  watch: {
    $route() {
      this.setActiveLink()
    },
  },
  methods: {
    setActiveLink() {
      let path = process.isClient ? window.location.pathname : ""
      if (path.match(/search/)) {
        this.activeLink = "search"
      } else if (path.match(/compare/)) {
        this.activeLink = "compare"
      } else if (path.match(/data/)) {
        this.activeLink = "data"
      } else if (path.match(/school/)) {
        this.activeLink = null
      } else if (path.match(/\//)) {
        this.activeLink = "/"
      } else {
        this.activeLink = null
      }
    },
  },
  created() {
    this.setActiveLink()
  },
}
</script>

<static-query>
query {
  metadata {
    version
  }
}
</static-query>
