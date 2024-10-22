<template>
    <DocumentationCard title="API Documentation">
      <p class="mb-3">
        The College Scorecard API offers access to a wealth of data about
        U.S. higher education institutions. This API enables developers to
        query and retrieve information about schools, programs, costs,
        graduation rates, admissions, and much more. This documentation
        will guide you through the process of accessing and utilizing the
        College Scorecard API.
      </p>
      <ul>
        <li>
          <a @click="scrollToAnchor('getting-started')" href="#">Getting Started</a>
        </li>
        <li>
          <a @click="scrollToAnchor('basic-usage')" href="#">Basic Usage</a>
        </li>
        <li>
          <a @click="scrollToAnchor('response-format')" href="#">Response Format</a>
        </li>
        <li>
          <a @click="scrollToAnchor('error-handling')" href="#">Error Handling</a>
        </li>
        <li>
          <a @click="scrollToAnchor('field-parameters')" href="#">Field Parameters</a>
        </li>
        <li>
          <a @click="scrollToAnchor('advanced-usage')" href="#">Advanced Usage</a>
        </li>
        <li>
          <a @click="scrollToAnchor('rate-limits')" href="#">Rate Limits</a>
        </li>
      </ul>
      <h2 class="mb-2" id="getting-started">Getting Started</h2>
      <h3 class="mt-4">What Data is Available</h3>

      <p>
        The College Scorecard data is composed of two related datasets.
        The institution-level data represents the institution as a whole,
        while the field of study data describes specific fields of study
        at the institution. Details of the data available in the API can
        be found in the
        <a @click="analytics.trackDownload('CollegeScorecardDataDictionary.xlsx')" href="/files/CollegeScorecardDataDictionary.xlsx" target="_blank">Data Dictionary</a>.
        Additional context for the data elements can also be found in the documentation reports for
        <a @click="analytics.trackDownload('InstitutionDataDocumentation.pdf')" href="/files/InstitutionDataDocumentation.pdf" target="_blank">institution-level data</a>
        and
        <a @click="analytics.trackDownload('FieldOfStudyDataDocumentation.pdf')" href="/files/FieldOfStudyDataDocumentation.pdf" target="_blank">field of study data</a>.
      </p>
      <p>
        Depending on the variable, data may not be present across all
        years. The "cohort map" tabs in the
        <a @click="analytics.trackDownload('CollegeScorecardDataDictionary.xlsx')" href="/files/CollegeScorecardDataDictionary.xlsx" target="_blank">Data Dictionary</a>
        provide details about where you can expect to find data for a
        particular variable and what group of students (i.e., what cohort)
        it describes. The default for the API is provide the latest data
        available for all variables (i.e., the
        <code>latest</code> object). Since data are published at different
        times during the year, the latest data available for each metric
        may not come from the same year as other metrics. Data from
        specific years can be accessed by specifying a year instead of the
        <code>latest</code> object in your query. For example, the
        earnings data object from 2018 would be accessed by specifying
        <code>2018.earnings</code> instead of
        <code>latest.earnings</code>. An advantage of using the
        <code>latest</code> object is the data will automatically refresh
        when new data is released.
      </p>

      <h3 id="api-access-and-authentication"> API Access and Authentication</h3>
      <p>
        To use the College Scorecard API you must have an API key. An API
        key is a unique identifier that is used to authenticate data
        requests associated with your project. Keep your API key secure as
        it is required for all API requests.
      </p>

      <div class="mb-4">
        <p v-if="!isVerified">
          First, please complete the security challenge below.
        </p>

        <div v-if="breakpoints.mdAndUp.value">
          <RecaptchaCheckbox ref="recaptchaRef" size="normal" />
        </div>
        <div v-else>
          <RecaptchaCheckbox ref="recaptchaRef" size="compact" />
        </div>
      </div>

      <div>
        <v-fade-transition>
          <p v-show="isVerified">
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
          <div v-show="isVerified" id="apidatagov_signup" class="mb-2"></div>
        </v-fade-transition>
      </div>


      <!-- USAGE -->
      <h2 id="basic-usage">Basic Usage</h2>
      <h3 id="base-url">Base URL</h3>
      <p>All API requests are made to the following base URL:</p>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools</code></pre>

      <!-- STRUCTURE -->
      <h3 id="request-structure">Request Structure</h3>
      <p>
        API requests are made using HTTP GET requests. The basic structure
        of a request is as follows:
      </p>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;{parameters}</code></pre>

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

      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;school.name=Harvard University&amp;fields=id,school.name,latest.student.size</code></pre>

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
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&school.state=CA&page=1&per_page=10</code></pre>

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
        <a @click="analytics.trackDownload('CollegeScorecardDataDictionary.xlsx')" href="/files/CollegeScorecardDataDictionary.xlsx">data dictionary</a>. Sorting is only available on
        fields that have text populated in
        the <code>index</code> column of the respective data dictionary
        tabs.
      </p>

      <h2 id="response-format">Response Format</h2>
      <p>
        The API returns data in JSON format. A typical response includes
        metadata and results. Here’s an example of a response structure:
      </p>

      <pre><code>{{ responseFormatCode }}</code></pre>

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
      <pre><code>{{ errorResponseMessage }}</code></pre>



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

      <v-btn @click="analytics.trackDownload('CollegeScorecardDataDictionary.xlsx')" size="large" color="secondary-green" href="/files/CollegeScorecardDataDictionary.xlsx" class="button data-home-button mb-4">Download the Data
        Dictionary (.xlsx, 703 KB)
        <v-icon size="x-small" class="pl-1 ml-2" color="white">
          fas fa-download
        </v-icon>
      </v-btn>

      <h4 id="example-field-selection-request">
        Example Field Selection Request
      </h4>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&amp;fields=id,school.name,latest.cost.tuition.in_state,latest.completion.rate</code></pre>


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

      <h3 id="searching-for-schools-by-name">Searching for Schools by Name</h3>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&school.name=Stanford University</code></pre>

      <h3 id="filtering-schools-by-state-and-city">Filtering Schools by State and City</h3>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&school.state=NY&school.city=New York</code></pre>

      <h3 id="retrieving-specific-data-fields">Retrieving Specific Data Fields</h3>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&fields=id,school.name,latest.admissions.admission_rate.overall,latest.student.size</code></pre>

      <h3 id="paginated-requests">Paginated Requests</h3>
      <pre><code>https://api.data.gov/ed/collegescorecard/v1/schools?api_key=YOUR_API_KEY&school.state=TX&page=2&per_page=10</code></pre>


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
        other data. However, there is an additional parameter to add to
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
      <DocumentationHelp />
    </DocumentationCard>
