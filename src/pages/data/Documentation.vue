<template>
  <v-main>
    <data-navigation :current="$url('/data/documentation/')" />
    <v-container class="px-0">
      <v-row>
        <v-col cols="12">
          <v-card flat class="py-5 px-10 ma-5">
            <h1 class="display-1 font-weight-bold pb-2">
              Data Documentation
            </h1>
            <hr />
            <p>
              College Scorecard provides data at the institution-level and data
              by field of study. The technical data documents provide in-depth
              information about these data. The data dictionary includes
              separate worksheets with institution-level and field of study
              dictionaries as well as cohort maps describing the timing aspects
              of each data element.
            </p>
            <div class="">
              <v-row>
                <v-col>
                  <v-btn
                    color="secondary"
                    @click="
                      trackDownload('CollegeScorecardDataDictionary.xlsx')
                    "
                    :href="$url('/assets/CollegeScorecardDataDictionary.xlsx')"
                    target="_blank"
                    large
                    class="my-3"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-download
                    </v-icon>
                    Data Dictionary (.xlsx, 703 KB)
                  </v-btn>
                </v-col></v-row
              >
              <v-row>
                <v-col>
                  <h2>Technical Documentation</h2>
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col>
                  <v-btn
                    color="secondary"
                    @click="trackDownload('InstitutionDataDocumentation.pdf')"
                    :href="$url('/assets/InstitutionDataDocumentation.pdf')"
                    target="_blank"
                    text
                    outlined
                    class="mb-3 mr-2"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-file-pdf
                    </v-icon>
                    Institution-Level Data Files (.pdf, 520 KB)
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="trackDownload('FieldOfStudyDataDocumentation.pdf')"
                    :href="$url('/assets/FieldOfStudyDataDocumentation.pdf')"
                    target="_blank"
                    text
                    outlined
                    class="mb-3"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-file-pdf
                    </v-icon>
                    Field of Study Data Files (.pdf, 827 KB)
                  </v-btn>
                </v-col></v-row
              >
            </div>
            <p class="mt-3">
              <strong>Looking for help?</strong> Visit
              <a
                href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"
                @click="
                  transitionOutboundLink(
                    $event,
                    
                  )
                "
                target="_blank"
                >StackExchange<v-icon x-small class="pl-1" color="#007000">
                  fas fa-external-link-alt
                </v-icon>
              </a>
              or email the help desk at
              <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a>.
              For inquiries by members of the press, please contact
              <a href="mailto:press@ed.gov">press@ed.gov</a>.
            </p>
          </v-card>
          <v-card flat class="py-5 px-10 ma-5">
            <h2 class="display-1 font-weight-bold mb-2 mt-5">
              API Documentation
            </h2>
            <hr />

            <p>
              The College Scorecard API is a GET API that lives at
              <strong>http://api.data.gov/ed/collegescorecard/</strong>. The
              endpoint for querying all data is <strong>/v1/schools</strong>.
              Developers may register for an API key at
              <a
                href="https://api.data.gov/signup"
                target="_blank"
                @click="
                  transitionOutboundLink($event)
                "
                >https://api.data.gov/signup<v-icon
                  x-small
                  class="pl-1"
                  color="#007000"
                >
                  fas fa-external-link-alt
                </v-icon>
              </a>
              or by completing the form
              <a href="#api-key-signup">below.</a>
            </p>

            <h3>Structure</h3>

            <p>
              The basic structure of an API call is
              <span>year.dev-category.dev-friendly-variable-name</span>.
            </p>
            <ul class="my-3">
              <li>
                The
                <span>year</span> may be any year of data available (example:
                2012), or use the word <span>latest</span> to get the most
                recent data available from the API. Using the "latest" key will
                allow your application to access the new data as soon as it is
                released.
              </li>
              <li>
                The
                <strong>school</strong> category has no year.
              </li>
              <li>
                <span>id</span>, <span>ope6_id</span>, <span>ope8_id</span> and
                <span>location</span> have no category or year.
              </li>
            </ul>

            <p>All variables are listed in the Data Dictionary.</p>

            <v-btn
              @click="trackDownload('CollegeScorecardDataDictionary.xlsx')"
              large
              color="secondary"
              href="/assets/CollegeScorecardDataDictionary.xlsx"
              class="button data-home-button mb-4"
              >Download the Data Dictionary
              <v-icon x-small class="pl-1" color="white">
                fas fa-download
              </v-icon>
            </v-btn>

            <h3 id="api-key-signup">Register for an API key</h3>
            <p>
              To use the College Scorecard API you must have an API key. An API
              key is a unique identifier that is used to authenticate data
              requests associated with your project.
            </p>

            <div>
              <p>
                First, please complete the security challenge below.
                <v-scroll-x-transition>
                  <v-icon v-if="!showCaptcha" size="medium" color="success">
                    mdi-check
                  </v-icon>
                </v-scroll-x-transition>
              </p>

              <p class="d-none d-sm-block">
                <vue-recaptcha
                  ref="recapcha"
                  v-show="showCaptcha"
                  :sitekey="recaptchaSiteKey"
                  @verify="onCaptchaVerify"
                  v-on:render="addAria"
                >
                </vue-recaptcha>
              </p>

              <!-- Compact on XS -->
              <p class="d-block d-sm-none">
                <vue-recaptcha
                  ref="recapcha"
                  v-show="showCaptcha"
                  :sitekey="recaptchaSiteKey"
                  @verify="onCaptchaVerify"
                  size="compact"
                  v-on:render="addAria"
                >
                </vue-recaptcha>
              </p>
            </div>

            <div>
              <v-fade-transition>
                <p v-show="!showCaptcha">
                  Second, use the form below to complete the registration
                  process and receive your API key.
                  <v-scroll-x-transition>
                    <v-icon v-if="formSubmitted" size="medium" color="success">
                      mdi-check
                    </v-icon>
                  </v-scroll-x-transition>
                </p>
              </v-fade-transition>

              <v-fade-transition>
                <!-- Form Holder -->
                <div
                  v-show="!showCaptcha"
                  id="apidatagov_signup"
                  class="mb-2"
                ></div>
              </v-fade-transition>
            </div>

            <p class="data-docs">
              For guidance on querying the API and extracting results, see the
              <a
                href="https://github.com/RTICWDT/open-data-maker/blob/master/API.md"
                target="_blank"
                @click="
                  transitionOutboundLink(
                    $event
                  )
                "
                >HTTP API documentation<v-icon
                  x-small
                  class="pl-1"
                  color="#007000"
                >
                  fas fa-external-link-alt
                </v-icon> </a
              >.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DataNavigation from "~/components/DataNavigation.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import VueRecaptcha from "vue-recaptcha"

