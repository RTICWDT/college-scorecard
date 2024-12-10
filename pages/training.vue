<template>
  <div class="bg-gray-50">
    <v-container>
      <v-row class="ml-2">
        <v-col cols="1" class="justify-end">
          <img
            src="~/assets/images/icon-Note.svg"
            alt="Note Icon"
            style="vertical-align: middle; float: right"
          />
        </v-col>
        <v-col cols="11">
          <p class="align-left text-left">
            CollegeScorecard.ed.gov/training provides information on colleges
            that provide Pell Grants
            <TooltipModal definition="pell-grant" class="mr-n4" style="position:relative; top: -5px; left: -10px;" />
            and that also have workforce programs approved by the Department
            of Labor. For the full list of colleges, click
            <a href="/">here</a>.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Top Splash and Search-->
  <div class="bg-primary-aqua">
    <v-container class="pt-12">
      <h1 class="text-center pb-6 mx-auto mt-3">
        Find the right training program for you.
      </h1>
      <v-row class="pb-8 my-4">
        <!-- Header Info -->


        <v-col cols="12" lg="6">
          <p class="mx-4 mx-md-16 font-weight-bold text-left">
            Training programs offered by colleges and universities may be a
            great way to develop new skills and get credentials that will help
            you advance your career. To decide where to enroll, you should
            consider the costs and benefits of different programs in relation
            to your interests and the job opportunities in your community.
          </p>
        </v-col>

        <v-col cols="12" lg="6">
          <p class="mx-4 mx-md-16 font-weight-bold text-left">
            The College Scorecard will help you compare programs that lead to
            certificates and degrees at colleges where you may be eligible to
            receive Pell Grants from the Department of Education, which
            provide up to $6,495 to cover tuition, fees, and living expenses.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex pb-10 pt-0">
          <v-card class="pa-4 pa-md-8">
            <v-container>
              <v-row align="center">
                <v-col cols="12" lg="6" md="12" sm="12">
                  <h3 class="text-left pb-5">
                    Search for schools with training programs
                  </h3>
                  <p class="px-0 px-md-8">
                    Search nearby schools that accept Pell Grants, and may
                    also have eligible training programs for participants in
                    Workforce Innovation and Opportunity Act (WIOA) programs.
                    If you need help taking the next step in your career, find
                    an
                    <a
                      href="https://www.careeronestop.org/LocalHelp/AmericanJobCenters/american-job-centers.aspx"
                      target="_blank"
                      @click="analytics.transitionOutboundLink($event)"
                    >
                      American Job Center
                      <v-icon size="x-small" icon="mdi-open-in-new" />
                    </a>.
                    In some states, Unemployment Insurance (UI) recipients
                    can attend school or training and continue to receive UI
                    benefits
                    (<a href="https://www.dol.gov/general/topic/ unemployment-insurance"target="_blank"@click="analytics.transitionOutboundLink($event)">learn more about UI benefits<v-icon size="x-small" icon="mdi-open-in-new" /></a>
                    in your state).
                  </p>
                </v-col>

                <v-col cols="12" lg="6" md="12" sm="12">
                  <div class="nearby-schools px-0 px-md-8 py-8 rounded-lg">
                    <div class="text-center justify-center">
                      <v-btn
                        size="large"
                        color="secondary-green"
                        @click="handleLocationCheck()"
                        :prepend-icon="location.isLoading ? 'fa:fas fa-circle-notch fa-spin' : 'mdi-map-marker'"
                      >
                        {{ location.isLoading ? 'Searching Schools' : location.error ? 'Location unavailable' : 'Search Nearby Schools'}}
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <div class="bg-primary-blue" style="margin-top: -220px; padding-top: 220px; padding-bottom: 220px;">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-sm-flex pb-10">
          <v-card class="pa-8" width="100%">
            <h3 class="text-center pb-4">
              Search for training programs by field of study
            </h3>
            <SearchFieldOfStudy v-model="input.cip4" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Bottom Content -->
  <div class="bg-primary-aqua">
    <div class="position-relative" style="bottom: 150px; margin-bottom: -110px;">
      <v-container>
        <v-row>
          <v-col>
            <v-card class="overflow-visible-override h-100 rounded-t-0">
              <div class="position-relative bg-blue-200" style="height: 70px;">
                <img
                  src="~/assets/images/Logo-Department-of-Labor.png"
                  alt="Department of Labor Icon"
                  class="banner-image position-absolute d-flex align-center justify-center bg-white rounded-circle elevation-2"
                />
              </div>

              <div class="pa-8">
                <h3 class="text-center mb-8 mt-4">Department of Labor WIOA Program</h3>
                <p class="mb-8 px-0 px-md-8">
                  Some training programs are eligible for funding through the
                  Workforce Innovation and Opportunity Act (WIOA), depending on
                  your state and local needs. Search all training programs that
                  are funded through WIOA on TrainingProviderResults.gov. This
                  Department of Labor tool provides key outcome data on WIOA
                  programs such as training completion, credential attainment,
                  employment and wages.
                </p>

                <p class="text-center mb-8">
                  <a
                    href="https://trainingproviderresults.gov"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    TrainingProviderResults.gov
                    <v-icon size="x-small" class="pl-1" icon="mdi-open-in-new" />
                  </a>
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col>
            <v-card class="overflow-visible-override h-100 rounded-t-0">
              <div class="position-relative bg-blue-200" style="height: 70px;">
                <div class="banner-image position-absolute d-flex align-center justify-center bg-white rounded-circle elevation-2">
                  <img
                    src='~assets/images/icon-Financial-Aid-training.svg'
                    alt="Financial Aid Icon"
                  />
                </div>
              </div>

              <div class="pa-8">
                <h3 class="text-center mb-8 mt-4">Get Started with Financial Aid</h3>
                <p class="mb-8 px-0 px-md-8">
                  To receive financial aid, you must complete the Free Application
                  for Federal Student Aid (FAFSA). You also may qualify for a Pell
                  Grant, which is a federal program that provides free money for
                  higher education. In order to see if you qualify for a Pell
                  Grant, you must submit a FAFSA. Use the
                  <a
                    href="https://studentaid.gov/aid-estimator/"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    Federal Student Aid Estimator
                    <v-icon size="x-small" icon="mdi-open-in-new" />
                  </a>
                  to see how much aid may be available for you.
                </p>

                <p class="text-center mb-8">
                  <v-btn
                    color="secondary-green"
                    href="https://studentaid.gov/h/apply-for-aid/fafsa"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    Start Your FAFSA&reg; Application
                    <v-icon x-smallcolor="white"class="pl-1" icon="mdi-open-in-new" />
                  </v-btn>
                </p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss">
.overflow-visible-override {
  overflow: visible !important;

  .banner-image {
    width: 138px;
    height: 138px;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
  }
}

.nearby-schools {
  background-color: use-theme("blue-100");
  
  @include xs {
    background-color: white;
  }
}
</style>

<script setup>
const analytics = useAnalytics();
const { location, handleLocationCheck } = useLocationCheck();
const input = reactive({ cip4: null })
const router = useRouter();

watch(() => location.latLon, (newValue) => {
  if (!newValue) return;

  const query = {
    lat: newValue.min_lat + ".." + newValue.max_lat,
    long: newValue.min_lon + ".." + newValue.max_lat,
    dolflag: true,
    distance: 50,
  }

  router.push({ name: 'search', query: query })
});

watch(() => input.cip4, (newValue) => {
  if (!newValue && newValue?.code) return;

  const query = {
    cip4: newValue.code.substring(0, 4),
    dolflag: true,
  }

  router.push({ name: 'search', query: query })
})

useHead({
  title: "Training Programs",
  meta: [
    {
      name: "description",
      property: "description",
      content: "Find the right training program for you. Search for schools with training programs and training programs by field of study.",
    },
  ],
});
</script>
