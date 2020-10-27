<template>
  <v-app id="compare" class="compare-page">
    <scorecard-header
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
      active-link="compare"
    />
    <v-content>
      <v-container>
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
                  >&laquo; Back</v-btn>
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
                  :tab-container-style="{width: '100%'}"
                  :tab-style="{width:'50%'}"
                  @context-switch-click="handleDisplayToggleClick"
                  @context-tab-change="handleDisplayToggleClick"
                  :fill-space="true"
                >
                  <template v-slot:tab-school>
                    <h3 class="compare-tab-title">
                      Schools ({{countSchools}})
                    </h3>
                  </template>
                  <template v-slot:tab-fos>
                    <h3 class="compare-tab-title">
                      Fields of Study ({{countFieldsOfStudy}})
                    </h3>
                  </template>

                </context-toggle>
              </div>

              <!--Loader-->
              <div v-if="loading" class="show-loading ma-4">

                <div class="pa-5">
                  <h1 class="title">
                    Loading
                    <v-icon color="#0e365b">fas fa-circle-notch fa-spin</v-icon>
                  </h1>
                </div>

              </div>

              <!-- Institution Top Summary-->
              <div v-else-if="showResource === 'institutions'" class="show-loaded mx-5" id="school">

                <!-- Institution Chips -->
                <div class="compare-institution-chip-container py-5 mb-10">
                  <v-chip-group column>
                    <v-chip
                      class="pa-4 ma-2"
                      v-for="institution in responseCache.institution"
                      :key="institution.schoolId"
                      close
                      @click:close="handleChipCloseClick(institution, 'compare-schools')"
                    >
                      {{institution.schoolName}}
                    </v-chip>
                  </v-chip-group>
                </div>

                <!--Institution Summary Metrics-->
                <v-row>
                  <v-col cols="12" class="px-sm-5 pt-0">
                    <compare-section
                      :schools="schools"
                      title="Average Annual Cost"
                      definition="avg-cost"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'netPrice',
                        color: '#0e365b',
                        max: 150000,
                        type: 'currency',
                        chart: 'HorizontalBar'
                      }"
                    ><p class='my-n3'>Cost includes tuition, living costs, books, and fees minus the average grants and scholarships for federal financial aid recipients.</p></compare-section>

                    <compare-section
                      :schools="schools"
                      title="Graduation Rate"
                      definition="graduation-rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'completionRate',
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      title="Salary After Completing"
                      definition="fos-median-earnings"
                      :config="{
                        computedField: 'earningsRange',
                        color: '#0e365b',
                        chart: 'MultiRange',
                        multiRangeVariable: 'earnings.median_earnings'
                      }"
                    />
                  </v-col>
                </v-row>

              </div><!-- End Institution Top Summary-->

              <!-- Field Of Study Container -->
              <div v-else-if="showResource === 'fos'">

                <!-- Field of Study Chips -->
                <div class="compare-fos-chip-container mb-10 py-5 mx-md-5">

                  <!-- Mobile Chip Layout -->
                  <v-chip-group show-arrows class="d-md-none">
                    <v-chip
                      v-for="fieldOfStudy in responseCache.fieldsOfStudy"
                      :key="`${fieldOfStudy.unit_id}${fieldOfStudy.code}`"
                      close
                      @click:close="handleChipCloseClick(fieldOfStudy, 'compare-fos')"
                    >
                      <div class="compare-fos-chip pa-2">
                        <h4>{{fieldOfStudy.title | formatFieldOfStudyTitle}}</h4>
                        <span class="fos-uppercase-credential-title">
                          {{fieldOfStudy['credential.title'] | formatFieldOfStudyCredentialTitle}}
                        </span>
                        <br>
                        <span>{{fieldOfStudy['school.name']}}</span>
                      </div>

                    </v-chip>
                  </v-chip-group>

                  <!-- MD and larger chip layout -->
                  <v-chip-group class="d-none d-md-block" column>
                    <v-chip
                      class="ma-2"
                      v-for="fieldOfStudy in responseCache.fieldsOfStudy"
                      :key="`${fieldOfStudy.unit_id}${fieldOfStudy.code}`"
                      close
                      @click:close="handleChipCloseClick(fieldOfStudy, 'compare-fos')"
                    >
                      <div class="compare-fos-chip pa-2">
                        <h4>{{fieldOfStudy.title | formatFieldOfStudyTitle}}</h4>
                        <span class="fos-uppercase-credential-title">{{fieldOfStudy['credential.title'] | formatFieldOfStudyCredentialTitle}}</span><br>
                        <span>{{fieldOfStudy['school.name']}}</span>
                      </div>

                    </v-chip>
                  </v-chip-group>
                </div>

                <!-- Field Of Study Data Container -->
                <div class="mx-md-5 mx-2">
                  <div id="compare-salary-after-completing" class="compare-fos-section">
                    <h2 class="pt-5">
                      Salary After Completing
                    </h2>

                    <div class="ml-3">
                      <div id="fos-median-earnings" class="pt-5 mb-5">
                        <h3 class="mb-2">
                          Median Earnings&nbsp;<tooltip definition="fos-median-earnings" :isCompare="true" />
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
                            <div
                               v-if="fosSalarySelect === 'aid'"
                            >
                              <horizontal-bar
                                v-if="slotProps.school && slotProps.school[fields.FOS_EARNINGS_FED]"
                                :value="slotProps.school[fields.FOS_EARNINGS_FED]"
                                :min="0"
                                :max="150000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_EARNINGS_FED]" class="data-na">Data Not Available</div>
                            </div>

                            <div v-else>
                              <horizontal-bar
                                v-if="slotProps.school && slotProps.school[fields.FOS_EARNINGS_PELL]"
                                :value="slotProps.school[fields.FOS_EARNINGS_PELL]"
                                :min="0"
                                :max="150000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_EARNINGS_PELL]" class="data-na">Data Not Available</div>
                            </div>
                          </template>

                        </compare-block>
                      </div>

                      <div id="fos-monthly-earnings" class="mb-5">
                        <h3 class="mb-2">
                          Monthly Earnings&nbsp;<tooltip definition="fos-monthly-earnings" :isCompare="true" />
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
                            <div v-if="fosSalarySelect === 'aid'">
                              <horizontal-bar
                                v-if="slotProps.school && slotProps.school[fields.FOS_EARNINGS_FED]"
                                :value="slotProps.school[fields.FOS_EARNINGS_FED]/12"
                                :min="0"
                                :max="30000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_EARNINGS_FED]" class="data-na">Data Not Available</div>
                            </div>

                            <div v-else>
                              <horizontal-bar
                                v-if="slotProps.school && slotProps.school[fields.FOS_EARNINGS_PELL]"
                                :value="slotProps.school[fields.FOS_EARNINGS_PELL]/12"
                                :min="0"
                                :max="30000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_EARNINGS_PELL]" class="data-na">Data Not Available</div>
                            </div>
                          </template>

                        </compare-block>
                      </div>
                    </div>

                  </div>

                  <div id="compare-financial-aid" class="compare-fos-section mt-10">
                    <h2>Financial Aid</h2>

                    <div class="ml-3">
                      <div id="fos-median-total-debt" class="pt-5 mb-5">
                        <h3 class="mb-2">
                          Median Total Debt After Graduation&nbsp;<tooltip definition="fos-median-debt" :isCompare="true" />
                        </h3>

                        <v-checkbox
                          class="mx-5 mb-5"
                          hide-details
                          v-model="fosFinancialCheckboxIncludePrior"
                          label="Include debt borrowed at any prior institutions"
                        >
                          <template v-slot:label>
                          <span class="profile-fos-include-prior-debt">
                            Include debt borrowed at any prior institutions
                            <tooltip definition="include-debt-prior-inst" />
                          </span>
                          </template>
                        </v-checkbox>

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
                                v-if="slotProps.school && slotProps.school[fields.FOS_DEBT_MEDIAN]"
                                :value="slotProps.school[fields.FOS_DEBT_MEDIAN]"
                                :min="0"
                                :max="30000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_DEBT_MEDIAN]" class="data-na">Data Not Available</div>
                            </div>

                            <div v-else>
                              <horizontal-bar
                                v-if="slotProps.school && slotProps.school[fields.FOS_DEBT_MEDIAN_PRIOR]"
                                :value="slotProps.school[fields.FOS_DEBT_MEDIAN_PRIOR]"
                                :min="0"
                                :max="30000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_DEBT_MEDIAN_PRIOR]" class="data-na">Data Not Available</div>
                            </div>
                          </template>
                        </compare-block>
                      </div>

                      <div id="fos-monthly-loan" class="mb-5">
                        <h3 class="mb-2">
                          Monthly Loan Payment&nbsp;
                              <tooltip v-if="!fosShowDebtAtPrior" definition="fos-monthly-debt-payment" :limitedFoS="fieldsLink" />
                              <tooltip v-else definition="fos-monthly-debt-payment-all-schools" :limitedFoS="fieldsLink" />
                        </h3>

                        <v-checkbox
                          class="mx-5 mb-5"
                          hide-details
                          v-model="fosFinancialCheckboxIncludePrior"
                          label="Include debt borrowed at any prior institutions"
                        >
                          <template v-slot:label>
                          <span class="profile-fos-include-prior-debt">
                            Include debt borrowed at any prior institutions
                            <tooltip definition="include-debt-prior-inst" />
                          </span>
                          </template>
                        </v-checkbox>

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
                                v-if="slotProps.school && slotProps.school[fields.FOS_DEBT_MONTHLY]"
                                :value="slotProps.school[fields.FOS_DEBT_MONTHLY]"
                                :min="0"
                                :max="2000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_DEBT_MONTHLY]" class="data-na">Data Not Available</div>
                            </div>

                            <div v-else>
                              <horizontal-bar
                                v-if="slotProps.school && slotProps.school[fields.FOS_DEBT_MONTHLY_PRIOR]"
                                :value="slotProps.school[fields.FOS_DEBT_MONTHLY_PRIOR]"
                                :min="0"
                                :max="2000"
                                color='#0e365b'
                                :height="25"
                                type="currency"
                                :labels="true"
                              ></horizontal-bar>
                              <div v-if="slotProps.school && !slotProps.school[fields.FOS_DEBT_MONTHLY_PRIOR]" class="data-na">Data Not Available</div>
                            </div>
                          </template>
                        </compare-block>
                      </div>
                    </div>
                  </div>

                  <div id="fos-grad-count" class="my-10">
                    <h2>Number Of Graduates&nbsp;<tooltip definition="fos-number-of-graduates" :isCompare="true" /></h2>
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
                          v-if="slotProps.school && slotProps.school[fields.FOS_GRAD_COUNT]"
                          :value="slotProps.school[fields.FOS_GRAD_COUNT]"
                          :min="0"
                          :max="400"
                          color='#0e365b'
                          :height="25"
                          type="number"
                          :labels="true"
                        ></horizontal-bar>
                        <div
                          v-if="slotProps.school && !slotProps.school[fields.FOS_GRAD_COUNT]"
                          class="data-na"
                        >
                          Data Not Available
                        </div>
                      </template>
                    </compare-block>
                  </div>

                </div>

              </div> <!-- Field Of Study Container End -->

            </v-card> <!-- Top Summary Container-->

            <!-- Institution Metrics-->
            <div v-if="showResource === 'institutions'">

              <!-- Accordion Controls-->
              <v-row>
                <v-col class="text-right mt-5">
                  <v-btn primary @click="all">Expand All</v-btn>
                  <v-btn primary @click="none">Close All</v-btn>
                </v-col>
              </v-row>

              <v-expansion-panels
                class
                multiple
                focusable
                v-model="panels"
              >
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
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="School Information"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        chart: 'SchoolInfo'
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
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
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
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar',
                        currentRaceEthnicityFilter: currentRaceEthnicity
                      }"
                    >
                      <p class="overline mb-1">Race/Ethnicity</p>

                      <v-select
                        :items="[
                            {label: 'American Indian/Alaska Native', value:'American Indian/Alaska Native'},
                            {label: 'Asian', value:'Asian'},
                            {label: 'Black', value:'Black'},
                            {label: 'Hispanic', value:'Hispanic'},
                            {label: 'Native Hawaiian/Pacific Islander', value:'Native Hawaiian/Pacific Islander'},
                            {label: 'Non-resident alien', value:'Non-resident alien'},
                            {label: 'Two or more races', value:'Two or more races'},
                            {label: 'Unknown', value:'Unknown'},
                            {label: 'White', value:'White'},
                        ]"
                        item-text="label"
                        item-value="value"
                        label="Race/Ethnicity"
                        v-model="currentRaceEthnicity"
                        color="secondary"
                        solo
                      ></v-select>
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <!--Costs-->
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Costs')">Costs</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                    <compare-section
                      :schools="schools"
                      title="Average Annual Cost"
                      definition="avg-cost"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'netPrice',
                        color: '#0e365b',
                        max: 150000,
                        type: 'currency',
                        chart: 'HorizontalBar'
                      }"
                    ><p>Cost includes tuition, living costs, books, and fees minus the average grants and scholarships for federal financial aid recipients.</p></compare-section>

                    <compare-section
                      :schools="schools"
                      title="By Family Income Category"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'income',
                        color: '#0e365b',
                        max: 60000,
                        type: 'currency',
                        chart: 'HorizontalBar',
                        currentIncomeFilter: currentIncomeFilter
                      }"
                    >
                      <p>Depending on the federal, state, or institutional grant aid available, students in your income bracket may pay more or less than the overall average costs.</p>
                      <p class="overline mb-1">What's your family income?</p>
                      <v-select
                        :items="[
                            {label: '$0-$30,000', value:'0-30000'},
                            {label: '$30,001-$48,000', value:'30001-48000'},
                            {label: '$48,001-$75,000', value:'48001-75000'},
                            {label: '$75,001-$110,000', value:'75001-110000'},
                            {label: '$110,001+', value:'110001-plus'},
                        ]"
                        item-text="label"
                        item-value="value"
                        label="What's your family income?"
                        v-model="currentIncomeFilter"
                        color="secondary"
                        solo
                      ></v-select>
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <!--Graduation & Retention-->
                <v-expansion-panel>
                  <v-expansion-panel-header
                    @click="trackAccordion('Graduation &amp; Retention')"
                  >Graduation & Retention</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                    <compare-section
                      :schools="schools"
                      title="Graduation Rate"
                      definition="graduation-rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'completionRate',
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
                      }"
                    />
                    <compare-section
                      :schools="schools"
                      title="Students Who Return After Their First Year"
                      definition="retention-rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'retentionRate',
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
                      }"
                    />
                    <compare-section
                      :schools="schools"
                      title="Outcomes 8 Years After Attending"
                      definition="outcome-measures"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        color: '#0e365b',
                        chart: 'Sankey',
                        currentSankey: currentSankey
                      }"
                    >
                      <sankey-buttons v-on:update-sankey="currentSankey = $event" />
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
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
                      }"
                    />

                    <!--TODO - Update Tool Tip-->
                    <compare-section
                      v-else
                      :schools="schools"
                      title="Estimated percent of student who had a parent who borrowed"
                      definition="student-aid"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'estimatedParentBorrowedText',
                        chart:'estimatedParentBorrowed'
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="Median Total Debt After Graduation"
                      definition="avg-debt"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'debtRange',
                        color: '#0e365b',
                        chart: 'MultiRange',
                        multiRangeVariable: 'debt',
                        multiRangeReactive: true,
                        multiRangeAidShowMedianDebtWithPrior: aidShowMedianDebtWithPrior,
                        multiRangeAidLoanSelect: aidLoanSelect
                      }"
                    >
                      <template>
                        <v-checkbox
                          class="my-0"
                          v-model="aidShowMedianDebtWithPrior"
                          hide-details
                        >
                          <template v-slot:label>
                            <span>
                              Include debt borrowed at any prior institutions
                              <!--TODO - Update Tooltip-->
                              <tooltip definition="include-debt-prior-inst" />
                            </span>
                          </template>
                        </v-checkbox>
                      </template>
                    </compare-section>

                    <compare-section
                      :schools="schools"
                      title="Typical Monthly Loan Payment"
                      definition="avg-loan-payment"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'debtRange',
                        color: '#0e365b',
                        chart: 'MultiRange',
                        multiRangeVariable: 'payment',
                        multiRangeReactive: true,
                        multiRangeAidShowMedianDebtWithPrior: aidShowMedianDebtWithPrior,
                        multiRangeAidLoanSelect: aidLoanSelect,
                        max: { value: 1000, label: '$1,000' }
                      }"
                    >
                      <template>
                        <v-checkbox
                          class="my-0"
                          v-model="aidShowMedianDebtWithPrior"
                          hide-details
                        >
                          <template v-slot:label>
                            <span>
                              Include debt borrowed at any prior institutions
                              <!--TODO - Update Tooltip-->
                              <tooltip definition="include-debt-prior-inst" />
                            </span>
                          </template>
                        </v-checkbox>
                      </template>
                    </compare-section>

                  </v-expansion-panel-content>
                </v-expansion-panel>

                <!--Salary after Completing-->
                <v-expansion-panel>
                  <v-expansion-panel-header
                    @click="trackAccordion('Salary after Completing by Field of Study')"
                  >Salary after Completing by Field of Study</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                    <compare-section
                      :schools="schools"
                      title="Salary Ranges by Field of Study"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'earningsRange',
                        color: '#0e365b',
                        chart: 'MultiRange',
                        multiRangeVariable: 'earnings.median_earnings'
                      }"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <!--Test Scores & Acceptance-->
                <v-expansion-panel>
                  <v-expansion-panel-header
                    @click="trackAccordion('Test Scores & Acceptance')"
                  >Test Scores & Acceptance</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                    <h2 class="pt-5 pb-3">
                      Test Scores
                      <tooltip definition="test-scores" :isCompare="true" />
                    </h2>
                    <p>Students who were admitted and enrolled typically had standardized test scores in these ranges.</p>
                    <compare-section
                      :schools="schools"
                      title="SAT Reading"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'satReading',
                        color: '#0e365b',
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
                        color: '#0e365b',
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
                        color: '#0e365b',
                        chart: 'Range',
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="Acceptance Rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{
                        computedField: 'acceptanceRate',
                        color: '#0e365b',
                        max: 100,
                        type: 'percent',
                        chart: 'HorizontalBar'
                      }"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>

              </v-expansion-panels>

            </div>

            <!-- Search Form Component -->
            <div v-show="!loading && showSearchForm">
              <v-card class="pa-5 mb-2">
                <div v-if="displayToggle === 'institutions'">
                  <h1 class="text-center py-3">
                    No schools selected to compare.
                  </h1>

                  <div class="text-center py-4">
                    <v-btn
                      rounded
                      color="secondary"
                      :href="`${$baseUrl}/search?toggle=institutions`"
                    >
                      search schools
                    </v-btn>
                  </div>

                  <p class="text-center my-4">
                    Try searching for schools and clicking the <v-icon>fa fa-plus-circle</v-icon> to add a school for comparison.
                  </p>

                </div>

                <div v-else>
                  <h1 class="text-center py-3">
                    No fields of study selected to compare.
                  </h1>

                  <div class="text-center py-4">
                    <v-btn
                      rounded
                      color="secondary"
                      :href="`${$baseUrl}/search?toggle=fos`"
                    >
                      SEARCH FIELDS OF STUDY
                    </v-btn>
                  </div>

                  <p class="text-center my-4">
                    Try searching for fields of study and clicking the <v-icon>fa fa-plus-circle</v-icon> to add a
                    field of study for comparison.
                  </p>
                </div>


              </v-card>
