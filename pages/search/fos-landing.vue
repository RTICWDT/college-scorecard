<style lang="scss" scoped>
h1 {
  font-size: 50px;
  text-transform: none;
}
.v-card {
  height: 100%;
}
.home-title {
  @include mdAndDown {
    font-size: 40px;
    margin-bottom: 10px;
  }
}
.home-splash {
  background-color: use-theme('primary-blue') !important;
}
.home-links {
  background-color: use-theme('gray-100');
  
}
.homepage-search-container {
  box-shadow: 0px 10px 16px #0000001a !important;
  border-radius: 0px 6px 6px 6px;
}
.tab-card {
  border: none;
}
</style>

<template>
  <div class="home-splash">
    <v-container class="pt-10 pb-14">
      <v-row class="mb-5 mb-sm-0">
        <v-col cols="12">
          <h1 style="color: white" class="home-title">
            Search Fields of Study
          </h1>

          <p style="color: white">
            Search and compare the fields of study offered at each college
            by degree type.
          </p>
        </v-col>
      </v-row>

      <v-row class="pb-0 mt-2 d-none d-sm-flex">
        <v-col class="pb-0" cols="12" sm="5"><label class="d-block text-white" for="fosSearch">Search Fields of Study (Required)</label></v-col>
        <v-col class="pb-0" cols="12" sm="5"><label class="d-block text-white" for="fosDegree">Select Degree Type (Required)</label></v-col>
      </v-row>
      <v-row class="d-none d-sm-flex">
        <v-col cols="12" sm="5">
          <SearchFieldOfStudy v-model="input.cip4" variant="home" />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            :items="fosDegrees"
            item-title="label"
            item-value="value"
            variant="outlined"
            placeholder="Select one"
            v-model="input.cip4_degree"
            hide-details
            id="fosDegree"
            bgColor="white"
            aria-required="true"
            class="fos-search-degree-large"
          >
            <template #item="{ props, item }">
              <v-list-item v-if="item.raw.disabled" :disabled="true" style="opacity: 1" v-bind="props">
                <template #title>
                  <span style="font-weight: 800; font-size: 12px; letter-spacing: 0.8px;">{{ item.title }}</span>
                </template>
              </v-list-item>
              <v-list-item v-else v-bind="props">
                <template #title>
                  <span style="font-size: 16px;">{{ item.title }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>

        <v-col cols="1" sm="3" class="">
          <v-btn 
            @click="handleFormSubmit"
            width="100%" 
            size="x-large" 
            :color="fosColor"
            :disabled="disableSearch"
            class="font-weight-bold "
            :height="70"
          >
            SEARCH
          </v-btn>
        </v-col>
      </v-row>

      <div class="mb-2 d-block d-sm-none">
        <div class="bg-white pa-6" style="border-radius: 8px;">
          <span class="home-mobile-search-title"><strong>Search Fields of Study</strong></span>
          <div>
            <div cols="12" sm="5">
              <Spacer :height="10" />
              <SearchFieldOfStudy v-model="input.cip4" variant="default" />
            </div>
            <div cols="12" sm="4">
              <label class="d-block mb-2 mt-4" for="fosDegree">Select Degree Type (Required)</label>
              <v-select
                :items="fosDegrees"
                item-title="label"
                item-value="value"
                variant="outlined"
                placeholder="Select one"
                v-model="input.cip4_degree"
                hide-details
                id="fosDegree"
                aria-required="true"
              >
                <template #item="{ props, item }">
                  <v-list-item v-if="item.raw.disabled" :disabled="true" style="opacity: 1" v-bind="props">
                    <template #title>
                      <span style="font-weight: 800; font-size: 12px; letter-spacing: 0.8px;">{{ item.title }}</span>
                    </template>
                  </v-list-item>
                  <v-list-item v-else v-bind="props">
                    <template #title>
                      <span style="font-size: 16px;">{{ item.title }}</span>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </div>
            <div>
              <div class="d-none d-sm-block" style="height: 32px">
                &nbsp;
              </div>
              <v-btn
                @click="handleFormSubmit"
                width="100%"
                size="x-large"
                :color="fosColor"
                :disabled="disableSearch"
                class="mt-5"
              >
                Search
                <v-icon>mdi-menu-right</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>

  <!-- Bottom Content -->
  <div class="home-links mb-sm-15">
    <v-container class="mt-md-8">
      <v-row class="align-stretch">
        <v-col cols="12" md="6" class="pr-md-8 pt-8 pt-sm-0">
          <v-card flat class="pa-8">
            <h2 class="text-h4 d-flex justify-space-between align-center">
              What are Fields of Study?
            </h2>
            <hr />
            <p>
              Fields of study are areas of academic concentration, or a
              discipline. Often known as majors, or programs.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" sm="12" class="pl-md-8 pt-sm-0">
          <v-card flat class="pa-8">
            <h2 class="text-h4 d-flex justify-space-between align-center">
              Explore Fields of Study
            </h2>
            <hr />
            <p>
              College Scorecard's Field of Study search allows you to
              explore the subject areas of Certificate, Associate's,
              Bachelor's, and even advanced degrees offered at colleges all
              over the United States. Use College Scorecard to compare
              costs, earnings, and debt burdens between fields of study.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const { formMappings } = useConstants()
const router = useRouter()

const input = reactive({
  cip4: null,
  cip4_degree: null,
})

const fosDegrees = computed(() => {
  let degrees = [...formMappings.fosDegrees]
  // degrees.unshift({ label: 'UNDERGRADUATE', value: "undergrad", disabled: true })
  // degrees.splice(4, 0, { label: 'GRADUATE', value: "grad", disabled: true })
  return degrees
})
const disableSearch = computed(() => !input.cip4?.code || !input.cip4_degree)

const handleFormSubmit = () => {
  router.push(`/search/fos/?cip4=${encodeURIComponent(input.cip4.code)}&cip4_degree=${encodeURIComponent(input.cip4_degree)}`)
}

const fosColor = computed(() => {
  return disableSearch.value ? "" : "primary-yellow"
})
</script>

<style lang="scss" scoped>
.fos-search-degree-large {
  :deep(.v-field__input) {
    min-height: 70px !important;

    input {
      margin-top: 7px;
    }
  }
  
  :deep(.v-field__outline) {
    height: 70px !important;
  }
  
  :deep(.v-field) {
    height: 70px !important;
  }
}
</style>