</template>

<style scoped lang="scss">
pre {
  background-color: use-theme('gray-50');
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: scroll;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

code {
  word-wrap: break-all;
  background-color: use-theme('gray-50');
  font-size: 0.8rem;
}

li {
  margin-left: 2rem;
}

ul {
  margin-bottom: 1rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

h3 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

p { 
  margin-bottom: 1rem;
}
</style>

<script setup>
const analytics = useAnalytics()
const config = useRuntimeConfig()
const formSubmitted = ref(false)
const recaptchaRef = ref(null)
const isVerified = ref(false)
const { breakpoints } = useVuetify()

onMounted(() => {
  recaptchaRef.value.setOnSuccess((token) => {
    isVerified.value = true
    loadEmbeddedForm()
  })

  window.apiUmbrellaSignupOptions = {
    registrationSource: "college-scorecard",
    apiKey: config.public.recaptchaKey,
    contactUrl: "scorecarddata@rti.org",
    siteName: "College Scorecard",
    emailFromName: "College Scorecard",
    exampleApiUrl:
      "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=[api_key]", // To ignore curly braces
  }
})

const loadEmbeddedForm = () => {
  let apiUmbrella = document.createElement("script")
  apiUmbrella.type = "text/javascript"
  apiUmbrella.async = true
  apiUmbrella.src =
    "https://api.data.gov/static/javascripts/signup_embed.js"
    ; (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(apiUmbrella)

  if (callback) {
    apiUmbrella.onload = () => {
      document
        .querySelector("#api_umbrella_signup_form")
        .addEventListener("submit", () => formSubmitted.value = true)
    }
  }
}

const { scrollToAnchor } = useScroll()

const responseFormatCode = `{
  "metadata": {
    "total": 1,
    "page": 0,
    "per_page": 20
  },
  "results": [
    {
      "id": 166027,
      "school.name": "Harvard University",
      "latest.student.size": 31145
    }
  ]
}`

const errorResponseMessage = `{
  "error": {
    "code": 400,
    "message": "Invalid request parameters"
  }
}`

useHead({
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
})
</script>