<!--              <v-card class="px-5 pt-0 pb-5">-->
<!--                <search-form @search-query="directToSearch" />-->
<!--              </v-card>-->
            </div>

          </v-col> <!-- End Left Content Area -->

          <!-- Left Aside -->
          <v-col lg="3">
            <v-card v-if="showShareUpdate" class="pa-5 mb-3">
              <p>You are viewing a shared comparison.</p>

              <v-btn
                small
                color="secondary"
                rounded @click="handleCompareListSaveClick()"
              >
                Update Your List
              </v-btn>

            </v-card>
            <v-card class="pa-5">
              <paying-for-college />
            </v-card>
          </v-col>

        </v-row>
      </v-container> <!-- End Page Content Container -->
    </v-content>

    <scorecard-footer />

    <compare-header
      :showCompare.sync="showCompare"
      :schools="compareSchools"
      :fields-of-study="compareFieldsOfStudy"
    />
    <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
      <compare-drawer
        :schools="compareSchools"
        :fields-of-study="compareFieldsOfStudy"
        :show-info-text="showInfoText"
        @toggle-compare-school="handleToggleCompareItem"
        v-on:close-modal="closeModal()"
        @toggle-more-info="showInfoText = !showInfoText"
      ></compare-drawer>
    </v-bottom-sheet>
  </v-app>
