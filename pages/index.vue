<template>

  <!-- Splash -->
  <div class="bg-primary-blue section splash">
    <v-container>
      <v-row>
        <v-col>
          <h1 class="display-5 splash-title">Search and compare colleges</h1>
          <Spacer :height="10" />

          <!-- MOBILE SPLASH -->
          <div class="d-block d-sm-none">
            <v-expansion-panels class="mb-2" v-model="mobilePanels">
              <!-- Mobile Institution Search -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="home-mobile-search-title">Search Colleges</span>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <Spacer :height="10" />
                  <SearchSchool 
                    @onSubmit="handleSchoolNameSelected"
                    @onSearch="handleSchoolNameSelected"
                    @onClear="() => {}"
                    :searchEmptyName="false"
                    placeholder="Enter college name"
                  />

                  <p class="pt-3 pb-2">Or Search by:</p>
                  <div class="d-flex">
                    <button class="option-button dark mr-3 d-flex align-center" @click="searchCollegesByLocation()" :disabled="location.error">
                      <div class="mr-2">
                        Near Me
                      </div>
                      
                      <div v-if="location.isLoading">
                        <v-icon size="x-small" color="primary-blue" icon="fa:fas fa-circle-notch fa-spin" />
                      </div>
                      <div v-else-if="location.error">
                        <v-icon size="x-small" color="primary-blue" icon="mdi-alert-circle" />
                      </div>
                      <div v-else>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.99996 5.90567L11.146 1.22685L6.29732 11.067L6.14352 6.18331L0.99996 5.90567Z" stroke="#10274E" stroke-width="1.2" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </button>
                    <button class="option-button dark" @click="searchAllColleges">All Colleges</button>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Mobile FoS Search-->
            <v-expansion-panels class="mb-2">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="home-mobile-search-title">Search Fields of Study</span>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" sm="5">
                      <Spacer :height="10" />
                      <SearchFieldOfStudy v-model="input.cip4" />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <label class="d-block  mb-2" for="fosDegree">Select Degree Type</label>
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
                      />
                    </v-col>
                    <v-col col="12" sm="3" class="">
                      <div class="d-none d-sm-block" style="height: 32px">
                        &nbsp;
                      </div>
                      <v-btn
                        @click="handleFormSubmit"
                        width="100%"
                        size="x-large"
                        :color="fosColor"
                        :disabled="disableSearch"
                      >
                        Search
                        <v-icon>mdi-menu-right</v-icon>
                      </v-btn></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- DESKTOP SPLASH -->
          <div class="d-none d-sm-block">
            <v-tabs
              bg-color="transparent"
              color="white"
              v-model="desktopTabs"
              slider-color="primary-yellow"
            >
              <v-tab class="tab-splash" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Search Schools')">Colleges</v-tab>
              <v-tab class="tab-splash" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Search Fields of Study')">Fields of Study</v-tab>
            </v-tabs>

            <v-tabs-window v-model="desktopTabs" class="home-search-wrapper">
              <v-tabs-window-item style="height: 210px;">
                <div class="d-flex mt-5">
                  <div style="max-width: 767px; width: 100%">
                    <SearchCollegeHome
                      @onSubmit="handleSchoolNameSelected"
                      @onSearch="handleSchoolNameSelected"
                      @onInput="handleCollegeInput"
                      @onClear="() => {}"
                      :searchEmptyName="false"
                    />
                  </div>
                  <button class="search-button px-8 bg-primary-yellow font-weight-bold" @click="searchCollegesFromInput">SEARCH</button>
                </div>
                <Spacer :height="20" />
                <div class="d-flex align-center">
                  <p class="mr-4">Or search by:</p>
                  <button class="option-button mr-3 d-flex align-center" @click="searchCollegesByLocation()" :disabled="location.error">
                    <div class="mr-2">
                      Near Me
                    </div>
                    
                    <div v-if="location.isLoading">
                      <v-icon size="x-small" icon="fa:fas fa-circle-notch fa-spin" />
                    </div>
                    <div v-else-if="location.error">
                      <v-icon size="x-small" icon="mdi-alert-circle" />
                    </div>
                    <div v-else>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.99996 5.90567L11.146 1.22685L6.29732 11.067L6.14352 6.18331L0.99996 5.90567Z" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </button>
                  <button class="option-button" @click="searchAllColleges">All Colleges</button>
                </div>
              </v-tabs-window-item>

              <v-tabs-window-item style="height: 210px;">
                <v-row class="pb-0 mt-2">
                  <v-col class="pb-0" cols="12" sm="5"><label class="d-block" for="fosSearch">Search Fields of Study (Required)</label></v-col>
                  <v-col class="pb-0" cols="12" sm="5"><label class="d-block" for="fosDegree">Select Degree Type (Required)</label></v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="5">
                    <SearchFieldOfStudyHome v-model="input.cip4" />
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
                    />
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
              </v-tabs-window-item>
            </v-tabs-window>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Search College -->
  <div class="bg-white section search-college">
    <v-container>
      <v-row class="align-center">
        <v-col cols="12" sm="6" lg="5">
          <p class="mb-2 h-tag tag-green">Search Colleges</p>
          <h2 class="display-6 mb-6" style="max-width: 420px;">Search for colleges using filters</h2>
          <div class="position-relative">
            <div class="college-filter-highlight" :style="highlightStyle"></div>
          </div>
          <ul class="college-filter-list mb-7">
            <li @mouseenter="filterHoverTo('-10px', 'search_location')"><span class="info-text">Search by location</span></li>
            <li @mouseenter="filterHoverTo('30px', 'search_cost')"><span class="info-text">Filter by annual cost</span></li>
            <li @mouseenter="filterHoverTo('70px', 'search_degree')"><span class="info-text">Search by degree type</span></li>
          </ul>
          <NuxtLink to="/search/" :tabindex="-1">
            <v-btn
              color="secondary-green text-uppercase h-tag font-weight-bold"
              target="_blank"
              size="large"
              :height="60"
              :width="241"
              @click="analytics.trackNavigation('/search/')"
            >
              Start your Search
            </v-btn>
          </NuxtLink>
          <HomeArrow
            classes="d-none d-md-inline ml-6"
            color="#027A48"
            path="M131.784 0.533848C131.537 0.326923 131.242 0.185701 130.926 0.12326C130.61 0.0608228 130.283 0.0791918 129.976 0.176662L113.081 5.44616C112.825 5.52491 112.588 5.65676 112.386 5.83312C112.054 6.12548 111.833 6.5228 111.758 6.95872C111.684 7.39463 111.762 7.84275 111.979 8.22823C112.195 8.61371 112.538 8.91321 112.948 9.07672C113.359 9.24022 113.814 9.25783 114.236 9.1266L125.033 5.7633L123.109 7.99675C79.9599 58.0823 30.2523 54.7424 4.45997 48.295C4.15701 48.2198 3.8404 48.2189 3.537 48.2922C3.23361 48.3656 2.95241 48.5111 2.71729 48.7164C2.4529 48.9491 2.25711 49.2496 2.15107 49.5854C2.04504 49.9213 2.03278 50.2797 2.11564 50.622C2.19848 50.9643 2.37329 51.2775 2.62116 51.5277C2.86905 51.7779 3.18056 51.9556 3.52208 52.0416C30.19 58.7081 81.5667 62.1795 126.044 10.5068L127.846 8.41446L126.588 19.0214C126.528 19.5299 126.672 20.0413 126.989 20.4434C127.306 20.8454 127.77 21.105 128.279 21.1651C128.787 21.2253 129.298 21.0809 129.7 20.7639C130.103 20.4469 130.362 19.9832 130.422 19.4748L132.466 2.24841C132.505 1.92838 132.463 1.60354 132.344 1.30388C132.225 1.00422 132.033 0.739387 131.784 0.533848Z"
            viewBox="0 0 135 58"
            width="135"
            height="58"
          />
        </v-col>
        <v-col class="d-none d-sm-block" cols="8" sm="6" lg="7">
          <div class="position-relative" style="height: 500px;">
            <div class="position-absolute layout-images search scale-on-hover-small">
              <Transition name="slide-up">
                <img
                  v-if="highlightImg === 'search_location'"
                  src="~/assets/images/home/search_location.png" 
                  class="elevation-6 rounded-lg" 
                  alt="The College Scorecard search results page with location filter open."
                />
                <img
                  v-else-if="highlightImg === 'search_cost'"
                  src="~/assets/images/home/search_cost.png" 
                  class="elevation-6 rounded-lg" 
                  alt="The College Scorecard search results page with annual cost filter open."
                />
                <img
                  v-else-if="highlightImg === 'search_degree'"
                  src="~/assets/images/home/search_degree.png" 
                  class="elevation-6 rounded-lg" 
                  alt="The College Scorecard search results page with degree types filter open."
                />
                <img
                  v-else="highlightImg === 'search'"
                  src="~/assets/images/home/search.png" 
                  class="elevation-6 rounded-lg" 
                  alt="The College Scorecard search results page with all schools."
                />
              </Transition>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Compare Colleges -->
  <div class="bg-primary-blue section compare-colleges">
    <v-container>
      <v-row>

        <v-col cols="12" lg="5" style="z-index: 1;" class="position-relative">
          <div class="compare-colleges-text-wrap"> 
            <p class="mb-2 h-tag tag-yellow">Compare Colleges</p>
            <h2 class="display-6 mb-6">See how colleges <div class="d-inline-block">compare <HomeCompareIcon class="d-inline" :hovered="true" /></div></h2>
            <p class="info-text" style="max-width: 420px">Compare up to 10 colleges at once to make informed decisions about your path to college.</p>
            <Spacer :height="80" class="d-block d-lg-none" />
            <div class="d-none d-lg-block">
              <Spacer :height="80" />
              <div class="position-relative" style="height: 255px;">
                <img 
                  src="~/assets/images/home/median_debt.png" 
                  class="elevation-6 rounded-lg layout-images median_debt scale-on-hover-small" 
                  alt="The header 'Median Total Debt After Graduation' is above two bar charts. One chart says 'University of State College' and displays a value of $31,200. The other chart says 'College State University' and displays a value of $25,500."
                />
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="7" style="z-index: 2;" class="position-relative">
          <div class="d-flex">
            <div 
              class="position-relative scale-on-hover"
              @mouseenter="school1Hover = true"
              @mouseleave="school1Hover = false"
            >
              <div
                class="compare-icon" style="z-index: 10;">
                <HomeCompareIcon :hovered="school1Hover" />
              </div>
              <img 
                src="~/assets/images/home/school_1.png" 
                class="elevation-6 rounded-lg layout-images school_1" 
                alt="Card with data about a fake college. The checkmark in the top corner turns blue on hover to demonstrate the site's compare feature."
              />
            </div>
            <div
              class="position-relative scale-on-hover ml-5"
              @mouseenter="school2Hover = true"
              @mouseleave="school2Hover = false"
            >
              <div class="compare-icon hide-small" style="z-index: 10;">
                <HomeCompareIcon :hovered="school2Hover" />
              </div>
              <img
                src="~/assets/images/home/school_2.png" 
                class="elevation-6 rounded-lg layout-images school_2" 
                alt="Card with data about a fake college. The checkmark in the top corner turns blue on hover to demonstrate the site's compare feature."
              />
            </div>
          </div>

          <div class="d-flex layout-images compare-colleges-arrow-top">
            <p>Click the checkmark <br /> to compare colleges</p>
            <HomeArrow
              class="d-inline ml-6 mt-2"
              color="#FDB022"
              path="M1.3053 17.707C1.45951 17.8706 1.64444 18.0021 1.84952 18.0941C2.05461 18.1861 2.27581 18.2368 2.50049 18.2432C2.95958 18.2538 3.40441 18.0834 3.73895 17.7688C10.8846 10.9721 21.7831 8.07671 32.8893 10.0241C42.8798 11.774 62.0235 19.1671 77.9754 49.024L79.6109 52.0785L69.6849 46.6333C69.4872 46.5239 69.2697 46.4549 69.0452 46.4303C68.8206 46.4056 68.5934 46.4257 68.3767 46.4895C68.0497 46.585 67.7584 46.7753 67.5395 47.0363C67.3206 47.2973 67.184 47.6173 67.1469 47.9559C67.1098 48.2945 67.1739 48.6365 67.3311 48.9387C67.4884 49.2408 67.7316 49.4896 68.0302 49.6536L83.1334 57.941C83.3868 58.0777 83.6701 58.1494 83.9579 58.1498C84.2458 58.1503 84.5293 58.0794 84.7831 57.9436C85.0366 57.8061 85.2514 57.6069 85.4076 57.3644C85.5638 57.122 85.6563 56.8441 85.6767 56.5564L86.9695 38.7882C86.9868 38.5632 86.9591 38.337 86.888 38.1228C86.8169 37.9086 86.7039 37.7107 86.5555 37.5406C86.4072 37.3682 86.2262 37.2268 86.0229 37.1246C85.8197 37.0224 85.5983 36.9614 85.3714 36.9451C85.2711 36.9397 85.1705 36.9419 85.0705 36.9515C84.7187 36.9863 84.3865 37.13 84.1201 37.3625C83.9494 37.5102 83.8095 37.6902 83.7084 37.892C83.6073 38.0939 83.5469 38.3137 83.5308 38.5389L82.661 50.4877L80.9799 47.3412C64.3404 16.2444 44.0772 8.48637 33.4778 6.62936C21.3055 4.49664 9.29609 7.72685 1.36607 15.2735C1.20225 15.4293 1.07073 15.6158 0.979015 15.8224C0.887301 16.029 0.837191 16.2517 0.831547 16.4777C0.825904 16.7037 0.864838 16.9285 0.946126 17.1395C1.02741 17.3504 1.14946 17.5433 1.3053 17.707Z"
              viewBox="0 0 89 67"
              width="89"
              height="67"
            />
          </div>
          <div class="layout-images compare-colleges-arrow-bottom">
            <HomeArrow
              class="d-inline mr-6"
              color="#FDB022"
              path="M135.204 39.5535C135.024 39.4239 134.82 39.3315 134.603 39.2817C134.387 39.2319 134.163 39.2256 133.944 39.2632C121.643 41.3397 113.032 41.339 106.843 39.2657L105.676 38.8723L106.572 38.0289C109.066 35.7162 111.2 33.0435 112.904 30.0996C116.382 23.9672 117.104 17.3925 114.818 12.5194C114.102 10.9572 113.056 9.56822 111.753 8.44748C110.45 7.32674 108.921 6.50072 107.269 6.02594C104.1 5.14392 100.727 5.34966 97.689 6.61027C91.4484 9.13441 86.5955 15.8741 89.8205 25.2494C91.8715 31.21 94.7905 35.6161 98.7431 38.7214L99.5472 39.3522L98.6951 39.9147C90.3761 45.4318 79.3475 48.9174 65.9207 50.2691C51.7381 51.8496 37.3852 49.8734 24.1576 44.5187C19.3505 42.5609 14.7976 40.0295 10.5979 36.9793L8.67047 35.5435L18.6482 35.9995C19.0928 36.014 19.5252 35.8526 19.8516 35.5503C20.1779 35.2481 20.372 34.8294 20.3916 34.385C20.4113 33.9406 20.2549 33.5064 19.9565 33.1765C19.658 32.8467 19.2416 32.6478 18.7974 32.623L3.11292 31.9035C2.82997 31.8906 2.54833 31.9491 2.29384 32.0734C2.03935 32.1978 1.82018 32.384 1.65643 32.6152C1.49269 32.8463 1.38962 33.1148 1.35669 33.3961C1.32376 33.6775 1.36202 33.9625 1.46796 34.2252L7.15186 48.3101C7.32018 48.7249 7.64601 49.0561 8.058 49.2311C8.46999 49.4062 8.93457 49.4109 9.34999 49.2441C9.39551 49.2267 9.44004 49.2068 9.48337 49.1845C9.85992 48.9913 10.1509 48.6646 10.2993 48.2682C10.4478 47.8719 10.443 47.4345 10.2861 47.0414L6.79158 38.3857L8.88402 39.9218C13.1597 42.9853 17.7752 45.5443 22.6386 47.5478C36.4426 53.189 51.4401 55.2813 66.261 53.6335C78.413 52.4101 88.7982 49.4489 97.1262 44.8354C98.947 43.8306 100.704 42.7138 102.387 41.4916L102.74 41.2337L103.137 41.4197C104.169 41.9023 105.231 42.3157 106.317 42.6573C113.019 44.774 121.712 44.7546 134.505 42.592C134.671 42.5634 134.832 42.5105 134.982 42.4351C135.242 42.3038 135.464 42.1076 135.625 41.8656C135.787 41.6236 135.884 41.344 135.906 41.0537C135.928 40.7635 135.874 40.4725 135.751 40.2089C135.628 39.9453 135.438 39.718 135.201 39.549M102.806 36.8253L102.381 37.1867L101.916 36.8783C97.9106 34.2021 95.0832 30.1568 93.0127 24.1441C90.5411 16.9528 94.0117 12.1892 98.0827 10.1401C98.3708 9.99671 98.664 9.86246 98.9579 9.74547C103.486 7.91423 109.339 8.77027 111.762 13.9512C113.58 17.8371 112.907 23.2489 109.964 28.4322C108.084 31.6253 105.663 34.4675 102.81 36.8318"
              viewBox="0 0 137 70"
              width="137"
              height="70"
            />
            <p class="mt-4">Compare the information <br />that matters most to you</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- College Profiles -->
  <div class="section college-profiles">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="5">
          <div class="college-profiles-wrapper"> 
            <p class="mb-2 h-tag tag-green">View College Profiles</p>
            <h2 class="display-6 mb-6">Find the information that matters most <br v-if="breakpoints.lgAndUp.value" /> to you</h2>
            <p class="info-text mb-6">View U.S. Department of Education data about costs, student debt, graduation rates, admissions test scores and acceptance rates, student body diversity, post-college earnings, and more.</p>
            <NuxtLink to="/search/" :tabindex="-1">
              <v-btn
                color="secondary-green text-uppercase h-tag font-weight-bold" 
                target="_blank"
                size="large"
                :height="60"
                :width="218"
                @click="analytics.trackNavigation('/search/')"
              >
                Search Schools
              </v-btn>
            </NuxtLink>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="7" class="d-none d-md-block">
          <div class="position-relative">
            <img 
              src="~/assets/images/home/average_annual_cost.png" 
              class="elevation-6 rounded-lg position-absolute layout-images annual_cost scale-on-hover" 
              alt="Bar chart labeled 'Average Annual Cost.' A horizontal blue bar is displayed with a value of $31,101 on a scale of $0 to $100,000. A navy blue midpoint line overlays the blue bar at an unknown value. "
              style="z-index: 1;"
            />
            <img 
              src="~/assets/images/home/acceptance_rate.png" 
              class="elevation-6 rounded-lg position-absolute layout-images acceptance_rate scale-on-hover" 
              alt="Pie graph labeled 'Acceptance Rate.' The value 25% is displayed in the center of the graph and the pie graph is shaded accordingly."
            />
          </div>
          <img
            src="~/assets/images/home/graduation_rate.png" 
            class="elevation-6 rounded-lg layout-images graduation_rate scale-on-hover" 
            alt="A vertical bar chart labeled 'Graduation Rate' with a value of 96% on a scale of 0% to 100%."

          />
        </v-col>
      </v-row>
    </v-container>
  </div>

    <!-- Fields of Study -->
    <div class="bg-primary-aqua section fields-of-study">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" lg="5">
            <div class="search-fos-wrapper">
              <p class="mb-2 h-tag tag-white">Search fields of study</p>
              <h2 class="display-6 mb-6">Find what to study</h2>
              <p class="info-text mb-6">Search and compare the Fields of Study (majors and programs) offered at colleges and universities. Find information about the salaries and debt of graduates.</p>
              <NuxtLink to="search/fos-landing" :tabindex="-1">
                <v-btn
                  color="primary-yellow text-uppercase h-tag font-weight-bold"
                  target="_blank"
                  size="large"
                  :height="60"
                  :width="278"
                  @click="analytics.trackNavigation('/search/fos-landing')"
                >
                  Search Fields of Study
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="7" class="d-none d-md-block">
            <div class="position-relative">
              <img
                src="~/assets/images/home/location.png" 
                class="elevation-6 rounded-lg position-absolute layout-images location scale-on-hover" 
                alt="Location filter with 'Near Me' selected. Slider for Annual Earnings is filtered to show $60k - $150k. Slider for Median Debt is filtered to $0k - $27k."
              />
              <img
                src="~/assets/images/home/psychology.png" 
                class="elevation-6 rounded-lg position-absolute layout-images psychology scale-on-hover" 
                alt="Data for a Psychology field of study. Median Earnings: $87,254, Monthly Earnings $7,271, Median Total Debt $19,500, and Monthly Loan Payment $195."
              />
              <img 
                src="~/assets/images/home/median_earnings.png" 
                class="elevation-6 rounded-lg position-absolute layout-images median_earning scale-on-hover" 
                alt="The header 'Compare Median Earnings' is above two bar charts. One chart says 'Psychology - University of State College' and displays a value of $76,515. The other chart says 'Psychology - College State University' and displays a value of $72,810."
                style="z-index: 1;"
              />
              <HomeArrow
                class="layout-images fos-arrow"
                color="#FDB022"
                path="M30.1731 116.013C30.3216 116.46 30.6167 116.844 31.0105 117.103C42.1285 125.593 69.1425 139.66 100.852 145.677C115.86 148.523 130.499 148.264 145.95 143.065C165.895 136.361 177.26 125.953 183.281 118.404C186.028 115.001 188.348 111.274 190.189 107.307L191.333 104.79L192.68 113.81C192.773 114.283 193.039 114.704 193.427 114.989C193.816 115.274 194.297 115.403 194.775 115.35C195.006 115.339 195.231 115.281 195.438 115.179C195.645 115.076 195.829 114.933 195.978 114.757C196.126 114.58 196.237 114.375 196.303 114.154C196.369 113.933 196.389 113.701 196.361 113.472L194.081 98.1369C194.03 97.8401 193.907 97.5605 193.722 97.3233C193.537 97.086 193.296 96.8985 193.02 96.7777C192.74 96.6463 192.434 96.5821 192.125 96.5903C191.817 96.5984 191.514 96.6786 191.242 96.8245L176.654 104.853L176.618 104.876C176.42 104.984 176.248 105.133 176.113 105.312C175.977 105.492 175.881 105.698 175.831 105.917C175.781 106.136 175.777 106.364 175.821 106.584C175.865 106.805 175.956 107.013 176.086 107.197C176.361 107.598 176.777 107.882 177.251 107.991C177.725 108.106 178.223 108.042 178.653 107.814L188.123 102.6L187.273 104.662C185.452 108.931 183.034 112.92 180.092 116.509C174.357 123.627 163.538 133.456 144.559 139.837C130.613 144.504 115.69 145.445 101.268 142.568C66.6957 136.173 43.4104 120.786 32.8956 114.487C32.6231 114.273 32.2987 114.135 31.9553 114.087C31.612 114.039 31.2621 114.083 30.9414 114.215C30.724 114.342 30.5375 114.515 30.3954 114.723C30.2673 114.909 30.1812 115.121 30.143 115.343C30.1049 115.566 30.1155 115.794 30.1742 116.012"
                viewBox="0 0 227 227"
                width="227"
                height="227"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>


    <!-- ALternative Pathways / Resources -->
    <div class="section resources">
      <v-container class="d-none d-md-block">
        <v-row>
          <v-col cols="12" md="6" class="pr-md-8">
            <v-card flat class="pa-7 h-100 elevation-7">
              <HomeResources />
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pl-md-8">
            <div class="d-flex flex-column h-100">
              <v-card flat class="px-7 py-9 elevation-7">
                <HomeFafsa />
              </v-card>
              <div class="flex-grow-1 my-3" />
              <v-card class="pa-7 bg-primary-blue elevation-7 border-none">
                <HomeVeterans theme="dark" />
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="d-block d-md-none bg-white pb-6 pt-7">
        <v-row>
          <v-col>
            <HomeResources />
            <hr class="my-7"/>
            <HomeFafsa />
            <Spacer :height="10" />
          </v-col>
        </v-row>
      </v-container>
      <v-container class="d-block d-md-none pb-6">
        <v-row>
          <v-col>
            <Spacer :height="10" />
            <HomeVeterans theme="light" />
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<style scoped lang="scss">
.splash-title {
  @include smAndDown() {
    font-size: 40px;
    margin-bottom: 10px;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
  position: absolute;
}

.slide-up-enter-from {
  opacity: 0;
}

.slide-up-leave-to {
  // opacity: 0;
  box-shadow: none !important;
}

.search-button {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 100;
  position: relative;
}

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

.option-button {
  border: 1.5px solid white;
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 16px;

  outline: 2px solid  use-theme('primary-blue');

  &.dark {
    border: 1.5px solid use-theme('primary-blue');
    color: use-theme('primary-blue');
    outline: 2px solid  white;

    &:hover {
    background-color: #10274E11;
  }
  }

  &:focus {
    box-shadow: 0 0 0 4px use-theme('secondary-blue');
  }

  &:hover {
    background-color: #FFFFFF11;
  }
}

.tab-splash {
  font-size: 16px;
}

:deep(.v-tab--selected) {
  font-weight: bold;
}

:deep(.v-tab.v-tab.v-btn) {
  height: 40px !important;
}

:deep(.v-tab__slider) {
  height: 4px !important;  
}

.h-tag {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.48px;
  text-transform: uppercase;
  font-weight: 400;

  &.tag-green {
    color: use-theme('secondary-green');
  }

  &.tag-yellow {
    color: use-theme('primary-yellow');
  }

  &.tag-white {
    color: white;
  }
}

.info-text {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
}

.home-callout {
  color: use-theme('secondary-green');
}

.college-filter-list {
  li {
    list-style: none;
    max-width: 240px;

    &::before {
      content: '';
      display: inline-block;
      position: relative;
      bottom: 2px;
      height: 10px;
      width: 14px;
      background-image: url('~/assets/images/checkmark.png');
      background-size:     cover;                      /* <------ */
      background-repeat:   no-repeat;
      background-position: center center;  
    }

    margin-bottom: 15px;
    position: relative;
    left: 10px;

    span {
      position: relative;
      bottom: 2px;
      left: 10px;
    }
  }
}

.college-filter-highlight {
  position: absolute;
  width: 238px;
  height: 40px;
  background-color: use-theme('primary-yellow');
  opacity: 0.2;
  border-radius: 3px;
  transition: top 0.3s;
}

.compare-colleges-text-wrap {
  max-width: 420px;

  @include mdAndDown() {
    max-width: 100%;
  }
}

.scale-on-hover {
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }
}