export default {
  mixins: [AnalyticsEvents],
  components: {
    "data-navigation": DataNavigation,
    VueRecaptcha,
  },
  data() {
    return {
      showCaptcha: true,
      formSubmitted: false,
    }
  },
  computed: {
    recaptchaSiteKey() {
      return process.env.GRIDSOME_RECAPTCHA_KEY
    },
  },
  methods: {
    onCaptchaVerify() {
      this.showCaptcha = false
      this.loadEmbeddedForm(this.addFormSubmitListener)
    },
    loadEmbeddedForm(callback = null) {
      let apiUmbrella = document.createElement("script")
      apiUmbrella.type = "text/javascript"
      apiUmbrella.async = true
      apiUmbrella.src =
        "https://api.data.gov/static/javascripts/signup_embed.js"
      ;(
        document.getElementsByTagName("head")[0] ||
        document.getElementsByTagName("body")[0]
      ).appendChild(apiUmbrella)

      if (callback) {
        apiUmbrella.onload = () => callback()
      }
    },
    addFormSubmitListener() {
      let apiForm = document.querySelector("#apidatagov_signup_form")
      apiForm.addEventListener("submit", () => {
        // Listen for form submit and do whatever is needed
        this.formSubmitted = true
      })
    },
    addAria(id) {
      let r = document.body.querySelector("#g-recaptcha-response")
      if (id == 0 && r) r.setAttribute("aria-label", "ReCAPTCHA Response")
      else {
        let rs = "#g-recaptcha-response-" + id
        r = document.body.querySelector(rs)
        if (r) r.setAttribute("aria-label", "ReCAPTCHA Response")
        if (id % 2 == 1) {
          let iframes = document.body.querySelector("iframe")
          for (let q = 0; q < iframes.length; q++) {
            iframes[q].setAttribute("title", "ReCAPTCHA Frame")
          }
        }
      }
    },
  },
  mounted() {
    // Ran into an issue with script timing on IE11, created errors. Adding a script here fixes the problem
    let recaptchaScript = document.createElement("script")
    recaptchaScript.setAttribute(
      "src",
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
    )
    recaptchaScript.async = true
    recaptchaScript.defer = true
    document.head.appendChild(recaptchaScript)

    window.apiUmbrellaSignupOptions = {
      registrationSource: "college-scorecard",
      apiKey: process.env.GRIDSOME_API_SIGNUP_KEY,
      contactUrl: "scorecarddata@rti.org",
      siteName: "College Scorecard",
      emailFromName: "College Scorecard",
      exampleApiUrl:
        "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=[api_key]", // To ignore curly braces
    }
  },
  metaInfo: {
    title: "Documentation",
  },
}
</script>