</template>

<style lang="scss" scoped>
  @import 'sass/_variables';

  .compare-institution-chip-container{
    border-bottom: 1px $light-gray solid;

    .v-chip {
      height: auto;
      white-space: normal;
    }
  }

  .compare-fos-chip-container{
    border-bottom: 1px $light-gray solid;

    .v-chip {
      height: auto;
      white-space: normal;
      width:200px;

      @media (min-width: 960px){
        width: 250px;
      }

    }

    .compare-fos-chip{
      width: 200px;

      h5{
        font-weight: normal;
      }

    }
  }

  .compare-fos-section{
    padding-bottom: 20px;
    border-bottom: 1px $light-gray solid;
  }

  .compare-tab-title{
    letter-spacing: normal !important;
    color: black !important;
  }

  .compare-fos-toggle{

  }

  .compare-toggle-school-active{
    background-color: #dee8ef;
  }

  .compare-toggle-fos-active{
    background-color: #fff6dc;
  }

  .compare-fos-slider-gold{
    background-color: $fos-accent-color;
  }

</style>

<script>
import Tooltip from "components/vue/Tooltip.vue";
import Share from "components/vue/Share.vue";
import PayingForCollege from "components/vue/PayingForCollege.vue";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import HorizontalBar from "components/vue/HorizontalBar.vue";
import CompareSection from "components/vue/compare/Section.vue";
import CompareBlock from "components/vue/compare/Block.vue";
import { compare } from "vue/mixins.js";
import ComplexFields from "vue/mixins/ComplexFields.js";
import SankeyButtons from "components/vue/SankeyButtons.vue";
import { apiGetAll } from '../api.js';
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";
import CannedSearchContainer from "components/vue/CannedSearchContainer.vue";
import querystring from "querystring";
import SearchForm from "components/vue/SearchForm.vue";
import NameAutocomplete from "components/vue/NameAutocomplete.vue";
import Router from "vue/mixins/Router.js";
import { fields, localStorageKeys } from '../constants';
import {generateFieldOfStudyUUID, decodeFieldOfStudyUUID, fieldOfStudyCompareFormat} from '../commonFormats';
import ContextToggle from "components/vue/ContextToggle.vue";
import { EventBus } from "../EventBus.js";

