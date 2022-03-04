<template>
  <v-main>
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12" lg="9" class="school-left">
          <!-- Top Summary Container-->
          <v-card class="pb-5 px-3">
            <!--Page Header-->
            <v-row class="csGreenBg">
              <v-col cols="6">
                <v-btn
                  small
                  color="white"
                  text
                  id="referrer-link"
                  class="link-more"
                  :href="referrerLink"
                  >&laquo; Back</v-btn
                >
              </v-col>
              <v-col cols="6" class="text-right">
                <share
                  small
                  text
                  color="white"
                  label="Share this Comparison"
                  :url="shareUrl"
                  :hide="hideShare"
                  show-copy
                />
              </v-col>
            </v-row>

            <h1 class="my-5 mx-5">
              Compare
            </h1>

            <!-- Toggle Controls-->
            <div class="mx-md-4">
              <context-toggle
                :display-toggle="displayToggle"
                :control-tab="controlTab"
                :tab-container-style="{ width: '100%' }"
                :tab-style="{ width: '50%' }"
                @context-switch-click="handleDisplayToggleClick"
                @context-tab-change="handleDisplayToggleClick"
                :fill-space="true"
                :compare-institutions-count="countSchools"
                :compare-fields-of-study-count="countFieldsOfStudy"
              >
                <template v-slot:tab-school>
                  <h3 class="compare-tab-title">
                    Schools ({{ countSchools }})
                  </h3>
                </template>
                <template v-slot:tab-fos>
                  <h3 class="compare-tab-title">
                    Fields of Study ({{ countFieldsOfStudy }})
                  </h3>
                </template>
              </context-toggle>
            </div>

            <!--Loader-->
            <div v-show="loading" class="show-loading ma-4">
              <div class="pa-5">
                <h1 class="title">
                  Loading
                  <v-icon color="#1874DC">fas fa-circle-notch fa-spin</v-icon>
                </h1>
              </div>
            </div>

            <!-- Institution Top Summary-->
            <div class="mx-5" id="school">
              <!-- Institution Chips -->
              <div
                v-show="showResource === 'institutions' && !loading"
                class="compare-institution-chip-container py-5 mb-10 show-loaded"
              >
                <v-chip-group column>
                  <v-chip
                    class="pa-4 ma-2"
                    v-for="institution in responseCache.institution"
                    :key="institution.schoolId"
                    close
                    @click:close="
                      handleChipCloseClick(institution, 'compare-schools')
                    "
                  >
                    {{ institution.schoolName }}
                  </v-chip>
                </v-chip-group>
              </div>

              <!--Institution Summary Metrics-->
              <v-row>
                <v-col cols="12" class="px-sm-5 pt-0 pb-4">
                  <median-toggle
                    :display-toggle="medianToggle"
                    @median-switch-click="handleMedianToggle"
                    @median-tab-change="handleMedianToggle"
                    group-name="School Type"
                    label-prefix="Midpoint for "
                    :tab-style="{
                      width: '32%',
                    }"
                    v-if="showResource === 'institutions' && !loading"
                  />
                  <compare-section
                    :schools="schools"
                    title="Average Annual Cost"
                    definition="avg-cost"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'netPrice',
                      color: '#1874DC',
                      min: {
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      },
                      max: {
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      },
                      type: 'average-annual-cost',
                      chart: 'HorizontalBarMedian',
                      medianToggle: medianToggle,
                    }"
                    v-show="showResource === 'institutions' && !loading"
                    ><p
                      class="mb-0"
                      v-show="showResource === 'institutions' && !loading"
                    >
                      Cost includes tuition, living costs, books and supplies,
                      and fees minus the average grants and scholarships for
                      federal financial aid recipients.
                    </p></compare-section
                  >

                  <compare-section
                    :schools="schools"
                    title="Graduation Rate"
                    definition="graduation-rate"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'completionRate',
                      color: '#1874DC',
                      min: {
                        label: '0%',
                        value: 0,
                        style: { height: '60px' },
                      },
                      max: {
                        label: '100%',
                        value: 100,
                        style: { height: '60px' },
                      },
                      type: 'graduation-rate',
                      chart: 'HorizontalBarMedian',
                      medianToggle: medianToggle,
                    }"
                    v-show="showResource === 'institutions' && !loading"
                  />

                  <compare-section
                    :schools="schools"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    title="Median Earnings"
                    definition="institution-median-earnings"
                    :config="{
                      computedField: 'medianEarnings',
                      color: '#1874DC',
                      min: {
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      },
                      max: {
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      },
                      type: 'median-earnings',
                      chart: 'HorizontalBarMedian',
                      medianToggle: medianToggle,
                    }"
                    v-show="showResource === 'institutions' && !loading"
                  >
                    <template>
                      <p>
                        The median earnings of former students who received
                        federal financial aid at 10 years after entering the
                        school.
                      </p>
                    </template>
                  </compare-section>
                </v-col>
              </v-row>
            </div>
            <!-- End Institution Top Summary-->

            <!-- Field Of Study Container -->
            <div v-show="showResource === 'fos' && !loading">
              <!-- Field of Study Chips -->
              <div class="compare-fos-chip-container mb-10 py-5 mx-md-5">
                <!-- Mobile Chip Layout -->
                <v-chip-group show-arrows class="d-md-none">
                  <v-chip
                    v-for="fieldOfStudy in responseCache.fieldsOfStudy"
                    :key="`${fieldOfStudy.id}${fieldOfStudy.code}`"
                    close
                    @click:close="
                      handleChipCloseClick(fieldOfStudy, 'compare-fos')
                    "
                  >
                    <div class="compare-fos-chip pa-2">
                      <h4>
                        {{ fieldOfStudy.title | formatFieldOfStudyTitle }}
                      </h4>
                      <span class="fos-uppercase-credential-title">
                        {{
                          fieldOfStudy["credential.title"]
                            | formatFieldOfStudyCredentialTitle
                        }}
                      </span>
                      <br />
                      <span class="fos-school-name-text">{{
                        fieldOfStudy["school.name"]
                      }}</span>
                    </div>
                  </v-chip>
                </v-chip-group>

                <!-- MD and larger chip layout -->
                <v-chip-group class="d-none d-md-block" column>
                  <v-chip
                    class="ma-2"
                    v-for="fieldOfStudy in responseCache.fieldsOfStudy"
                    :key="`${fieldOfStudy.id}${fieldOfStudy.code}`"
                    close
                    @click:close="
                      handleChipCloseClick(fieldOfStudy, 'compare-fos')
                    "
                  >
                    <div class="compare-fos-chip pa-2">
                      <h4>
                        {{ fieldOfStudy.title | formatFieldOfStudyTitle }}
                      </h4>
                      <span class="fos-uppercase-credential-title">{{
                        fieldOfStudy["credential.title"]
                          | formatFieldOfStudyCredentialTitle
                      }}</span
                      ><br />
                      <span class="fos-school-name-text">{{
                        fieldOfStudy["school.name"]
                      }}</span>
                    </div>
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- Field Of Study Data Container -->
              <div class="mx-md-5 mx-2">
                <div
                  id="compare-salary-after-completing"
                  class="compare-fos-section"
                >
                  <h2 class="pt-5">
                    Salary After Completing
                  </h2>

                  <div class="ml-3">
                    <div id="fos-median-earnings" class="pt-5 mb-5">
                      <h3 class="mb-2">
                        Median Earnings&nbsp;<tooltip
                          definition="fos-median-earnings"
                          :isCompare="true"
                        />
                      </h3>

                      <compare-block
                        v-for="credentialLevel in filteredFieldsOfStudy"
                        :key="`${credentialLevel.key}-median-earnings`"
                        :block_title="credentialLevel.title"
                        :schools="credentialLevel.items"
                        :currentHighlight="currentFOSHighlight"
                        @update-highlight="currentFOSHighlight = $event"
                        is-field-of-study
                      >
                        <template v-slot:fos-row="slotProps">
                          <div v-if="fosSalarySelect === 'aid'">
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[fields.FOS_EARNINGS_FED]
                              "
                              :value="slotProps.school[fields.FOS_EARNINGS_FED]"
                              :min="0"
                              :max="150000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[fields.FOS_EARNINGS_FED]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[fields.FOS_EARNINGS_PELL]
                              "
                              :value="
                                slotProps.school[fields.FOS_EARNINGS_PELL]
                              "
                              :min="0"
                              :max="150000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[fields.FOS_EARNINGS_PELL]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>
                        </template>
                      </compare-block>
                    </div>

                    <div id="fos-monthly-earnings" class="mb-5">
                      <h3 class="mb-2">
                        Monthly Earnings&nbsp;
                        <tooltip
                          definition="fos-monthly-earnings"
                          :isCompare="true"
                        />
                      </h3>

                      <compare-block
                        v-for="credentialLevel in filteredFieldsOfStudy"
                        :key="`${credentialLevel.key}-monthly-earnings`"
                        :block_title="credentialLevel.title"
                        :schools="credentialLevel.items"
                        is-field-of-study
                        :currentHighlight="currentFOSHighlight"
                        @update-highlight="currentFOSHighlight = $event"
                      >
                        <template v-slot:fos-row="slotProps">
                          <div>
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[fields.FOS_EARNINGS_FED]
                              "
                              :value="
                                slotProps.school[fields.FOS_EARNINGS_FED] / 12
                              "
                              :min="0"
                              :max="30000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[fields.FOS_EARNINGS_FED]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>
                        </template>
                      </compare-block>
                    </div>
                  </div>
                </div>

                <div
                  id="compare-financial-aid"
                  class="compare-fos-section mt-10"
                >
                  <h2>Financial Aid</h2>

                  <div class="ml-3">
                    <div id="fos-median-total-debt" class="pt-5 mb-5">
                      <h3 class="mb-2">
                        Median Total Debt After Graduation&nbsp;
                        <tooltip
                          v-if="!fosFinancialCheckboxIncludePrior"
                          definition="fos-median-debt"
                          :isCompare="true"
                        />
                        <tooltip
                          v-else-if="fosFinancialCheckboxIncludePrior"
                          definition="fos-median-debt-all-schools"
                          :isCompare="true"
                        />
                      </h3>

                      <div class="d-flex">
                        <v-checkbox
                          class="mx-5 mb-5"
                          hide-details
                          v-model="fosFinancialCheckboxIncludePrior"
                          label="Include debt borrowed at any prior institutions"
                        >
                          <template v-slot:label>
                            <span class="profile-fos-include-prior-debt">
                              Include debt borrowed at any prior
                              institutions&nbsp;
                              <tooltip definition="include-debt-prior-inst" />
                            </span>
                          </template>
                        </v-checkbox>
                      </div>

                      <compare-block
                        v-for="credentialLevel in filteredFieldsOfStudy"
                        :key="`${credentialLevel.key}-median-debt`"
                        :block_title="credentialLevel.title"
                        :schools="credentialLevel.items"
                        is-field-of-study
                        :currentHighlight="currentFOSHighlight"
                        @update-highlight="currentFOSHighlight = $event"
                      >
                        <template v-slot:fos-row="slotProps">
                          <div v-if="!fosFinancialCheckboxIncludePrior">
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[fields.FOS_DEBT_MEDIAN]
                              "
                              :value="slotProps.school[fields.FOS_DEBT_MEDIAN]"
                              :min="0"
                              :max="30000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[fields.FOS_DEBT_MEDIAN]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[fields.FOS_DEBT_MEDIAN_PRIOR]
                              "
                              :value="
                                slotProps.school[fields.FOS_DEBT_MEDIAN_PRIOR]
                              "
                              :min="0"
                              :max="30000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[
                                    fields.FOS_DEBT_MEDIAN_PRIOR
                                  ]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>
                        </template>
                      </compare-block>
                    </div>

                    <div id="fos-monthly-loan" class="mb-5">
                      <h3 class="mb-2">
                        Monthly Loan Payment&nbsp;
                        <tooltip
                          v-if="!fosFinancialCheckboxIncludePrior"
                          definition="fos-monthly-debt-payment"
                        />
                        <tooltip
                          v-else-if="fosFinancialCheckboxIncludePrior"
                          definition="fos-monthly-debt-payment-all-schools"
                        />
                      </h3>

                      <div class="d-flex">
                        <v-checkbox
                          class="mx-5 mb-5"
                          hide-details
                          v-model="fosFinancialCheckboxIncludePrior"
                          label="Include debt borrowed at any prior institutions"
                        >
                          <template v-slot:label>
                            <span class="profile-fos-include-prior-debt">
                              Include debt borrowed at any prior
                              institutions&nbsp;
                              <tooltip definition="include-debt-prior-inst" />
                            </span>
                          </template>
                        </v-checkbox>
                      </div>
                      <compare-block
                        v-for="credentialLevel in filteredFieldsOfStudy"
                        :key="`${credentialLevel.key}-monthly-payment`"
                        :block_title="credentialLevel.title"
                        :schools="credentialLevel.items"
                        is-field-of-study
                        :currentHighlight="currentFOSHighlight"
                        @update-highlight="currentFOSHighlight = $event"
                      >
                        <template v-slot:fos-row="slotProps">
                          <div v-if="!fosFinancialCheckboxIncludePrior">
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[fields.FOS_DEBT_MONTHLY]
                              "
                              :value="slotProps.school[fields.FOS_DEBT_MONTHLY]"
                              :min="0"
                              :max="2000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[fields.FOS_DEBT_MONTHLY]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>

                          <div v-else>
                            <horizontal-bar
                              v-if="
                                slotProps.school &&
                                  slotProps.school[
                                    fields.FOS_DEBT_MONTHLY_PRIOR
                                  ]
                              "
                              :value="
                                slotProps.school[fields.FOS_DEBT_MONTHLY_PRIOR]
                              "
                              :min="0"
                              :max="2000"
                              color="#1874DC"
                              :height="30"
                              type="currency"
                              :labels="true"
                            ></horizontal-bar>
                            <div
                              v-if="
                                slotProps.school &&
                                  !slotProps.school[
                                    fields.FOS_DEBT_MONTHLY_PRIOR
                                  ]
                              "
                              class="data-na"
                            >
                              Data Not Available
                            </div>
                          </div>
                        </template>
                      </compare-block>
                    </div>
                  </div>
                </div>

                <div id="fos-grad-count" class="my-10">
                  <h2>
                    Number Of Graduates&nbsp;<tooltip
                      definition="fos-number-of-graduates"
                      :isCompare="true"
                    />
                  </h2>
                  <compare-block
                    v-for="credentialLevel in filteredFieldsOfStudy"
                    :key="`${credentialLevel.key}-grad-count`"
                    :block_title="credentialLevel.title"
                    :schools="credentialLevel.items"
                    is-field-of-study
                    :currentHighlight="currentFOSHighlight"
                    @update-highlight="currentFOSHighlight = $event"
                  >
                    <template v-slot:fos-row="slotProps">
                      <horizontal-bar
                        v-if="
                          slotProps.school &&
                            slotProps.school[fields.FOS_GRAD_COUNT] != null
                        "
                        :value="slotProps.school[fields.FOS_GRAD_COUNT]"
                        :min="0"
                        :max="400"
                        color="#1874DC"
                        :height="30"
                        type="number"
                        :labels="true"
                      ></horizontal-bar>
                      <div
                        v-if="
                          slotProps.school &&
                            slotProps.school[fields.FOS_GRAD_COUNT] == null
                        "
                        class="data-na"
                      >
                        Data Not Available
                      </div>
                    </template>
                  </compare-block>
                </div>
              </div>
            </div>
            <!-- Field Of Study Container End -->
          </v-card>
          <!-- Top Summary Container-->

          <!-- Institution Metrics-->
          <div v-if="showResource === 'institutions'">
            <!-- Accordion Controls-->
            <v-row>
              <v-col class="text-right mt-5">
                <v-btn primary @click="all" class="my-2 mr-2">Expand All</v-btn>
                <v-btn primary @click="none" class="my-2">Close All</v-btn>
              </v-col>
            </v-row>

            <v-expansion-panels class multiple focusable v-model="panels">
              <!--College Information-->
              <v-expansion-panel>
                <v-expansion-panel-header
                  @click="trackAccordion('College Information')"
                  >College Information
                </v-expansion-panel-header>

                <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                  <compare-section
                    :schools="schools"
                    title="Full Time Enrollment"
                    definition="full-time"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'fullTimeEnrollment',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                    }"
                  />

                  <compare-section
                    :schools="schools"
                    title="School Information"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      chart: 'SchoolInfo',
                    }"
                  />

                  <compare-section
                    :schools="schools"
                    title="Socio-Economic Diversity"
                    definition="socio-eco"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'socioEconomicDiversity',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                    }"
                  />

                  <compare-section
                    :schools="schools"
                    title="Race/Ethnicity"
                    definition="race-eth"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'raceEthnicity',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                      currentRaceEthnicityFilter: currentRaceEthnicity,
                    }"
                  >
                    <p class="overline mb-1">Race/Ethnicity</p>

                    <v-select
                      :items="[
                        {
                          label: 'American Indian/Alaska Native',
                          value: 'American Indian/Alaska Native',
                        },
                        { label: 'Asian', value: 'Asian' },
                        { label: 'Black', value: 'Black' },
                        { label: 'Hispanic', value: 'Hispanic' },
                        {
                          label: 'Native Hawaiian/Pacific Islander',
                          value: 'Native Hawaiian/Pacific Islander',
                        },
                        {
                          label: 'Non-resident alien',
                          value: 'Non-resident alien',
                        },
                        {
                          label: 'Two or more races',
                          value: 'Two or more races',
                        },
                        { label: 'Unknown', value: 'Unknown' },
                        { label: 'White', value: 'White' },
                      ]"
                      item-text="label"
                      item-value="value"
                      label="Race/Ethnicity"
                      v-model="currentRaceEthnicity"
                      color="secondary"
                      solo
                      class="compare-select"
                    ></v-select>
                  </compare-section>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Costs-->
              <v-expansion-panel>
                <v-expansion-panel-header @click="trackAccordion('Costs')"
                  >Costs</v-expansion-panel-header
                >
                <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                  <median-toggle
                    :display-toggle="medianToggle"
                    @median-switch-click="handleMedianToggle"
                    @median-tab-change="handleMedianToggle"
                    group-name="School Type"
                    label-prefix="Midpoint for "
                    :tab-style="{
                      width: '32%',
                    }"
                    v-show="showResource === 'institutions'"
                    class="mt-10"
                  />

                  <compare-section
                    :schools="schools"
                    title="Average Annual Cost"
                    definition="avg-cost"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'netPrice',
                      color: '#1874DC',
                      min: {
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      },
                      max: {
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      },
                      type: 'average-annual-cost',
                      chart: 'HorizontalBarMedian',
                      medianToggle: medianToggle,
                    }"
                    class="mt-5"
                    ><p class="my-3">
                      Cost includes tuition, living costs, books and supplies,
                      and fees minus the average grants and scholarships for
                      federal financial aid recipients.
                    </p></compare-section
                  >

                  <compare-section
                    :schools="schools"
                    title="By Family Income Category"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'income',
                      color: '#1874DC',
                      max: 60000,
                      type: 'currency',
                      chart: 'HorizontalBar',
                      currentIncomeFilter: currentIncomeFilter,
                    }"
                  >
                    <p>
                      Depending on the federal, state, or institutional grant
                      aid available, students in your income bracket may pay
                      more or less than the overall average costs.
                    </p>
                    <p class="overline mb-1">What's your family income?</p>
                    <v-select
                      :items="[
                        { label: '$0-$30,000', value: '0-30000' },
                        { label: '$30,001-$48,000', value: '30001-48000' },
                        { label: '$48,001-$75,000', value: '48001-75000' },
                        { label: '$75,001-$110,000', value: '75001-110000' },
                        { label: '$110,001+', value: '110001-plus' },
                      ]"
                      item-text="label"
                      item-value="value"
                      label="What's your family income?"
                      v-model="currentIncomeFilter"
                      color="secondary"
                      solo
                      class="compare-select"
                    ></v-select>
                  </compare-section>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Graduation & Retention-->
              <v-expansion-panel>
                <v-expansion-panel-header
                  @click="trackAccordion('Graduation &amp; Retention')"
                  >Graduation & Retention</v-expansion-panel-header
                >
                <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                  <v-expand-transition>
                    <median-toggle
                      :display-toggle="medianToggle"
                      @median-switch-click="handleMedianToggle"
                      @median-tab-change="handleMedianToggle"
                      group-name="School Type"
                      label-prefix="Midpoint for "
                      :tab-style="{
                        width: '32%',
                      }"
                      v-show="showResource === 'institutions' && !showPellOnly"
                      class="mt-10"
                    />
                  </v-expand-transition>
                  <compare-section
                    :schools="schools"
                    title="Graduation Rate"
                    definition="graduation-rate"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'completionRate',
                      altComputedField: 'completionRatePell',
                      color: '#1874DC',
                      min: {
                        label: '0%',
                        value: 0,
                        style: { height: '60px' },
                      },
                      max: {
                        label: '100%',
                        value: 100,
                        style: { height: '60px' },
                      },
                      type: 'graduation-rate',
                      chart: 'HorizontalBarMedian',
                      medianToggle: medianToggle,
                      showPellOnly: showPellOnly,
                    }"
                    class="mt-5"
                  >
                    <template>
                      <v-checkbox
                        v-model="showPellOnly"
                        label="Show Pell Grant Recipients Only"
                        color="secondary"
                        class="mt-0"
                      >
                        <template v-slot:label>
                          <span>
                            Show Pell Grant Recipients Only&nbsp;
                          </span>
                        </template>
                      </v-checkbox>
                    </template>
                  </compare-section>
                  <compare-section
                    :schools="schools"
                    title="Students Who Return After Their First Year"
                    definition="retention-rate"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'retentionRate',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                    }"
                  />
                  <compare-section
                    :schools="schools"
                    title="Outcomes 8 Years After Attending"
                    definition="outcome-measures"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      color: '#1874DC',
                      chart: 'Sankey',
                      currentSankey: currentSankey,
                      showPellOnly: showPellOnly,
                    }"
                  >
                    <template>
                      <v-checkbox
                        v-model="showPellOnly"
                        label="Show Pell Grant Recipients Only"
                        color="secondary"
                        class="mt-0"
                      >
                        <template v-slot:label>
                          <span>
                            Show Pell Grant Recipients Only&nbsp;
                          </span>
                        </template>
                      </v-checkbox>
                      <sankey-buttons
                        v-on:update-sankey="currentSankey = $event"
                      />
                    </template>
                  </compare-section>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Financial Aid & Debt-->
              <v-expansion-panel>
                <v-expansion-panel-header
                  @click="trackAccordion('Financial Aid &amp; Debt')"
                >
                  Financial Aid & Debt
                </v-expansion-panel-header>

                <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                  <v-select
                    class="mb-5 pt-0"
                    hide-details
                    :items="aidLoanSelectItems"
                    v-model="aidLoanSelect"
                  />

                  <compare-section
                    v-if="aidLoanSelect === 'fed'"
                    :schools="schools"
                    title="Students Receiving Federal Loans"
                    definition="student-aid"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'studentsReceivingLoans',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                    }"
                  />

                  <compare-section
                    v-else
                    :schools="schools"
                    title="Estimated percent of student who had a parent who borrowed"
                    definition="parent-borrowing-rate"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'estimatedParentBorrowedText',
                      chart: 'estimatedParentBorrowed',
                    }"
                  />

                  <compare-section
                    :schools="schools"
                    title="Median Total Debt After Graduation"
                    definition="avg-debt"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField:
                        aidLoanSelect == 'fed'
                          ? 'federalDebt'
                          : aidShowMedianDebtWithPrior
                          ? 'parentPlusDebtAll'
                          : 'parentPlusDebt',
                      color: '#1874DC',
                      type: 'currency',
                      max: 150000,
                      chart: 'HorizontalBar',
                    }"
                  >
                    <template>
                      <div class="d-flex">
                        <p v-if="aidLoanSelect === 'fed'">
                          The typical total debt for undergraduate borrowers who
                          complete college.
                        </p>
                        <v-checkbox
                          class="my-0"
                          v-model="aidShowMedianDebtWithPrior"
                          hide-details
                          v-if="aidLoanSelect == 'plus'"
                        >
                          <template v-slot:label>
                            <span>
                              Include debt borrowed at any prior
                              institutions&nbsp;
                              <tooltip definition="include-debt-prior-inst" />
                            </span>
                          </template>
                        </v-checkbox>
                      </div>
                    </template>
                  </compare-section>

                  <compare-section
                    :schools="schools"
                    title="Typical Monthly Loan Payment"
                    definition="avg-loan-payment"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField:
                        aidLoanSelect == 'fed'
                          ? 'monthlyLoanPayment'
                          : aidShowMedianDebtWithPrior
                          ? 'parentPlusPaymentAll'
                          : 'parentPlusPayment',
                      color: '#1874DC',
                      type: 'currency',
                      max: 1000,
                      chart: 'HorizontalBar',
                    }"
                  >
                    <template>
                      <div class="d-flex">
                        <p class="mb-0">
                          This is based on a standard 10-year payment plan,
                          other
                          <a
                            :href="
                              $url(
                                '/school/transition/?url=' +
                                  encodeURIComponent(
                                    'https://studentaid.gov/loan-simulator'
                                  )
                              )
                            "
                            target="_blank"
                            @click="trackOutboundLink($event)"
                            >payment options<v-icon
                              x-small
                              class="pl-1"
                              color="#007000"
                            >
                              fas fa-external-link-alt
                            </v-icon>
                          </a>
                          are available, like income-driven repayment. An
                          <a
                            target="_blank"
                            :href="
                              $url(
                                '/school/transition/?url=' +
                                  encodeURIComponent(
                                    'https://studentaid.gov/manage-loans/repayment/plans/income-driven'
                                  )
                              )
                            "
                            @click="trackOutboundLink($event)"
                            >income-driven repayment<v-icon
                              x-small
                              class="pl-1"
                              color="#007000"
                            >
                              fas fa-external-link-alt
                            </v-icon>
                          </a>
                          plan sets your monthly student loan payment at an
                          amount that is intended to be affordable based on your
                          income and family size.
                        </p>
                      </div>
                      <div class="d-flex">
                        <v-checkbox
                          class="my-0"
                          v-model="aidShowMedianDebtWithPrior"
                          hide-details
                          v-if="aidLoanSelect == 'plus'"
                        >
                          <template v-slot:label>
                            <span>
                              Include debt borrowed at any prior
                              institutions&nbsp;
                              <tooltip definition="include-debt-prior-inst" />
                            </span>
                          </template>
                        </v-checkbox>
                      </div>
                    </template>
                  </compare-section>

                  <compare-section
                    v-if="aidLoanSelect === 'fed'"
                    :schools="schools"
                    title="Repayment Rate"
                    definition="repayment-rate"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      color: '#1874DC',
                      chart: 'RepaymentRate',
                      showGradOnly: showGradOnly,
                      repaymentStatus: currentRepaymentStatus,
                    }"
                  >
                    <template>
                      <span v-if="showGradOnly">
                        Percentage of borrowers in each category 2 years after
                        entering repayment. For category definitions, please see
                        <a
                          v-bind:href="
                            $url('/data/glossary/#repayment-rate-completers')
                          "
                          >the glossary</a
                        >.
                      </span>
                      <span v-else>
                        Percentage of borrowers in each category 2 years after
                        entering repayment. For category definitions, please see
                        <a v-bind:href="$url('/data/glossary/#repayment-rate')"
                          >the glossary</a
                        >.
                      </span>
                      <v-checkbox
                        class="my-0 mb-2"
                        v-model="showGradOnly"
                        hide-details
                      >
                        <template v-slot:label>
                          <span>
                            Only show data for those who graduated
                          </span>
                        </template>
                      </v-checkbox>
                      <p class="overline mb-1 mt-3">Repayment Status</p>
                      <v-select
                        :items="[
                          { label: 'Making Progress', value: 'makingprogress' },
                          { label: 'Not Making Progress', value: 'noprogress' },
                          { label: 'Deferment', value: 'deferment' },
                          { label: 'Paid in Full', value: 'fullypaid' },
                          { label: 'Forbearance', value: 'forbearance' },
                          { label: 'Defaulted', value: 'default' },
                          { label: 'Delinquent', value: 'delinquent' },
                          { label: 'Discharged', value: 'discharge' },
                        ]"
                        item-text="label"
                        item-value="value"
                        label="Repayment Status"
                        v-model="currentRepaymentStatus"
                        color="secondary"
                        solo
                        class="compare-select"
                      ></v-select>
                    </template>
                  </compare-section>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Salary after Completing-->
              <v-expansion-panel>
                <v-expansion-panel-header
                  @click="
                    trackAccordion('Salary after Completing by Field of Study')
                  "
                  >Typical Earnings</v-expansion-panel-header
                >
                <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                  <median-toggle
                    :display-toggle="medianToggle"
                    @median-switch-click="handleMedianToggle"
                    @median-tab-change="handleMedianToggle"
                    group-name="School Type"
                    label-prefix="Midpoint for "
                    :tab-style="{
                      width: '32%',
                    }"
                    v-show="showResource === 'institutions'"
                    class="mt-10"
                  />

                  <compare-section
                    :schools="schools"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    title="Median Earnings"
                    definition="institution-median-earnings"
                    :config="{
                      computedField: 'medianEarnings',
                      color: '#1874DC',
                      min: {
                        label: '$0',
                        value: 0,
                        style: { height: '60px' },
                      },
                      max: {
                        label: '$100,000',
                        value: 100000,
                        style: { height: '60px' },
                      },
                      type: 'median-earnings',
                      chart: 'HorizontalBarMedian',
                      medianToggle: medianToggle,
                    }"
                    class="mt-5"
                  >
                    <template>
                      <p>
                        The median earnings of former students who received
                        federal financial aid at 10 years after entering the
                        school.
                      </p>
                    </template>
                  </compare-section>

                  <compare-section
                    :schools="schools"
                    title="Percentage Earning More Than a High School Graduate"
                    definition="threshold-earnings"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'percentMoreThanHS',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                    }"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!--Test Scores & Acceptance-->
              <v-expansion-panel>
                <v-expansion-panel-header
                  @click="trackAccordion('Test Scores & Acceptance')"
                  >Test Scores & Acceptance</v-expansion-panel-header
                >
                <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                  <h2 class="pt-5 pb-3">
                    Test Scores
                    <tooltip definition="test-scores" :isCompare="true" />
                  </h2>
                  <p>
                    Students who were admitted and enrolled typically had
                    standardized test scores in these ranges.
                  </p>
                  <compare-section
                    :schools="schools"
                    title="SAT Reading"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'satReading',
                      color: '#1874DC',
                      chart: 'Range',
                    }"
                  />
                  <compare-section
                    :schools="schools"
                    title="SAT Math"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'satMath',
                      color: '#1874DC',
                      chart: 'Range',
                    }"
                  />

                  <compare-section
                    :schools="schools"
                    title="ACT"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'act',
                      color: '#1874DC',
                      chart: 'Range',
                    }"
                  />

                  <compare-section
                    :schools="schools"
                    title="Acceptance Rate"
                    :currentHighlight="currentHighlight"
                    @update-highlight="currentHighlight = $event"
                    :config="{
                      computedField: 'acceptanceRateActual',
                      color: '#1874DC',
                      max: 100,
                      type: 'percent',
                      chart: 'HorizontalBar',
                    }"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Search Form Component -->
          <div v-show="!loading && showSearchForm">
            <v-card class="pa-5 mb-2">
              <div v-show="displayToggle === 'institutions'">
                <h1 class="text-center py-3">
                  No schools selected to compare.
                </h1>

                <div class="text-center py-4">
                  <v-btn
                    rounded
                    color="secondary"
                    :href="this.$url('/search?toggle=institutions')"
                  >
                    search schools
                  </v-btn>
                </div>

                <div class="text-center my-4">
                  Try searching for schools and clicking the
                  <v-icon>fa fa-check-circle</v-icon> to add a school for
                  comparison.
                </div>
              </div>

              <div v-show="displayToggle !== 'institutions'">
                <h1 class="text-center py-3">
                  No fields of study selected to compare.
                </h1>

                <div class="text-center py-4">
                  <v-btn
                    rounded
                    color="secondary"
                    :href="this.$url('/search/?toggle=fos')"
                  >
                    SEARCH FIELDS OF STUDY
                  </v-btn>
                </div>

                <div class="text-center my-4">
                  Try searching for fields of study and clicking the
                  <v-icon>fa fa-check-circle</v-icon> to add a field of study
                  for comparison.
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
        <!-- End Left Content Area -->

        <!-- Left Aside -->
        <v-col lg="3" class="pt-0">
          <v-card v-show="showShareUpdate" class="pa-5 mb-3">
            <p>You are viewing a shared comparison.</p>

            <v-btn
              small
              color="secondary"
              rounded
              @click="handleCompareListSaveClick()"
            >
              Update Your List
            </v-btn>
          </v-card>
          <v-card outline v-bind:class="sidebarSearchClass" class="pa-4 mb-3">
            <p class="searchForTitle mb-2">SEARCH FOR:</p>
            <v-radio-group v-model="sidebarSearchToggle" column>
              <v-radio value="school" color="#007000">
                <template v-slot:label>
                  <div
                    v-bind:style="{
                      'font-weight': sidebarRadioSchoolStyle,
                      color: 'black',
                    }"
                  >
                    School
                  </div>
                </template>
              </v-radio>

              <v-radio value="fos" color="#fdbf32">
                <template v-slot:label>
                  <div
                    v-bind:style="{
                      'font-weight': sidebarRadioFOSStyle,
                      color: 'black',
                    }"
                  >
                    Field of Study
                  </div>
                </template>
              </v-radio>
            </v-radio-group>

            <name-autocomplete
              v-if="sidebarSearchToggle === 'school'"
              id="school-name-auto-complete"
              @school-name-selected="handleSchoolNameSelected"
              :searchEmptyName="false"
            />

            <field-of-study-search
              v-if="sidebarSearchToggle === 'fos'"
              id="school-fos-search"
              @field-of-study-selected="handleFieldOfStudySelected"
            />
            <div></div>
            <!--Due to CSS styling where last element in card copies border radius of parent element-->
          </v-card>
          <v-card class="pa-5 mt-0">
            <paying-for-college />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

