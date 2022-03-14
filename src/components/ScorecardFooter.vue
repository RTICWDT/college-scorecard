<template>
  <div class="d-print-none">
    <v-footer
      class="d-block pl-md-12"
      inset
      app
      absolute
      height="125"
      color="#00365e"
    >
      <p class="pb-2 mt-5 mb-0 body-2 white--text">
        Powered by <a :href="$url('/data')">College Scorecard Data</a> |
        <a
          :href="
            $url(
              '/school/transition/?url=' +
                encodeURIComponent(
                  'https://github.com/RTICWDT/college-scorecard/releases'
                )
            )
          "
          target="_blank"
          >{{ version
          }}<v-icon x-small class="pl-1" color="white">
            fas fa-external-link-alt
          </v-icon>
        </a>
        | <a href="mailto:scorecarddata@rti.org">Contact Us</a> |
        <a
          :href="
            $url(
              '/school/transition/?url=' +
                encodeURIComponent(
                  'http://www2.ed.gov/notices/index.html?src=ft'
                )
            )
          "
          target="_blank"
          >Notices<v-icon x-small class="pl-1" color="white">
            fas fa-external-link-alt
          </v-icon>
        </a>
        | <a :href="$url('/data/glossary/')">Glossary</a> |
        <a
          :href="
            $url(
              '/school/transition/?url=' +
                encodeURIComponent('http://www.ed.gov/')
            )
          "
          target="_blank"
          >U.S. Department of Education<v-icon
            x-small
            class="pl-1"
            color="white"
          >
            fas fa-external-link-alt
          </v-icon>
        </a>
      </p>

      <!--<p class="py-0 body-2 white--text">
        ZIP Code latitude and longitude provided by
        <a :href="$url('/school/transition/?url=' + encodeURIComponent('http://www.geonames.org/'))">GeoNames<v-icon
            x-small
            class="pl-1"
            color="white"            
          >
            fas fa-external-link-alt
          </v-icon>        
        </a>
        under a Creative Commons Attribution 3.0 License.
      </p> -->
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

<script>
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"

export default {
  components: {
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  computed: {
    version() {
      return this.$static.metadata.version
    },
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