export default {
  mixins: [compare, ComplexFields, AnalyticsEvents, Router],
  props: ["baseUrl", "compareSchools","compareFieldsOfStudy"],
  components: {
    tooltip: Tooltip,
    share: Share,
    "paying-for-college": PayingForCollege,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
    "horizontal-bar": HorizontalBar,
    "compare-section": CompareSection,
    "compare-block": CompareBlock,
    "sankey-buttons": SankeyButtons,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete,
    "context-toggle": ContextToggle
  },
  data() {
    return {
      panels: [],
      num_panels: 6,
      schools: {
        "2-year schools": [],
        "4-year schools": [],
        "Certificate schools": []
      },
      currentRaceEthnicity: "American Indian/Alaska Native",
      currentIncomeFilter: "0-30000",
      currentSankey: {
        enroll: "enroll_both",
        study: "study_both"
      },
      currentHighlight: "",
      currentFOSHighlight:"",
      loading: true,
      mobilePanels: 0,
      desktopTabs: 1,
      // passedSchools: [],
      cacheList: [],
      responseCache:{
        institution:[],
        fieldsOfStudy:[]
      }, // Cache values from return object for easy access.
      hideShare:['email'],
      displayToggle: "institutions",
      isSharedComparison: false,
      isSharedFieldOfStudyComparison:false,
      fosSalarySelect:"aid",
      fosSalarySelectItems:[
        { text: "Financial Aid Recipients", value: "aid"},
        { text: "Pell Grant Recipients", value: "pell"}
      ],
      fosFinancialCheckboxIncludePrior: false,
      aidShowMedianDebtWithPrior: false,
      aidLoanSelect:'fed',
      aidLoanSelectItems:[
        { text: "Federal Student Loans", value: "fed"},
        { text: "Parent Plus Loans", value:"plus"}
      ],
      controlTab: 0
    };
  },
  computed: {
    shareUrl() {
      // const compareBaseURL = window.location.origin + this.$baseUrl + '/compare/?toggle=' + this.displayToggle + '&';
      const compareBaseURL = window.location.origin + this.$baseUrl + '/compare/?';

      let paramArray = {
        // Institution
        toggle: this.displayToggle
      };

      // Default to passed schools
      if(this.passedSchools.length > 0){
        paramArray.s = this.passedSchools;
      }else if(this.compareSchools.length > 0){
        // If not passed from URL, use compare drawer
        paramArray.s = this.compareSchools.map((school) => {
          return school.schoolId
        });
      }

      // Default to passed in FOS
      if(this.passedFieldsOfStudy.length > 0){
        paramArray.fos = this.passedFieldsOfStudy;
      }else if(this.compareFieldsOfStudy.length > 0){
        // If not passed from URL, use compare drawer and format
        paramArray.fos = this.compareFieldsOfStudy.map((fieldOfStudy) => {
          return generateFieldOfStudyUUID(fieldOfStudy.id,fieldOfStudy.code,fieldOfStudy.credentialLevel);
        });
      }

      // Return Composite URL
      return compareBaseURL + this.prepareQueryString(paramArray);
    },
    referrerLink() {
      return document.referrer || `${this.$baseUrl}/search`;
    },
    showSearchForm(){
      // if(this.schools['2-year schools'].length > 0 || this.schools['4-year schools'].length > 0 || this.schools['Certificate schools'].length > 0){
      //   return false;
      // }else{
      //   return true;
      // }

      if(this.displayToggle === 'institutions' && this.responseCache.institution.length > 0 ){
        return false;
      }else if(this.displayToggle === 'fos' && this.responseCache.fieldsOfStudy.length > 0){
        return false;
      }
      return true;
    },
    showShareUpdate(){
      // Check to see if passed school matches local storage, only show "update compare" if they do not match
      if(this.compareSchools.length === 0 && this.passedSchools.length > 0){
        return true;
      }

      if(this.compareSchools.length > 0 && this.passedSchools.length > 0){
        let compareSchoolsIDs = this.compareSchools.map((school) => {return school.schoolId});
        if(!_.isEqual(compareSchoolsIDs, this.passedSchools)){
          return true;
        }
      }
      return false;
    },
    showShareFieldOfStudyUpdate(){
      // Quick Comparison
      if(this.compareFieldsOfStudy.length === 0 && this.passedFieldsOfStudy.length > 0){
        return true;
      }

      if(this.compareFieldsOfStudy.length > 0 && this.passedFieldsOfStudy.length > 0){
        let compareFieldOfStudyStrings = this.compareFieldsOfStudy.map((fieldOfStudy) => {
          return generateFieldOfStudyUUID(fieldOfStudy.id, fieldOfStudy.code, fieldOfStudy.credentialLevel);
        });
        if(!_.isEqual(compareFieldOfStudyStrings, this.passedFieldsOfStudy)){
          return true;
        }
      }
      return false;
    },
    passedSchools(){
      if(this.queryStringParameters['s']){
        // Always set to array, if not convert to array
        return (typeof(this.queryStringParameters['s']) == 'string') ? [this.queryStringParameters['s']] : this.queryStringParameters['s'];
      }else{
        return [];
      }
    },
    passedFieldsOfStudy(){
      if(this.queryStringParameters['fos']){
        // Get from array, parse needed items
        return (typeof(this.queryStringParameters['fos']) == 'string') ? [this.queryStringParameters['fos']] : this.queryStringParameters['fos'];
      }else{
        return [];
      }
    },
    showResource(){
      // Help decide what to show.
      if(!this.loading && !this.showSearchForm && this.displayToggle === 'institutions'){
        return this.displayToggle;
      }else if(!this.loading && !this.showSearchForm && this.displayToggle === 'fos'){
        return this.displayToggle;
      }else{
        return false;
      }
    },
    countSchools(){
      return this.passedSchools.length;
    },
    countFieldsOfStudy(){
      return this.passedFieldsOfStudy.length;
    },
    filteredFieldsOfStudy(){
      return this.categorizeFieldsOfStudy(this.responseCache.fieldsOfStudy);
      // // Set up return object
      // let filteredArray = [
      //   {
      //     key: 'certificate',
      //     title: 'certificate',
      //     filterValue: 1,
      //     items: []
      //   },
      //   {
      //     key: 'associate',
      //     title: "associate's Degree",
      //     filterValue: 2,
      //     items: []
      //   },
      //   {
      //     key: 'bachelor',
      //     title: "bachelor's Degree",
      //     filterValue: 3,
      //     items:[]
      //   }
      // ]
      //
      // // Categorize field of study by credential type;
      // filteredArray = filteredArray.map((filterItem) => {
      //   filterItem.items = this.responseCache.fieldsOfStudy.filter((fieldOfStudy) => {
      //     return fieldOfStudy['credential.level'] === filterItem.filterValue;
      //   });
      //
      //   return filterItem;
      // });
      //
      // // Return only items that have counts
      // return filteredArray.filter((filterItem)=>{ return filterItem.items.length > 0; });
      // // return filteredArray;
    }

  },
  methods: {
    all() {
      this.panels = [...Array(this.num_panels).keys()].map((k, i) => i);
    },
    // Reset the panel
    none() {
      this.panels = [];
    },
    directToSearch(params) {
      // Generate URL based on params,
      let qs = querystring.stringify(params);
      let url =
        this.$baseUrl+"/search/?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":");

      // Direct to location.
      window.location.href = url;
    },
    saveCompareList(compareKey, removeFromCompare, addToCompare){
      // TODO - Maybe move this to the local storage mixin?

      // TODO - Add formatting these data values as a function. No formatting inline.
      // Put it in centralized location so all methods can use it.
      switch(compareKey){
        case localStorageKeys.COMPARE_KEY:
          removeFromCompare.forEach((value,key) => {
            this.$emit('toggle-compare-school',{
              schoolId: value.schoolId,
              schoolName: value.schoolName
            },localStorageKeys.COMPARE_KEY);
          });
          addToCompare.forEach((value,key) => {
            this.$emit('toggle-compare-school',{
              schoolId: value.schoolId,
              schoolName: value.schoolName
            },localStorageKeys.COMPARE_KEY);
          });

          // Is no longer a shared comparison
          this.isSharedComparison = false;

          break;
        case localStorageKeys.COMPARE_FOS_KEY:
          removeFromCompare.forEach((value,key) => {
            this.$emit('toggle-compare-school',{
            },localStorageKeys.COMPARE_FOS_KEY);
          });
          addToCompare.forEach((value,key) => {
            this.$emit('toggle-compare-school',{
            },localStorageKeys.COMPARE_FOS_KEY);
          });
          break;
        default:
          removeFromCompare.forEach((value,key) => {
            this.$emit('toggle-compare-school',{
              schoolId: value.schoolId,
              schoolName: value.schoolName
            },localStorageKeys.COMPARE_KEY);
          });
          addToCompare.forEach((value,key) => {
            this.$emit('toggle-compare-school',{
              schoolId: value.schoolId,
              schoolName: value.schoolName
            },localStorageKeys.COMPARE_KEY);
          });
          break;
      }
    },
    queryInstitutions(){
      // TODO - Refactor this, make it work for all querying.
      // Data manipulation after the return.
      let params = {};
      params[this.fields.OPERATING] = 1;
      params[
      this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
        ] = true;
      params[this.fields.SIZE + "__range"] = "0..";
      params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3";
      params[this.fields.ID + "__range"] = "..999999";
      params["fields"] = "latest,school,id,location";
      params["keys_nested"] = true;
      params["all_programs"] = true;

      let schoolArray = [];
      let paramArray = [];

      if(this.passedSchools.length > 0){
        this.passedSchools.map(function (id){
          // TODO: Add number check?
          if(parseInt(id)){
            schoolArray.push(parseInt(id));
            paramArray.push({
              id: parseInt(id)
            });
          }
        })

      }else{
        this.compareSchools.map(function (school) {
          let id = +school.schoolId || +school;
          schoolArray.push(id);
          paramArray.push({
            id: id
          });
        });

        // Update URL with schools from compare drawer using the share URL computed property.  Grabbing only query string from url string
        history.replaceState(
          {},
          "",
          this.shareUrl
        );

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters();
      }

      this.trackCompareList(schoolArray.join(';'));

      this.loading = true;
      let request = apiGetAll(window.api.url, window.api.key, '/schools/', paramArray).then((responses) => {

        let schoolData = responses.map(function (response) {
          if (response.data.results[0]) {
            return response.data.results[0];
          }
        });

        schoolData.forEach((school) => {
          // if you are passing in some, generate an object
          // of passed in schools so they can be saved
          if(this.passedSchools)
          {
            this.responseCache.institution.push({
              schoolId: _.get(school, this.fields["ID"]),
              schoolName: _.get(school, this.fields["NAME"])
            });
          }

          // Organize data to fit page markup
          // TODO - Refactor. Don't manipulate the response.  Keep response whole, filter at display time.
          // It is harder the find data in the array when it is organized like this.
          switch (_.get(school, this.fields["PREDOMINANT_DEGREE"])) {
            case 1:
              this.schools["Certificate schools"].push(school);
              break;
            case 2:
              this.schools["2-year schools"].push(school);
              break;
            case 3:
              this.schools["4-year schools"].push(school);
              break;
          }
        });

        this.loading = false;

      }).catch((responses) => {
        // TODO - How do we want to handle errors?
        console.error("Issue locating schools for compare...");
        this.loading = false;
      });
    },
    queryFieldsOfStudy(fieldsOfStudy){
      // Start by just doing a sloppy query. Seperate query even if items are at the same school.
      // TODO - Centralize Common params object
      let params = {};
      params[this.fields.OPERATING] = 1;
      params[
      this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
        ] = true;
      params[this.fields.SIZE + "__range"] = "0..";
      params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3";
      params[this.fields.ID + "__range"] = "..999999";

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
          [this.fields.FIELD_OF_STUDY_LENGTH]: fieldOfStudy.credential.level
        }
      });

      // TODO - Track Compare List for Fields Of Study
      this.loading = true;
      let request = apiGetAll(window.api.url, window.api.key, '/schools/', paramArray)
        .then((responses) => {

          let fieldOfStudyData = responses.map(function (response) {
            if (response.data.results[0]) {
              return response.data.results[0]['latest.programs.cip_4_digit'][0];
            }
          });

          this.responseCache.fieldsOfStudy = fieldOfStudyData;

          this.loading = false;
          // Return an array of objects, outside of institutions ready for formatting,
        }).catch((responses) => {
          // TODO - How do we want to handle errors?
          console.error("Issue locating Fields Of Study for compare...");
          this.loading = false;
        });

    },
    handleCompareListSaveClick(compareKey = localStorageKeys.COMPARE_KEY){
      if(compareKey === localStorageKeys.COMPARE_KEY){
        this.saveCompareList(localStorageKeys.COMPARE_KEY, this.compareSchools, this.responseCache.institution);
      }else{

      }
    },
    handleChipCloseClick(removeData, compareKey = localStorageKeys.COMPARE_KEY){

      switch(compareKey){
        case localStorageKeys.COMPARE_KEY:
          let filteredSchools = {};

          //region Remove from Results
          //Using lodash, not an array.
          _.forEach(this.schools, (schools, year)=>{
            filteredSchools[year] = schools.filter((school) => {
              return Number(school.id) !== Number(removeData.schoolId)
            });
          })

          this.schools = filteredSchools;
          //endregion

          // remove from response cache.
          this.responseCache.institution = this.responseCache.institution.filter((school) => {
            return Number(school.schoolId) !== Number(removeData.schoolId);
          })

          //region Remove from URL
          // Ensure it is set and is an array
          if(typeof this.queryStringParameters.s === 'object'){
            this.queryStringParameters.s = this.queryStringParameters.s.filter((schoolId) => {
              return Number(schoolId) !== Number(removeData.schoolId);
            });
          }else if (typeof this.queryStringParameters.s === 'string'){
            this.queryStringParameters = _.omit(this.queryStringParameters,'s');
          }

          // Replace state
          history.replaceState(
            {},
            "",
            window.location.origin + this.$baseUrl + '/compare?' + this.prepareQueryString(this.queryStringParameters)
          );
          //endregion

          //region Remove From Compare

          // If not viewing a shared comparison
          if(!this.isSharedComparison){
            // If it exists in the compare drawer
            let compareIndex = _.findIndex(this.compareSchools, (school)=> {
              return Number(school.schoolId) === Number(removeData.schoolId)
            });

            if(compareIndex >= 0)
            {
              this.$emit('toggle-compare-school', removeData, localStorageKeys.COMPARE_KEY);
            }
          }
          //endregion
          break;

        case localStorageKeys.COMPARE_FOS_KEY:

          //region Remove from response cache
          this.responseCache.fieldsOfStudy = this.responseCache.fieldsOfStudy.filter((fieldOfStudy) => {
            if(Number(fieldOfStudy['unit_id']) !== Number(removeData['unit_id'])){
              return true;
            }

            return Number(fieldOfStudy.code) !== Number(removeData.code) &&
              Number(fieldOfStudy['credential.level']) === Number(removeData['credential.level']);
          });
          //endregion

          // region Remove From URL

          // Ensure it is set and is an array
          if(typeof this.queryStringParameters.fos === 'object'){
            this.queryStringParameters.fos = this.queryStringParameters.fos.filter((fieldOfStudyString) => {
              return  fieldOfStudyString !== generateFieldOfStudyUUID(removeData['unit_id'], removeData.code, removeData['credential.level']);
            });
          }else if (typeof this.queryStringParameters.fos === 'string'){
            this.queryStringParameters = _.omitBy(this.queryStringParameters, (value,key)=>{
              return key === 'fos' &&
                value === generateFieldOfStudyUUID(removeData['unit_id'], removeData.code, removeData['credential.level']);
            });
          }

          // Replace state
          history.replaceState(
            {},
            "",
            window.location.origin + this.$baseUrl + '/compare?' + this.prepareQueryString(this.queryStringParameters)
          );
          //endregion

          //region Remove From Compare Drawer

          // If not viewing a shared comparison
          if(!this.isSharedFieldOfStudyComparison){
            // If it exists in the compare drawer
            let compareIndex = _.findIndex(this.compareFieldsOfStudy, (fieldOfStudy)=> {
              return Number(fieldOfStudy['id']) === Number(removeData['unit_id']) &&
                Number(fieldOfStudy.code) === Number(removeData.code) &&
                Number(fieldOfStudy.credentialLevel) === Number(removeData['credential.level']);
            });

            if(compareIndex >= 0)
            {
              this.$emit('toggle-compare-school',
                fieldOfStudyCompareFormat(removeData),
                localStorageKeys.COMPARE_FOS_KEY
              );
            }
          }

          //endregion

          break;
        default:
          break;
      }
    },
    handleDisplayToggleClick(toggleValue){
      this.displayToggle = (Number(toggleValue) === 0)? 'institutions' : 'fos';
      this.controlTab = toggleValue;

      if(this.displayToggle === 'institutions'){
        // Query if not response cache is present
        if(this.responseCache.institution.length === 0){
          this.queryInstitutions();
        }

        // TODO - Move to a centralized location.
        // update the URL
        history.replaceState(
          {},
          "",
          this.shareUrl
        );

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters();

      }else if(this.displayToggle === 'fos'){
        if(this.responseCache.fieldsOfStudy.length <= 0){
          this.queryFieldsOfStudy(this.locateFieldsOfStudy());
        }

        // TODO - Move to a centralized location.
        // update the URL
        history.replaceState(
          {},
          "",
          this.shareUrl
        );

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters();
      }
    },
    locateFieldsOfStudy(){

      let itemsToQuery = [];

      // If fields of study are present in the URL
      if(this.passedFieldsOfStudy.length > 0){
        this.passedFieldsOfStudy.map((fosString) => {
          // Parse FOS string
          let parsedFosString = decodeFieldOfStudyUUID(fosString);
          // TODO - Pattern Match/Validation
          itemsToQuery.push(parsedFosString);
        })

      }else{
        this.compareFieldsOfStudy.map((fieldOfStudy) => {
          // TODO Validation
          itemsToQuery.push({
            id: fieldOfStudy.id,
            code: fieldOfStudy.code,
            credential:{
              level: fieldOfStudy.credentialLevel
            }
          })
        });

        // TODO - Remove URL updating from this method
        // Update URL with schools from compare drawer using the share URL computed property.  Grabbing only query string from url string
        history.replaceState(
          {},
          "",
          this.shareUrl
        );

        //update URL parameters
        this.queryStringParameters = this.parseURLParameters();
      }

      return itemsToQuery;
    }
  },
  mounted() {
    // set toggle from URL
    if(typeof this.queryStringParameters.toggle != 'undefined' && this.queryStringParameters.toggle === 'fos'){
      this.displayToggle = 'fos';
      this.controlTab = 1;
      this.queryFieldsOfStudy(this.locateFieldsOfStudy());
    }else{
      this.displayToggle = 'institutions';
      this.controlTab = 0;
      this.queryInstitutions();
    }

    // Did this initiate as a shared comparision
    this.isSharedComparison = this.showShareUpdate;
    this.isSharedFieldOfStudyComparison = this.showShareFieldOfStudyUpdate;

    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
      this.showCompare = true;
      this.showInfoText = showCompareInfo;
    });
  }
};
</script>