.fadeAway {
  display: none;
  transition-property: display;
  transition-duration: 4s;
  transition-delay: 2s;
}

.compare-institution-chip-container {
  border-bottom: 1px $light-gray solid;

  .v-chip {
    height: auto;
    white-space: normal;
  }
}

.compare-fos-chip-container {
  border-bottom: 1px $light-gray solid;

  .v-chip {
    height: auto;
    white-space: normal;
    width: 200px;

    @media (min-width: 960px) {
      width: 250px;
    }
  }

  .compare-fos-chip {
    width: 200px;

    h5 {
      font-weight: normal;
    }
  }
}

.compare-fos-section {
  padding-bottom: 20px;
  border-bottom: 1px $light-gray solid;
}

.compare-tab-title {
  letter-spacing: normal !important;
  color: black !important;
  font-weight: bold;
  text-transform: uppercase;
}

.compare-toggle-school-active {
  background-color: #83c38c !important;
}

.compare-toggle-fos-active {
  background-color: $lighter-yellow;
}

.compare-fos-slider-gold {
  background-color: $fos-accent-color;
}

.field-of-study-select-container {
  border-radius: 4px !important;
  border-left: 20px solid $fos-color-gold !important;
}

.institution-context-panel {
  border-radius: 4px !important;
  border-left: 20px solid $darker-green !important;
}