.scale-on-hover-small {
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.01);
  }
}

.z-back {
  z-index: -1;
}

.z-front {
  z-index: 1;
}

.hover-underline {
  &:hover {
    text-decoration: underline !important;
  }
}

.college-profiles-wrapper {
  max-width: 350px;

  @include mdAndDown() {
    max-width: 500px;
  }
}

.search-fos-wrapper {
  max-width: 350px;

  @include mdAndDown() {
    max-width: 500px;
  }
}

.layout-images {
  &.search {
    width: 710px;
    height: 580px;
    bottom: -40px;

    img {
      width: 710px;
      height: 580px;
    }
  }

  &.median_debt {
    width: 589px;
    height: 310px;

    @include mdAndDown() {
      display:none;
    }
  }

  &.school_1 {
    width: 318px;
    height: 448px;

    @include smAndDown() {
      width: calc(318px - 40px);
      height: calc(448px - 40px);
    }
  }

  &.school_2 {
    width: 318px;
    height: 448px;

    @include sm() {
      // display:none;
      width: calc(318px - 40px);
      height: calc(448px - 40px);
    }

    @include pxAndDown(615px) {
      display:none;
    }
  }

  &.compare-colleges-arrow-top {
    position: absolute;
    top: -70px;
    left: 380px;

    @include smAndDown() {
      left: 300px;
    }

    @include pxAndDown(615px) {
      left: 20px;
      top: -65px;
    }
  }

  &.compare-colleges-arrow-bottom {
    display: flex;
    position: absolute;
    top: 480px;
    left: 130px;

    @include mdAndDown() {
      display: none;
    }
  }

  &.graduation_rate {
    width: 386px;
    height: 412px;

    @include mdAndDown() {
      display:none;
    }
  }

  &.annual_cost {
    width: 332px;
    height: 205px;
    left: 300px;
    top: -50px;

    @include md() {
      left: 30px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.acceptance_rate {
    width: 271px;
    height: 285px;
    left: 405px;
    top: 200px;

    @include md() {
      left: 170px;
      top: 140px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.location {
    width: 260px;
    height: 316px;
    left: 0px;
    top: -100px;

    @include md() {
      left: 40px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.psychology {
    width: 395px;
    height: 226px;
    left: 283px;
    top: -60px;

    @include mdAndDown() {
      display:none;
    }
  }

  &.median_earning {
    width: 473px;
    height: 258px;
    left: 190px;
    top: 190px;

    @include md() {
      left: 60px;
      width: calc(473px - 80px);
      height: calc(258px - 50px);
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.fos-arrow {
    position: absolute;
    top: 150px;
    left: -220px;

    @include md() {
      left: -180px;
      top: 130px;
    }

    @include smAndDown() {
      display: none;
    }
  }
}


.section {
  &.splash {
    @include mdAndUp() {
      padding-top: 3rem;
    }

    @include smAndDown() {

    }
  }

  &.search-college {
    @include mdAndUp() {

    }

    @include xs() {
      padding-top: 1rem;
      padding-bottom: 2rem;
    }
  }

  &.compare-colleges {
    @include lgAndUp() {
      padding-top: 10rem;
      padding-bottom: 1rem;
    }

    @include md() {
      padding-top: 5rem;
      padding-bottom: 1rem;
    }

    @include sm() {
      padding-top: 2rem;
    }

    @include xs() {
      padding-top: 1rem;
    }

    .compare-icon {
      position: absolute;
      left: 260px;
      top: 10px;

      @include smAndDown() {
        left: 220px;
      }

      &.hide-small {
        @include pxAndDown(615px) {
          display: none;
        }
      }
    }
  }

  &.college-profiles {
    @include mdAndUp() {
      padding-top: 5rem;
      padding-bottom: 7rem;
    }

    @include sm() {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    @include xs() {
      padding-top: 1rem;
      padding-bottom: 2rem;
    }
  }

  &.fields-of-study {
    @include lgAndUp() {
      padding-top: 9rem;
      padding-bottom: 15rem;
    }

    @include md() {
      padding-top: 8rem;
      padding-bottom: 13rem;
    }

    @include sm() {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    @include xs() {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  &.resources {
    @include mdAndUp() {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    @include smAndDown() {
      // padding-top: 1rem;
    }
  }
}
</style>

<script setup>
const router = useRouter()
const analytics = useAnalytics()
const { formMappings } = useConstants()
const { location, handleLocationCheck } = useLocationCheck();
const { breakpoints } = useVuetify()
const desktopTabs = ref(0)
const mobilePanels = ref(0)



const school1Hover = ref(false)
const school2Hover = ref(false)

const highlightStyle = ref({ top: "-10px" })
const highlightImg = ref('search_location')

const filterHoverTo = (position, image) => {
  highlightStyle.value.top = position
  highlightImg.value = image
}

const handleSchoolNameSelected = (school) => {
  if (school === "") {
    return
  }

  if (typeof school === "string") {
    router.push("/search/?search=" + encodeURIComponent(school))
  } else {
    router.push("/search/?search=" + encodeURIComponent(school["school.name"]))
  }
}

const collegeInput = ref(null)
const handleCollegeInput = (input) => {
  if (input) {
    collegeInput.value = input
  } else {
    collegeInput.value = null
  }
}

const searchCollegesFromInput = () => {
  if (collegeInput.value) {
    router.push("/search/?search=" + encodeURIComponent(collegeInput.value))
  }
}

const searchAllColleges = () => {
  router.push("/search/")
}

const input = reactive({
  cip4: null,
  cip4_degree: null,
})

const fosDegrees = computed(() => formMappings.fosDegrees)
const disableSearch = computed(() => !input.cip4?.code || !input.cip4_degree)

const fosColor = computed(() => {
  return disableSearch.value ? "" : "primary-yellow"
})

const handleFormSubmit = () => {
  router.push(`/search/fos?cip4=${encodeURIComponent(input.cip4.code)}&cip4_degree=${encodeURIComponent(input.cip4_degree)}`)
}

const searchCollegesByLocation = () => {
  console.log("searchCollegesByLocation")
  handleLocationCheck()
}

watch(location, (newVal) => {
  if (!newVal.latLon) {
    return
  }

  const latLon = newVal.latLon
  
  if (!latLon.min_lat || !latLon.max_lat || !latLon.min_lon || !latLon.max_lon) {
    return;
  }

  const query = {
    lat: latLon.min_lat + ".." + latLon.max_lat,
    long: latLon.min_lon + ".." + latLon.max_lat,
    distance: 50,
  }

  router.push({ name: 'search', query: query })
})

import searchLocation from '~/assets/images/home/search_location.png'
import searchCost from '~/assets/images/home/search_cost.png'
import searchDegree from '~/assets/images/home/search_degree.png'

useHead({
  link: [
    { rel: 'preload', href: searchLocation, as: 'image', type: 'image/png' },
    { rel: 'preload', href: searchCost, as: 'image', type: 'image/png' },
    { rel: 'preload', href: searchDegree, as: 'image', type: 'image/png' },
  ],
})
</script>