<template>
  <v-main>
    <data-navigation :current="$url('/data/api/')" />
    <v-container class="px-0">
      <v-row>
        <v-col cols="12">
          <v-card flat class="py-5 px-10 ma-5">
            <h1 class="display-1 font-weight-bold pb-2">
              API Documentation
            </h1>
            <hr />
            <p>
              The College Scorecard API offers access to a wealth of data about
              U.S. higher education institutions. This API enables developers to
              query and retrieve information about schools, programs, costs,
              graduation rates, admissions, and much more. This documentation
              will guide you through the process of accessing and utilizing the
              College Scorecard API.
            </p>
            <ul>
              <li>
                <a @click="scroller('#getting-started')" href="#"
                  >Getting Started</a
                >
              </li>
              <li>
                <a @click="scroller('#basic-usage')" href="#">Basic Usage</a>
              </li>
              <li>
                <a @click="scroller('#response-format')" href="#"
                  >Response Format</a
                >
              </li>
              <li>
                <a @click="scroller('#error-handling')" href="#"
                  >Error Handling</a
                >
              </li>
              <li>
                <a @click="scroller('#field-parameters')" href="#"
                  >Field Parameters</a
                >
              </li>
              <li>
                <a @click="scroller('#advanced-usage')" href="#"
                  >Advanced Usage</a
                >
              </li>
              <li>
                <a @click="scroller('#rate-limits')" href="#">Rate Limits</a>
              </li>
            </ul>
            <h2 id="getting-started">Getting Started</h2>
            <h3 id="api-access-and-authentication">
              API Access and Authentication
            </h3>

            <p>
              To use the College Scorecard API you must have an API key. An API
              key is a unique identifier that is used to authenticate data
              requests associated with your project. Keep your API key secure as
              it is required for all API requests.
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
                  process and receive your API key. The key will be emailed to
                  you.
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

            <h2 id="basic-usage">Basic Usage</h2>
            <h3 id="base-url">Base URL</h3>
            <p>All API requests are made to the following base URL:</p>
            <code
              >https:<span class="hljs-regexp">//</span>api.data.gov<span
                class="hljs-regexp"
                >/ed/</span
              >collegescorecard<span class="hljs-regexp">/v1/</span>schools
            </code>

            <h3 id="request-structure">Request Structure</h3>
            <p>
              API requests are made using HTTP GET requests. The basic structure
              of a request is as follows:
            </p>
            <code
              >https:<span class="hljs-regexp">//</span>api.data.gov<span
                class="hljs-regexp"
                >/ed/</span
              >collegescorecard<span class="hljs-regexp">/v1/</span
              >schools?api_key=YOUR_API_KEY&amp;{parameters}
            </code>
            <h3 id="parameters">Parameters</h3>
            <p>
              The College Scorecard API accepts various parameters to filter and
              customize the data returned. Example parameters include:
            </p>
            <ul>
              <li>
                <code>school.name</code>: Filter by school name (e.g.,
                <code>school.name=Harvard University</code>).
              </li>
              <li>
                <code>school.state</code>: Filter by state (e.g.,
                <code>school.state=CA</code>).
              </li>
              <li>
                <code>school.city</code>: Filter by city (e.g.,
                <code>school.city=Boston</code>).
              </li>
              <li>
                <code>fields</code>: Specify which fields to include in the
                response (e.g.,
                <code>fields=id,school.name,latest.student.size</code>).
              </li>
            </ul>
            <h4 id="example-request">Example Request</h4>
            <code class="lang-http"
              >https://api.<span class="hljs-keyword">data</span
              >.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;school.<span
                class="hljs-keyword"
                >name</span
              >=Harvard University&amp;fields=id,school.<span
                class="hljs-keyword"
                >name</span
              >,latest.student.<span class="hljs-built_in">size</span>
            </code>
            <h3 id="pagination">Pagination</h3>
            <p>
              The API uses pagination to manage large datasets. Use the
              following parameters for pagination:
            </p>
            <ul>
              <li>
                <code>page</code>: Specify the page number (default is 0).
              </li>
              <li>
                <code>per_page</code>: Specify the number of results per page
                (default is 20, maximum is 100).
              </li>
            </ul>
            <h4 id="example-paginated-request">Example Paginated Request</h4>
            <code class="lang-http"
              >https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;school.<span
                class="hljs-keyword"
                >state</span
              >=CA&amp;page=<span class="hljs-number">1</span
              >&amp;per_page=<span class="hljs-number">10</span>
            </code>

            <h3 id="sorting-with-sort-">Sorting</h3>
            <p>
              To sort results by a given field, use the <code>sort</code> option
              parameter. For example, <code>sort=latest.student.size</code> will
              return records sorted by student size, in ascending order.
            </p>
            <p>
              By default, using the <code>sort</code> option returns records
              sorted into ascending order, but you can specify ascending or
              descending order by appending <code>:asc</code> or
              <code>:desc</code> to the field name. For example:
              <code>sort=latest.student.size:desc</code>
            </p>
            <p>
              <strong>Note:</strong> Sorting is only available on specific
              fields. Make sure the sort parameter is a field in the data set.
              For more information, please take a look at
              <a
                href="https://collegescorecard.ed.gov/assets/CollegeScorecardDataDictionary.xlsx"
                >data dictionary</a
              >. Sorting is only available on fields that have text populated in
              the <code>index</code> column of the respective data dictionary
              tabs.
            </p>

            <h2 id="response-format">Response Format</h2>
            <p>
              The API returns data in JSON format. A typical response includes
              metadata and results. Here’s an example of a response structure:
            </p>
            <pre><code class="lang-json">{
  <span class="hljs-attr">"metadata"</span>: {
    <span class="hljs-attr">"total"</span>: <span class="hljs-number">1</span>,
    <span class="hljs-attr">"page"</span>: <span class="hljs-number">0</span>,
    <span class="hljs-attr">"per_page"</span>: <span class="hljs-number">20</span>
  },
  <span class="hljs-attr">"results"</span>: [
    {
      <span class="hljs-attr">"id"</span>: <span class="hljs-number">166027</span>,
      <span class="hljs-attr">"school.name"</span>: <span class="hljs-string">"Harvard University"</span>,
      <span class="hljs-attr">"latest.student.size"</span>: <span class="hljs-number">31145</span>
    }
  ]
}
</code></pre>
            <h2 id="error-handling">Error Handling</h2>
            <p>
              If your request fails, the API will return an error message.
              Common error codes include:
            </p>
            <ul>
              <li>
                <code>400 Bad Request</code>: The request was invalid. Check
                your parameters.
              </li>
              <li>
                <code>401 Unauthorized</code>: Your API key is missing or
                invalid.
              </li>
              <li>
                <code>403 Forbidden</code>: You do not have access to the
                requested resource.
              </li>
              <li>
                <code>404 Not Found</code>: The requested resource could not be
                found.
              </li>
              <li>
                <code>500 Internal Server Error</code>: An error occurred on the
                server side.
              </li>
            </ul>
            <h3 id="example-error-response">Example Error Response</h3>
            <pre><code class="lang-json">{
  <span class="hljs-attr">"error"</span>: {
    <span class="hljs-attr">"code"</span>: <span class="hljs-number">400</span>,
    <span class="hljs-attr">"message"</span>: <span class="hljs-string">"Invalid request parameters"</span>
  }
}
</code></pre>

            <h2 id="field-parameters">Field Parameters</h2>
            <p>
              The <code>fields</code> parameter allows you to specify which data
              fields you want to include in the response. This helps minimize
              the amount of data transferred and makes parsing responses easier.
            </p>
            <p>
              All variables are listed in the Data Dictionary and are a
              combination of the <code>dev-category</code> and
              <code>developer-friendly name</code>
              columns. This parameter takes a comma-separated list of field
              names. For example:
              <code>fields=id,school.name,school.state</code> will return result
              records that only contain those three fields.
            </p>

            <v-btn
              @click="trackDownload('CollegeScorecardDataDictionary.xlsx')"
              large
              color="secondary"
              href="/assets/CollegeScorecardDataDictionary.xlsx"
              class="button data-home-button mb-4"
              >Download the Data Dictionary (.xlsx, 703 KB)
              <v-icon x-small class="pl-1" color="white">
                fas fa-download
              </v-icon>
            </v-btn>

            <h4 id="example-field-selection-request">
              Example Field Selection Request
            </h4>
            <code class="lang-http"
              >https:<span class="hljs-regexp">//</span>api.data.gov<span
                class="hljs-regexp"
                >/ed/</span
              >collegescorecard<span class="hljs-regexp">/v1/</span
              >schools?api_key=YOUR_API_KEY&amp;fields=id,school.name,latest.cost.tuition.in_state,latest.completion.rate
            </code>

            <p>
              Wildcard fields are also available. These allow you to return
              child objects of data without specifying each variable. For
              example. if you want to get the latest available data, it is
              possible to specify a query such as
              <code>fields=id,school,latest</code> which will return the ID
              field, the School object and the Latest object with all the nested
              objects contained within each category.
            </p>
            <p>
              When specifying specific fields to be returned from the API, the
              default response is to have a dotted string of the path to the
              field returned. You can also append the parameter
              <code>keys_nested=true</code> get back true json objects instead
              of an object of dotted strings.
            </p>

            <h2 id="common-use-cases">Common Use Cases</h2>
            <h3 id="searching-for-schools-by-name">
              Searching for Schools by Name
            </h3>
            <code class="lang-http"
              >https:<span class="hljs-regexp">//</span>api.data.gov<span
                class="hljs-regexp"
                >/ed/</span
              >collegescorecard<span class="hljs-regexp">/v1/</span
              >schools?api_key=YOUR_API_KEY&amp;school.name=Stanford University
            </code>
            <h3 id="filtering-schools-by-state-and-city">
              Filtering Schools by State and City
            </h3>
            <code class="lang-http"
              >https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;school.<span
                class="hljs-keyword"
                >state</span
              >=NY&amp;school.city=New York
            </code>
            <h3 id="retrieving-specific-data-fields">
              Retrieving Specific Data Fields
            </h3>
            <code class="lang-http"
              >https:<span class="hljs-regexp">//</span>api.data.gov<span
                class="hljs-regexp"
                >/ed/</span
              >collegescorecard<span class="hljs-regexp">/v1/</span
              >schools?api_key=YOUR_API_KEY&amp;fields=id,school.name,latest.admissions.admission_rate.overall,latest.student.size
            </code>
            <h3 id="paginated-requests">Paginated Requests</h3>
            <code class="lang-http"
              >https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;school.<span
                class="hljs-keyword"
                >state</span
              >=TX&amp;page=<span class="hljs-number">2</span
              >&amp;per_page=<span class="hljs-number">10</span>
            </code>

            <h2 id="advanced-usage">Advanced Usage</h2>

            <h3 id="value-lists">Value Lists</h3>
            <p>
              To filter by a set of strings or integers you can provide a
              comma-separated list of values. This will query the field for an
              exact match with
              <em>any</em> of the supplied values.
            </p>
            <p>
              For example:
              <code>school.degrees_awarded.predominant=2,3,4</code> will match
              records with a
              <code>school.degrees_awarded.predominant</code> value of
              <code>2</code>, <code>3</code> or <code>4</code>.
            </p>
            <p>
              <strong>Note:</strong> Value lists with wildcards or
              floating-point numbers are not currently supported.
            </p>
            <h3 id="negative-matches-with-the-__not-operator">
              Negative matches with the <code>__not</code> operator
            </h3>
            <p>
              To exclude a set of records from results, use a negative match
              (also known as an inverted match). Append the characters
              <code>__not</code> to the parameter name to specify a negative
              match.
            </p>
            <p>
              For example: <code>school.region_id__not=5</code> matches on
              records where the <code>school.region_id</code> does
              <em>not</em> equal <code>5</code>.
            </p>
            <h3 id="range-matches-with-the-__range-operator">
              Range matches with the <code>__range</code> operator
            </h3>
            <p>
              To match on field values in a particular numeric range, use a
              range match. Append the characters <code>__range</code> to the
              parameter name to specify a range match, and provide two numbers
              separated by two periods (<code>..</code>).
            </p>
            <p>
              For example:
              <code>2013.student.size__range=100..500</code> matches on schools
              which had between 100 and 500 students in 2013.
            </p>
            <p>
              Open-ended ranges can be performed by omitting one side of the
              range. For example:
              <code>2013.student.size__range=1000..</code> matches on schools
              which had over 1000 students.
            </p>
            <h4 id="additional-notes-on-ranges">Additional Notes on Ranges</h4>
            <ul>
              <li>Both integer and floating-point ranges are supported.</li>
              <li>
                The left-hand number in a range must be lower than the
                right-hand number.
              </li>
              <li>
                Ranges are inclusive. For example, the range
                <code>3..7</code> matches both <code>3</code> and
                <code>7</code>, as well as the numbers in between.
              </li>
            </ul>

            <h3 id="geographic-filtering-with-zip-and-distance-">
              Geographic Filtering with <code>zip</code> and
              <code>distance</code>
            </h3>
            <p>
              When the dataset includes a <code>location</code> at the root
              level (<code>location.lat</code> and <code>location.lon</code>)
              then the documents will be indexed geographically. You can use the
              <code>zip</code> and <code>distance</code> options to narrow query
              results down to those within a geographic area. For example,
              <code>zip=12345&amp;distance=10mi</code> will return only those
              results within 10 miles of the center of the given zip code.
            </p>
            <p>
              Additionally, you can request <code>location.lat</code> and
              <code>location.lon</code> in a search that includes a
              <code>fields</code> filter and it will return the record(s) with
              respective lat and/or lon coordinates.
            </p>
            <h4 id="additional-notes-on-geographic-filtering">
              Additional Notes on Geographic Filtering
            </h4>
            <ul>
              <li>
                By default, any number passed in the
                <code>distance</code> parameter is treated as a number of miles,
                but you can specify miles or kilometers by appending
                <code>mi</code> or <code>km</code> respectively.
              </li>
              <li>
                Distances are calculated from the center of the given zip code,
                not the boundary.
              </li>
              <li>Only U.S. zip codes are supported.</li>
            </ul>

            <h3>Nesting Field of Study Results</h3>
            <p>
              The field of study data is included as an array of objects nested
              under a specified key. These objects may be queried just like any
              other data. However, there is an additional parameters to add to
              your API call to manage what is returned. By default, if
              specifying a search parameter, only objects of the array that
              match that parameter will be returned. You can pass
              <code>&amp;all_programs_nested=true</code> to return all the items
              in the array instead of just those that match.
            </p>

            <h2 id="rate-limits">Rate Limits</h2>
            <p>
              The API enforces rate limiting to ensure fair usage. If you exceed
              the allowed number of requests, you will receive a
              <code>429 Too Many Requests</code> response. The default rate
              limit is <strong>1,000 requests per IP address per hour</strong>.
              If you find that you are running into rate limit issues and would
              like to request an increase, please contact
              <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a>.
            </p>
            <hr />
            <p class="mt-3">
              <strong>Looking for help?</strong> Visit
              <a
                href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"
                @click="transitionOutboundLink($event)"
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
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
h2 {
  margin-top: 3rem;
  margin-bottom: 0.5rem;
  scroll-margin-top: 5rem;
}
h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  scroll-margin-top: 5rem;
}
h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  scroll-margin-top: 5rem;
}
code {
  word-wrap: break-all;
}
</style>

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
    scroller(element) {
      this.$nextTick(() => {
        var topOfElement = document.querySelector(element).offsetTop + 60
        window.scroll({ top: topOfElement, behavior: "smooth" })
      })
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
    title: "College Scorecard API",
    meta: [
      {
        name: "description",
        content:
          "Technical documentation provides in-depth information about institution-level and field-of-study-level data files.",
      },
      {
        name: "keywords",
        content:
          "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, institution level data, field of study data, API, OPEID, IPEDS UNITID",
      },
    ],
  },
}
</script>