.compare-select .v-input__slot {
  align-items: center !important;
  justify-items: center !important;
}
</style>

<script>
import Tooltip from "~/components/Tooltip.vue"
import Share from "~/components/Share.vue"
import PayingForCollege from "~/components/PayingForCollege.vue"
import CompareDrawer from "~/components/CompareDrawer.vue"
import HorizontalBar from "~/components/HorizontalBar.vue"
import HorizontalBarMedian from "~/components/HorizontalBarMedian.vue"
import CompareSection from "~/components/compare/Section.vue"
import CompareBlock from "~/components/compare/Block.vue"
import { compare } from "~/js/mixins.js"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import SankeyButtons from "~/components/SankeyButtons.vue"
import { apiGetAll } from "~/js/api.js"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import CannedSearchContainer from "~/components/CannedSearchContainer.vue"
import querystring from "querystring"
import SearchForm from "~/components/SearchForm.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import Router from "~/js/mixins/Router.js"
import { fields, localStorageKeys } from "~/js/constants"
import {
  generateFieldOfStudyUUID,
  decodeFieldOfStudyUUID,
  fieldOfStudyCompareFormat,
} from "~/js/commonFormats"
import ContextToggle from "~/components/ContextToggle.vue"
import { mapGetters } from "vuex"
import MedianToggle from "~/components/MedianToggle.vue"

export default {
  mixins: [ComplexFields, AnalyticsEvents, Router],
  components: {
    tooltip: Tooltip,
    share: Share,
    "paying-for-college": PayingForCollege,
    "horizontal-bar": HorizontalBar,
    "compare-section": CompareSection,
    "compare-block": CompareBlock,
    "sankey-buttons": SankeyButtons,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete,
    "field-of-study-search": FieldOfStudySearch,
    "context-toggle": ContextToggle,
    "median-toggle": MedianToggle,
  },
  data() {
    return {
      panels: [],
      num_panels: 6,
      schools: {
        "2-year schools": [],
        "4-year schools": [],
        "Certificate schools": [],
      },
      currentRaceEthnicity: "American Indian/Alaska Native",
      currentIncomeFilter: "0-30000",
      currentRepaymentStatus: "makingprogress",
      currentSankey: {
        enroll: "enroll_both",
        study: "study_both",
      },
      currentHighlight: "",
      currentFOSHighlight: "",
      loading: true,
      mobilePanels: 0,
      desktopTabs: 1,
      // passedSchools: [],
      cacheList: [],
      responseCache: {
        institution: [],
        fieldsOfStudy: [],
      }, // Cache values from return object for easy access.
      hideShare: ["email"],
      displayToggle: "institutions",
      isSharedComparison: false,
      isSharedFieldOfStudyComparison: false,
      fosSalarySelect: "aid",
      fosSalarySelectItems: [
        { text: "Financial Aid Recipients", value: "aid" },
        { text: "Pell Grant Recipients", value: "pell" },
      ],
      fosFinancialCheckboxIncludePrior: false,
      aidShowMedianDebtWithPrior: false,
      showGradOnly: false,
      showPellOnly: false,
      aidLoanSelect: "fed",
      aidLoanSelectItems: [
        { text: "Federal Student Loans", value: "fed" },
        { text: "Parent Plus Loans", value: "plus" },
      ],
      medianToggle: "group",
      controlTabMedian: 0,
      controlTab: 0,
      sidebarSearchToggle: "school",
    }
  },
  watch: {
    compareSchools() {
      this.responseCache.institution = []
      this.schools["2-year schools"] = []
      this.schools["4-year schools"] = []
      this.schools["Certificate schools"] = []
      this.queryInstitutions()
    },
    compareFieldsOfStudy() {
      this.responseCache.fieldsOfStudy = []
      this.schools["2-year schools"] = []
      this.schools["4-year schools"] = []
      this.schools["Certificate schools"] = []
      this.queryFieldsOfStudy(this.locateFieldsOfStudy())
    },
  },
  computed: {
    shareUrl() {
      let origin = process.isClient ? window.location.origin : ""
      const compareBaseURL = "/compare/?"

      let paramArray = {
        // Institution
        toggle: this.displayToggle,
      }

      // Default to passed schools
      if (this.passedSchools.length > 0) {
        paramArray.s = this.passedSchools
      } else if (this.compareSchools.length > 0) {
        // If not passed from URL, use compare drawer
        paramArray.s = this.compareSchools.map((school) => {
          return school.schoolId
        })
      }

      // Default to passed in FOS
      if (this.passedFieldsOfStudy.length > 0) {
        paramArray.fos = this.passedFieldsOfStudy
      } else if (this.compareFieldsOfStudy.length > 0) {
        // If not passed from URL, use compare drawer and format
        paramArray.fos = this.compareFieldsOfStudy.map((fieldOfStudy) => {
          return generateFieldOfStudyUUID(
            fieldOfStudy.id,
            fieldOfStudy.code,
            fieldOfStudy.credentialLevel
          )
        })
      }

      // Return Composite URL
      //console.log(this.$url(compareBaseURL + this.prepareQueryString(paramArray)))
      return origin + compareBaseURL + this.prepareQueryString(paramArray)
    },
    referrerLink() {
      let referrer
      if (process.isClient) {
        referrer = document.referrer
      } else {
        referrer = null
      }
      return referrer || this.$url("/search")
    },
    showSearchForm() {
      if (
        this.displayToggle === "institutions" &&
        (this.$store.state.institutions.length > 0 ||
          this.passedSchools.length > 0)
      ) {
        return false
      } else if (
        this.displayToggle === "fos" &&
        (this.$store.state.fos.length > 0 ||
          this.passedFieldsOfStudy.length > 0)
      ) {
        return false
      }
      return true
    },
    showShareUpdate() {
      // Check to see if passed school matches local storage, only show "update compare" if they do not match
      if (this.compareSchools.length === 0 && this.passedSchools.length > 0) {
        return true
      }

      if (this.compareSchools.length > 0 && this.passedSchools.length > 0) {
        let compareSchoolsIDs = this.compareSchools.map((school) => {
          return school.schoolId
        })
        if (!_.isEqual(compareSchoolsIDs, this.passedSchools)) {
          return true
        }
      }
      return false
    },
    showShareFieldOfStudyUpdate() {
      // Quick Comparison
      if (
        this.compareFieldsOfStudy.length === 0 &&
        this.passedFieldsOfStudy.length > 0
      ) {
        return true
      }

      if (
        this.compareFieldsOfStudy.length > 0 &&
        this.passedFieldsOfStudy.length > 0
      ) {
        let compareFieldOfStudyStrings = this.compareFieldsOfStudy.map(
          (fieldOfStudy) => {
            return generateFieldOfStudyUUID(
              fieldOfStudy.id,
              fieldOfStudy.code,
              fieldOfStudy.credentialLevel
            )
          }
        )
        if (!_.isEqual(compareFieldOfStudyStrings, this.passedFieldsOfStudy)) {
          return true
        }
      }
      return false
    },
    passedSchools() {
      if (this.queryStringParameters["s"]) {
        // Always set to array, if not convert to array
        return typeof this.queryStringParameters["s"] == "string"
          ? [this.queryStringParameters["s"]]
          : this.queryStringParameters["s"]
      } else {
        return []
      }
    },
    passedFieldsOfStudy() {
      if (this.queryStringParameters["fos"]) {
        // Get from array, parse needed items
        return typeof this.queryStringParameters["fos"] == "string"
          ? [this.queryStringParameters["fos"]]
          : this.queryStringParameters["fos"]
      } else {
        return []
      }
    },
    showResource() {
      // Help decide what to show.
      if (
        !this.loading &&
        !this.showSearchForm &&
        this.displayToggle === "institutions"
      ) {
        return this.displayToggle
      } else if (
        !this.loading &&
        !this.showSearchForm &&
        this.displayToggle === "fos"
      ) {
        return this.displayToggle
      } else {
        return false
      }
    },
    filteredFieldsOfStudy() {
      return this.categorizeFieldsOfStudy(this.responseCache.fieldsOfStudy)
    },
    ...mapGetters({
      compareSchools: "getInstitutions",
      compareFieldsOfStudy: "getFieldsOfStudy",
    }),
    countSchools() {
      return this.passedSchools.length || this.compareSchools.length
    },
    countFieldsOfStudy() {
      return this.passedFieldsOfStudy.length || this.compareFieldsOfStudy.length
    },
    sidebarSearchClass() {
      if (this.sidebarSearchToggle === "fos") {
        //return "field-of-study-select-container fosComboboxCustomColor";
        return "field-of-study-select-container"
      } else {
        return "institution-context-panel"
      }
    },
    sidebarRadioSchoolStyle() {
      if (this.sidebarSearchToggle === "fos") {
        return "normal"
      } else {
        return "bold"
      }
    },
    sidebarRadioFOSStyle() {
      if (this.sidebarSearchToggle === "fos") {
        return "bold"
      } else {
        return "normal"
      }
    },
  },
  methods: {
    all() {
      this.panels = [...Array(this.num_panels).keys()].map((k, i) => i)
    },
    // Reset the panel
    none() {
      this.panels = []
    },

    queryInstitutions() {
      // TODO - Refactor this, make it work for all querying.
      // Data manipulation after the return.
      let params = {}
      params[this.fields.OPERATING] = 1
      params[
        this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
      ] = true
      params[this.fields.SIZE + "__range"] = "0.."
      params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
      params[this.fields.ID + "__range"] = "..999999"
      params["fields"] = "latest,school,id,location"
      params["keys_nested"] = true
      params["all_programs"] = true

      let schoolArray = []
      let paramArray = []

      if (this.passedSchools.length > 0) {
        this.passedSchools.map(function(id) {
          // TODO: Add number check?
          if (parseInt(id)) {
            schoolArray.push(parseInt(id))
            paramArray.push({
              id: parseInt(id),
            })
          }
        })
      } else {
        this.compareSchools.map(function(school) {
          let id = +school.schoolId || +school
          schoolArray.push(id)
          paramArray.push({
            id: id,
          })
        })

        // Update URL with schools from compare drawer using the share URL computed property.  Grabbing only query string from url string
        this.modifyUrl()

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters()
      }

      this.trackCompareList(schoolArray.join(";"))

      this.loading = true
      let request = apiGetAll("/schools/", paramArray)
        .then((responses) => {
          let schoolData = responses.map(function(response) {
            if (response.data.results[0]) {
              return response.data.results[0]
            }
          })

          schoolData.forEach((school) => {
            // if you are passing in some, generate an object
            // of passed in schools so they can be saved
            if (this.passedSchools) {
              this.responseCache.institution.push({
                schoolId: _.get(school, this.fields["ID"]),
                schoolName: _.get(school, this.fields["NAME"]),
              })
            }

            // Organize data to fit page markup
            // TODO - Refactor. Don't manipulate the response.  Keep response whole, filter at display time.
            // It is harder the find data in the array when it is organized like this.
            switch (_.get(school, this.fields["PREDOMINANT_DEGREE"])) {
              case 1:
                this.schools["Certificate schools"].push(school)
                break
              case 2:
                this.schools["2-year schools"].push(school)
                break
              case 3:
                this.schools["4-year schools"].push(school)
                break
            }
          })

          this.loading = false
        })
        .catch((responses) => {
          // TODO - How do we want to handle errors?
          console.error("Issue locating schools for compare...")
          this.loading = false
        })
    },
    queryFieldsOfStudy(fieldsOfStudy) {
      // Start by just doing a sloppy query. Seperate query even if items are at the same school.
      // TODO - Centralize Common params object
      let params = {}
      params[this.fields.OPERATING] = 1
      params[
        this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
      ] = true
      params[this.fields.SIZE + "__range"] = "0.."
      params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
      params[this.fields.ID + "__range"] = "..999999"

      // params['fields'] = [
      //   this.fields['PREDOMINANT_DEGREE'],
      //   this.fields["FIELD_OF_STUDY"]
      // ].join(',')

      // Generate params array, format for API
      let paramArray = fieldsOfStudy.map((fieldOfStudy) => {
        return {
          ...params,
          [this.fields.ID]: fieldOfStudy.id, //Unit ID of institution
          [this.fields.FIELD_OF_STUDY_CODE]: fieldOfStudy.code,
          [this.fields.FIELD_OF_STUDY_LENGTH]: fieldOfStudy.credential.level,
        }
      })

      // TODO - Track Compare List for Fields of Study
      this.loading = true
      let request = apiGetAll("/schools/", paramArray)
        .then((responses) => {
          let fieldOfStudyData = responses.map(function(response) {
            if (response.data.results[0]) {
              return response.data.results[0]["latest.programs.cip_4_digit"][0]
            }
          })

          this.responseCache.fieldsOfStudy = fieldOfStudyData

          this.loading = false
          // Return an array of objects, outside of institutions ready for formatting,
        })
        .catch((responses) => {
          // TODO - How do we want to handle errors?
          console.error("Issue locating Fields of Study for compare...")
          this.loading = false
        })
    },
    handleCompareListSaveClick() {
      this.responseCache.institution.map((school) => {
        this.$store.commit("toggleSchool", school)
      })
      this.responseCache.fieldsOfStudy.map((fos) => {
        this.$store.commit("toggleFieldOfStudy", {
          code: fos.code,
          credentialTitle: fos["credential.title"],
          fosTitle: fos.title,
          id: fos.unit_id,
          institutionName: fos["school.name"],
          credentialLevel: fos["credential.level"],
        })
      })
    },
    handleChipCloseClick(
      removeData,
      compareKey = localStorageKeys.COMPARE_KEY
    ) {
      switch (compareKey) {
        case localStorageKeys.COMPARE_KEY:
          this.$store.commit("toggleSchool", removeData)
          this.modifyUrl()
          break

        case localStorageKeys.COMPARE_FOS_KEY:
          let delObj = {
            code: removeData.code,
            credentialTitle: removeData["credential.title"],
            fosTitle: removeData.title,
            id: removeData.unit_id,
            institutionName: removeData["school.name"],
            credentialLevel: removeData["credential.level"],
          }
          this.$store.commit("toggleFieldOfStudy", delObj)
          this.modifyUrl()
          break
        default:
          break
      }
    },
    modifyUrl() {
      history.replaceState({}, "", this.shareUrl)
    },
    handleDisplayToggleClick(toggleValue) {
      this.displayToggle = Number(toggleValue) === 0 ? "institutions" : "fos"
      this.controlTab = toggleValue

      if (this.displayToggle === "institutions") {
        // Query if not response cache is present
        if (this.responseCache.institution.length === 0) {
          this.queryInstitutions()
        }
        this.modifyUrl()

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters()
      } else if (this.displayToggle === "fos") {
        if (this.responseCache.fieldsOfStudy.length <= 0) {
          this.queryFieldsOfStudy(this.locateFieldsOfStudy())
        }

        this.modifyUrl()

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters()
      }
    },
    locateFieldsOfStudy() {
      let itemsToQuery = []

      // If fields of study are present in the URL
      if (this.passedFieldsOfStudy.length > 0) {
        this.passedFieldsOfStudy.map((fosString) => {
          // Parse FOS string
          let parsedFosString = decodeFieldOfStudyUUID(fosString)
          // TODO - Pattern Match/Validation
          itemsToQuery.push(parsedFosString)
        })
      } else {
        this.compareFieldsOfStudy.map((fieldOfStudy) => {
          // TODO Validation
          itemsToQuery.push({
            id: fieldOfStudy.id,
            code: fieldOfStudy.code,
            credential: {
              level: fieldOfStudy.credentialLevel,
            },
          })
        })

        this.modifyUrl()

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters()
      }

      return itemsToQuery
    },
    handleMedianToggle(toggleValue) {
      this.controlTabMedian = toggleValue
      this.medianToggle = toggleValue === 0 ? "group" : "all"
    },
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        this.$router.push("/search/?search=" + encodeURIComponent(school))
      } else {
        this.$router.push(
          "/search/?search=" +
            encodeURIComponent(school["school.name"]) +
            "&id=" +
            school.id
        )
      }
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      this.$router.push(
        "/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4)
      )
    },
  },
  mounted() {
    // set toggle from URL
    if (
      typeof this.queryStringParameters.toggle != "undefined" &&
      this.queryStringParameters.toggle === "fos"
    ) {
      this.displayToggle = "fos"
      this.controlTab = 1
      this.queryFieldsOfStudy(this.locateFieldsOfStudy())
    } else {
      this.displayToggle = "institutions"
      this.controlTab = 0
      this.queryInstitutions()
    }

    this.medianToggle = "group"
    this.controlTabMedian = 0

    // Did this initiate as a shared comparision
    this.isSharedComparison = this.showShareUpdate
    this.isSharedFieldOfStudyComparison = this.showShareFieldOfStudyUpdate
  },
  metaInfo: {
    title: "Compare",
    meta: [
      {
        key: "og:title",
        name: "og:title",
        content: "Compare | College Scorecard",
      },
      {
        key: "twitter:title",
        name: "twitter:title",
        content: "Compare | College Scorecard",
      },
    ],
  },
}
</script>
