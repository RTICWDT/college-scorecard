<template>
  <v-main>
    <data-navigation :current="$url('/data/changelog/')" />

    <v-container class="px-0">
      <v-row>
        <v-col cols="12">
          <v-card class="py-5 px-10 ma-5" flat>
            <h1 class="display-1 mb-2 font-weight-bold">Change Log</h1>
            <hr />
            <p>
              This page includes a description and timeline for the changes that
              have been made to either the College Scorecard tool or to the
              underlying data. Check back for updates to learn more about the
              updates and improvements we have made.
            </p>
            <v-row>
              <v-col class="text-right">
                <v-btn color="" @click="all" class="my-2 mr-2"
                  >Expand All</v-btn
                >
                <v-btn color="" @click="none" class="my-2">Close All</v-btn>
              </v-col>
            </v-row>
            <v-expansion-panels multiple v-model="panels">
              <v-expansion-panel>
                <v-expansion-panel-header
                  >October 10, 2023</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On October 10, 2023, the Department updated the College Scorecard downloadable data files and the API as indicated below.
                  </p>
                  <p>
                    Specific data updates in this release include:
                  </p>
                  <ul>
                    <li>
                      More recent data values derived from Federal Student Aid sources for the following data metrics were included:
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Heightened Cash Monitoring Flag</li>
                        <li>Accrediting Agency Name and Code</li>
                        <li>Title IV Approval Date</li>
                        <li>Federal School Code</li>
                      </ul>
                    </li>                    
                    <li>
                      Updates derived from the Office of Postsecondary Education (OPE) eligibility matrix for data metrics 
                      identifying Minority Serving Institutions. 
                    </li>
                    <li>
                      New institution-level data were added for the street address of the institution; the control of the 
                      institution based on Federal Student Aid data; outcomes data for students that did not receive a Pell 
                      Grant, and a suppressed version of the admission rate.  
                    </li>
                    <li>
                      A change to the developer-friendly name for one metric (GT_THRESHOLD_4YR) was made to harmonize the 
                      developer-friendly name with the variable description. The new developer-friendly names is active immediately. 
                      The old developer-friendly name will also point to this metric until the next data update, at which time it 
                      will no longer be in service.
                    </li>                     
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>              
              <v-expansion-panel>
                <v-expansion-panel-header
                  >April 25, 2023</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On April 25, 2023, the Department updated the College Scorecard website with more recent data for 
                    metrics from the Integrated Postsecondary Education Data System (IPEDS), the National Student Loan 
                    Data System (NSLDS) and the Internal Revenue Service (IRS). The website was updated to add 
                    information on graduate-level fields of study offered at colleges to the Field of Study search and 
                    to refresh the overall design of the user interface. In addition, new data on Campus Diversity—including 
                    Race/Ethnicity for Full-Time staff and Student to Faculty ratio—were added to the individual institution 
                    profiles. 
                  </p>
                  <p>
                    Specific data updates in this release include:
                  </p>
                  <ul>
                    <li>
                      Updates to all data metrics derived from IPEDS with more recent data values from a new data collection year. 
                    </li>
                    <li>
                      Refreshed cumulative loan debt data metrics derived from NSLDS at the institution-level and for individual 
                      fields of study.   
                    </li>
                    <li>
                      Refreshed dollar-based repayment rates data metrics derived from NSLDS at the institution-level. 
                    </li>
                    <li>
                      Added borrower-based repayment rates measured 4 years after entry into repayment (both institution-level 
                      and field of study-level data).  
                    </li>
                    <li>
                      Added median earnings measured 4 years after completion of a credential (both institution-level and 
                      field of study-level data). 
                    </li>
                    <li>Added undergraduate student/faculty ratio and the metrics describing the share of staff by race/ethnicity and by gender.                       
                    </li>
                    <li>Added a distance education indicator to the field of study-level data. 
                    </li>
                    <li>
                      Updated data derived from Federal Student Aid sources to
                      more recent values for the following data metrics:
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Heightened Cash Monitoring Flag</li>
                        <li>Accrediting Agency Name and Code</li>
                        <li>Title IV Approval Date</li>
                        <li>Federal School Code</li>
                        <li>Cohort Default Rate</li>
                      </ul>
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>              
              <v-expansion-panel>
                <v-expansion-panel-header
                  >September 14, 2022</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On September 14, 2022, the Department provided the following
                    updates to the College Scorecard website/API:
                  </p>
                  <ul>
                    <li>
                      Updates (more recent data values) derived from Federal
                      Student Aid sources for the following data metrics:
                      Currently Operating Status Flag, Heightened Cash
                      Monitoring Flag, Accrediting Agency Name and Code, Title
                      IV Approval Date, and Federal School Code.
                    </li>
                    <li>
                      Updates derived from the Office of Postsecondary Education
                      (OPE) eligibility matrix for data metrics identifying
                      Minority Serving Institutions.
                    </li>
                    <li>
                      Records were added to the institution-level data file for
                      institutions that participate in the Integrated
                      Postsecondary Education Data System (IPEDS) but do not
                      have an Office of Postsecondary Education Identification
                      number (OPEID).
                    </li>
                    <li>
                      Corrections were made to the Field of Study data to
                      resolve incorrect information in an underlying data
                      source, resulting in removal of several rows from the data
                      files.
                    </li>
                    <li>
                      The 2020-21 OPEID/UNITID crosswalk was added to the data
                      file download package.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>May 2, 2022</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p>
                    On May 2, 2022, the Department provided the following
                    updates to the College Scorecard website/API:
                  </p>
                  <ul>
                    <li>
                      Updates to all data metrics derived from IPEDS with more
                      recent data values from a new data collection year.
                    </li>
                    <li>
                      Updates (more recent data values) derived from Federal
                      Student Aid sources for the following data metrics: Cohort
                      Default Rate, Currently Operating Status Flag, Heightened
                      Cash Monitoring Flag, Accrediting Agency Name and Code,
                      Title IV Approval Date, and Federal School Code.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >March 14, 2022</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On March 14, 2022, the Department updated the College
                    Scorecard website with more recent data for metrics from the
                    Internal Revenue Service (IRS).
                  </p>

                  <p>
                    Specific data updates in this release include:
                  </p>
                  <ul>
                    <li>
                      Refreshed 1-year earnings cohort to the Field of Study
                      data files and expanding to include disaggregation by Pell
                      Grant recipient status and sex.
                    </li>
                    <li>
                      Added a three-year median earnings measurement point to
                      the Field of Study data files, overall and by Pell Grant
                      recipient status and sex.
                    </li>
                    <li>
                      A change to the assignment of privacy suppressed values
                      for 1 calculated field in the institution-level data file
                      (MDCOMP_PD) was made to ensure consistency with other
                      related calculations.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >February 7, 2022</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On February 7, 2022, the Department updated the College
                    Scorecard website with more recent data for metrics from the
                    National Student Loan Data System (NSLDS) and the Internal
                    Revenue Service (IRS). The user interface of the consumer
                    site was updated to show additional institution-level data
                    as well as midpoint values for select metrics to help site
                    visitors compare the institution’s value of the metric
                    against national medians. In addition, the user interface of
                    the consumer site also added graduation rate by Pell Grant
                    status and more information about admissions test
                    requirements.
                  </p>
                  <p>
                    Specific data updates in this release include:
                  </p>
                  <ul>
                    <li>
                      Re-incorporated entry cohort earnings metrics at the
                      institution-level for 6-, 8-, and 10-years after entering
                      the institution including:
                      <ul>
                        <li>Median earnings at the institution-level</li>
                        <li>
                          Disaggregated median earnings (mean earnings were
                          calculated previously) by family income, dependent
                          status, and sex
                        </li>
                        <li>
                          Proportion of earners earning above a typical high
                          school graduate
                        </li>
                      </ul>
                    </li>
                    <li>
                      Refreshed cumulative loan debt data metrics derived from
                      NSLDS at the institution-level and for individual fields
                      of study.
                    </li>
                    <li>
                      Added borrower-based repayment rates measured 3 years
                      after entry into repayment (both institution-level and
                      field of study-level data).
                    </li>
                    <li>
                      Added outcomes 8-years after entry into the institution
                      specific to Pell Grant recipients and added demographic
                      breakouts for dependency status, sex, and Pell Grant
                      recipient status to the borrower-based repayment rates at
                      the institution level.
                    </li>
                    <li>
                      Added new information about admissions testing
                      requirements derived from IPEDS.
                    </li>
                    <li>
                      Updated data derived from Federal Student Aid sources to
                      more recent values for the following data metrics:
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Heightened Cash Monitoring Flag</li>
                        <li>Accrediting Agency Name and Code</li>
                        <li>Title IV Approval Date</li>
                        <li>Federal School Code</li>
                      </ul>
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >August 3, 2021</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On August 3, 2021, the Department updated and added new data
                    elements that appear on the consumer website and/or the
                    downloadable data files/API:
                  </p>
                  <ul>
                    <li>
                      Additions: a new data point that indicates whether an
                      institution appears in the Department of Labor’s WIOA list
                      of approved training providers based on matching
                      institutional identifying information.
                    </li>
                    <li>
                      Updates: more recent data values derived from Federal
                      Student Aid sources for the following data metrics:
                      Currently Operating Status Flag, Accrediting Agency Name
                      and Code, Title IV Approval Date, and Federal School Code.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >July 20, 2021</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On July 20, 2021, the Department provided the following
                    updates to the College Scorecard website/API:
                  </p>
                  <ul>
                    <li>
                      Updates to all data metrics derived from IPEDS with more
                      recent data values from a new data collection year. Also,
                      the addition of new IPEDS-derived data metrics including:
                      <ul>
                        <li>
                          Estimated costs for books and supplies and living
                          expenses for full-time, first-time
                          degree/certificate-seeking undergraduate students at
                          academic-year calendar-based institutions
                        </li>
                        <li>
                          Beginning and end of fiscal year endowment values
                        </li>
                      </ul>
                    </li>
                    <li>
                      Updates (more recent data values) derived from Federal
                      Student Aid sources for the following data metrics: Cohort
                      Default Rates, Currently Operating Status Flag, Heightened
                      Cash Monitoring Flag, Accrediting Agency Name and Code,
                      Title IV Approval Date, Cohort Default Rate, and Federal
                      School Code.
                    </li>
                    <li>
                      Updates derived from the Office of Postsecondary Education
                      (OPE) eligibility matrix for data metrics identifying
                      Minority Serving Institutions.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >April 4, 2021</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On April 4, 2021, the College Scorecard API was updated to
                    improve stability and efficiency. If you encounter any
                    problems with this revision of the API, please submit an
                    issue at
                    <a
                      href="http://github.com/rticwdt/college-scorecard/"
                      target="_blank"
                      @click="
                        transitionOutboundLink(
                          $event
                        )
                      "
                      >http://github.com/rticwdt/college-scorecard/<i
                        aria-hidden="true"
                        class="v-icon notranslate pl-1 fas fa-external-link-alt theme--light"
                        style="font-size: 12px; color: rgb(0, 112, 0); caret-color: rgb(0, 112, 0);"
                      ></i></a
                    >.
                  </p>
                  <p>Changes include:</p>
                  <ul>
                    <li>
                      <strong
                        >By default, only “<em>latest</em>” data will be
                        returned.</strong
                      >
                      Before this update, the API returned data for all years
                      available unless filtered by the
                      <em>fields</em> parameter. With this update, it now
                      returns only the <em>latest</em> object by default. If
                      your implementation relies on the previous functionality,
                      the flag <em>“&all_years=true”</em> can be appended to
                      your API call to receive data for all years available.
                    </li>
                    <li>
                      <strong
                        >Only specific fields will be available for
                        <em>sort</em> and <em>filter</em> conditions.</strong
                      >
                      Previously, the API allowed any field in the dataset to be
                      used to sort or filter results. Following this update,
                      only a subset of fields will be indexed and available for
                      sorting and filtering. The fields are identified in the
                      latest Data Dictionary under the column <em>INDEX</em> and
                      are generated using only the latest data.
                    </li>
                    <li>
                      <strong>School name autocomplete improvements.</strong> An
                      autocomplete endpoint for institution name is now
                      available. This endpoint takes into account institution
                      aliases and returns IDs and a relevance score based on the
                      text string sent. Individual words must be at least three
                      characters long to produce results. The new endpoint is:
                      <ul class="mt-4">
                        <li>/v1/name-autocomplete?school_search={string}</li>
                      </ul>
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >January 19, 2021</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On January 19, 2021, the Department updated the College
                    Scorecard downloadable data files and the API as indicated
                    below.
                  </p>
                  <ul>
                    <li>
                      More recent data values for
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Heightened Cash Monitoring Flag</li>
                        <li>Accrediting Agency Name</li>
                        <li>Accrediting Agency Code</li>
                        <li>Title IV Approval Date</li>
                      </ul>
                    </li>
                    <li>
                      New institution-level metrics that show the outstanding
                      loan portfolios at each institution in the Stafford,
                      Parent PLUS, and Grad PLUS loan programs.
                    </li>
                    <li>
                      The federal school code has been added to the
                      institution-level data file.
                    </li>
                    <li>
                      New field of study-level metrics that describe the
                      proportions of borrowers that fall into one of eight loan
                      status categories: default, delinquent, forbearance,
                      deferment, not making progress, making progress, paid in
                      full, and discharged.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >January 12, 2021</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On January 12, 2021, the Department updated the College
                    Scorecard website with new post-enrollment repayment status
                    information in the institution profiles on the consumer
                    website. Data updates in this release include:
                  </p>
                  <ul>
                    <li>
                      More recent data values for
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Heightened Cash Monitoring Flag</li>
                        <li>Accrediting Agency Name</li>
                        <li>Accrediting Agency Code</li>
                        <li>Title IV Approval Date</li>
                      </ul>
                    </li>
                    <li>
                      New institution-level metrics that describe repayment
                      progress based on the amount originally borrowed compared
                      to the balance amount at various measurement points.
                    </li>
                    <li>
                      New institution-level metrics that describe the
                      proportions of borrowers that fall into one of eight loan
                      status categories: default, delinquent, forbearance,
                      deferment, not making progress, making progress, paid in
                      full, and discharged.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >December 2, 2020</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On December 2, 2020, the Department updated the College
                    Scorecard website with the second installment of its annual
                    refresh that includes newer, updated data for metrics from
                    NSLDS and Treasury Department data sources. The user
                    interface of the consumer site was also refreshed with an
                    updated look and feel and closer integration of the Field of
                    Study data within the institution profile. This includes
                    additional search options and methods, simplified navigation
                    and updated comparison tool. Data updates in this release
                    include:
                  </p>
                  <ul>
                    <li>
                      Refreshed institution-level data adding a new cohort for
                      cumulative debt and completion rate metrics, and more
                      recent data values for
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Heightened Cash Monitoring Flag</li>
                        <li>Accrediting Agency Name</li>
                        <li>Accrediting Agency Code</li>
                        <li>Title IV Approval Date</li>
                      </ul>
                    </li>
                    <li>
                      New institution-level metrics to describe the rate of
                      Parent PLUS Loan borrowing, the median Parent PLUS Loan
                      debt, and number of graduates earning more than one and a
                      half times the poverty threshold
                    </li>
                    <li>
                      Refreshed Field of Study data adding a new cohort year to
                      the series, including the count of awarded credentials,
                      median debt, and median earnings data on the consumer
                      website, downloadable data files, and API.
                    </li>
                    <li>
                      New Field of Study metrics describing
                      <ul>
                        <li>Median earnings 2 years after completion</li>
                        <li>
                          Number of graduates earning more than one and a half
                          times the poverty threshold
                        </li>
                        <li>
                          Median and mean student debt by Pell Grant status and
                          by sex
                        </li>
                        <li>
                          Median and mean Parent PLUS Loan debt, overall and
                          disaggregated by Pell Grant status and by sex
                        </li>
                      </ul>
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >June 1, 2020</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On June 1, 2020, the Department updated five data elements
                    that appear on the consumer website and/or the downloadable
                    data files/API with more recent data values:
                  </p>
                  <ul class="mb-4">
                    <li>Currently Operating Status Flag</li>
                    <li>Heightened Cash Monitoring Flag</li>
                    <li>Accrediting Agency Name</li>
                    <li>Accrediting Agency Code</li>
                    <li>Title IV Approval Date</li>
                  </ul>
                  <p>
                    In addition, the Department updated school identification
                    information such as name and web address, and added new
                    multi-year (rolling average) versions of the percentage of
                    full-time, first-time degree/certificate-seeking
                    undergraduate students who were 1) awarded a Pell Grant and
                    2) awarded a federal loan.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >March 30, 2020</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On March 30, 2020, the Department provided the following
                    updates to the College Scorecard website/API:
                  </p>
                  <ul>
                    <li>
                      Updates to all data metrics derived from IPEDS with more
                      recent data values from a new data collection year. Also,
                      the addition of new IPEDS-derived data metrics including:
                      <ul>
                        <li>
                          Percentage of full-time, first-time
                          degree/certificate-seeking undergraduate students
                          awarded a Pell Grant
                        </li>
                        <li>
                          Percentage of full-time, first-time
                          degree/certificate-seeking undergraduate students
                          awarded a federal loan
                        </li>
                        <li>
                          Number of full-time, first-time
                          degree/certificate-seeking undergraduate students
                        </li>
                        <li>
                          Unduplicated count of undergraduate students enrolled
                          during a 12-month period
                        </li>
                        <li>
                          Unduplicated count of graduate students enrolled
                          during a 12-month period
                        </li>
                      </ul>
                    </li>
                    <li>
                      Institutions not previously included in the historical
                      data files from 1996-97 to 2016-17 (non-Title IV and
                      deferment-only Title IV institutions) have been added to
                      those data files. As a result of adding these
                      institutions, some metric values that are calculated for
                      related sets of institutions (number of branch campuses,
                      admissions rate for all related campuses, average SAT
                      scores for all related campuses) have changed values.
                    </li>
                    <li>
                      The Department corrected some metrics in the historical
                      data files due to more current data being available and
                      improved consistency in calculations involving precision
                      and applicability rules.
                    </li>
                    <li>
                      Updates (more recent data values) derived from Federal
                      Student Aid sources for the following data metrics:
                      Currently Operating Status Flag, Heightened Cash
                      Monitoring Flag, Accrediting Agency Name and Code, Title
                      IV Approval Date, and Cohort Default Rate.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header
                  >December 12, 2019</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On December 12, 2019, the Department updated five data
                    elements that appear on the consumer website and/or the
                    downloadable data files/API with more recent data values:
                  </p>
                  <ul>
                    <li>Currently Operating Status Flag</li>
                    <li>Accrediting Agency Name</li>
                    <li>Accrediting Agency Code</li>
                    <li>Title IV Approval Date</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >November 20, 2019</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On November 20, 2019, the Department released a new version
                    of the College Scorecard. This update includes:
                  </p>
                  <ul>
                    <li>
                      The incorporation of Field of Study graduate count, debt,
                      and earnings data into the consumer website, downloadable
                      data files, and API.
                    </li>
                    <li>
                      The graduation rate is now presented differently on the
                      consumer website for degree granting and non-degree
                      granting schools. The graduation rate for degree granting
                      schools is the proportion of entering students that
                      graduated at this school within 8 years of entry,
                      regardless of their full-time/part-time status or prior
                      postsecondary experience. The graduation rate for
                      non-degree granting schools is the proportion of
                      full-time, first-time students that have graduated at the
                      same school where they started college within 200% of
                      normal program completion time (e.g., within 18 months for
                      a 9-month certificate)
                    </li>
                    <li>
                      The user interface has been refreshed with an updated look
                      and feel. This includes additional search options and
                      methods, new visualizations for data, simplified
                      navigation and updated comparison tool. Data updates
                      include more recent data values for institution-level
                      completion rate and debt metrics derived from the National
                      Student Loan Data System and more recent data values for
                      the:
                      <ul>
                        <li>Currently Operating Status Flag</li>
                        <li>Accrediting Agency Name</li>
                        <li>Accrediting Agency Code</li>
                        <li>Title IV Approval Date</li>
                      </ul>
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >September 30, 2019</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On September 30, 2019, the Department updated metrics
                    related to IPEDS by switching from IPEDS Preliminary release
                    data for the 2017-18 year to Provisional release data. This
                    change impacted many IPEDS-based metrics and removed 3
                    closed institutions from the data files.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >August 26, 2019</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On August 26, 2019, the Department updated five data
                    elements that appear on the consumer website and/or the
                    downloadable data files/API with more recent data values:
                  </p>
                  <ul class="my-3">
                    <li>Currently Operating Status Flag</li>
                    <li>Heightened Cash Monitoring Flag</li>
                    <li>Accrediting Agency Name</li>
                    <li>Accrediting Agency Code</li>
                    <li>Title IV Approval Date</li>
                  </ul>
                  <p>
                    In addition to updating existing metrics, key changes
                    include:
                  </p>
                  <ul class="my-3">
                    <li>
                      Some institutions that do not participate in Title IV
                      student aid programs were added to the API and
                      downloadable data file for 2017-18. These institutions are
                      identifiable using the Title IV eligibility status flag
                      included in the API and data file.
                    </li>
                    <li>
                      For the small subset of institutions with non-title IV
                      branches, the overall admissions rate and the number of
                      branches metrics in the 2017-18 data changed due to the
                      addition of non-Title IV institutions to the API/data
                      file.
                    </li>
                    <li>
                      Although historical data for Title IV deferment-only
                      institutions and non-Title IV institutions are not yet
                      available via the Scorecard API/data files, those data
                      were taken into consideration in calculating pooled
                      metrics included on the 2017-18 data file. As a result, a
                      small number of institution’s pooled metric values changed
                      compared to the May 21, 2019 data release.
                    </li>
                    <li>
                      Minor corrections to prior released values were needed in
                      the 2016-17 and 2017-18 data files
                      <ul class="my-3">
                        <li>
                          Tuition, fees, books, and supplies metrics for the
                          largest program at perfect child institutions were
                          corrected in the 2016-17 and 2017-18 data files.
                        </li>
                        <li>
                          Outcome measure aggregation metrics (*_ALL,
                          *_FIRSTTIME, *_NOTFIRSTTIME, *_FULLTIME, *_PARTTIME)
                          were corrected in the 2016-17 data file.
                        </li>
                        <li>
                          None of these corrections had an impact on the
                          Scorecard website profiles.
                        </li>
                      </ul>
                    </li>
                    <li>
                      The website was updated to include profiles for currently
                      operating non-Title IV institutions.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >May 21, 2019</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On May 21, 2019, the Department updated the College
                    Scorecard website with the first installment of its annual
                    refresh that includes newer, updated data for metrics
                    derived from IPEDS and FSA data sources, such as cohort
                    default rates. Changes to both the data files/API and the
                    Scorecard website were made. Future installments of the 2019
                    refresh will include metrics derived from the National
                    Student Loan Data System (NSLDS) and data from the
                    Department of the Treasury on earnings after attending
                    college.
                  </p>
                  <p>
                    In addition to updating existing metrics, key data changes
                    include:
                  </p>
                  <ul class="my-3">
                    <li>
                      Institutions with limited Title IV participation
                      (deferment-only institutions) were added to the API and
                      downloadable data file for 2017_18. In addition, a
                      variable indicating the Title IV eligibility status was
                      added to identify these institutions.
                    </li>
                    <li>
                      Additional pooled, suppressed metrics derived from the
                      IPEDS Outcome Measures component (percentages of students
                      who completed an award at the institution, who were still
                      enrolled at the institution, who transferred to another
                      institution, and whose status was unknown) were added to
                      the API and downloadable data files. These new metrics are
                      aggregations of data already available in Scorecard,
                      correspond to cohorts of all entering students, all
                      full-time entering students, all part-time entering
                      students, all first-time entering students, and all
                      non-first-time entering students.
                    </li>
                    <li>
                      Information about the six largest programs of study at
                      institutions following a program-based or continuous
                      enrollment calendar system were added to the API and
                      downloadable data files. These data identify the programs
                      via CIP code and corresponding test description, indicate
                      how long it typically takes (in months) to complete the
                      full program, and provide program costs (tuition, fees,
                      books, and other supplies).
                    </li>
                  </ul>
                  <p>
                    In addition to incorporating the refreshed data, key
                    consumer tool website changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      Expanding the universe of institutions to include 1)
                      non-degree granting institutions and 2) institutions with
                      limited Title IV participation (deferment-only
                      institutions).
                    </li>
                    <li>
                      A table that details the cost and length of the largest
                      programs offered for institutions following a
                      program-based or continuous enrollment calendar display.
                    </li>
                    <li>
                      The Graduation & Retention section of the school profile
                      now includes 8-year outcome measure data.
                    </li>
                  </ul>
                  <p>
                    The data section provides a data file with preliminary
                    cumulative loan debt data for college graduates by field of
                    study.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >October 30, 2018</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On October 30, 2018, the Department updated the College
                    Scorecard website with the third installment of its annual
                    refresh that includes newer, updated data for metrics
                    derived from the NSLDS. In addition to the updated NSLDS
                    metrics, key changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      Pooled, suppressed versions of metrics derived from the
                      IPEDS Outcome Measures component (percentages of students
                      who completed an award at the institution, who were still
                      enrolled at the institution, who transferred to another
                      institution, and whose status was unknown) were added to
                      the API and downloadable data files.
                    </li>
                    <li>
                      Pooled, suppressed versions of the retention and transfer
                      rates were updated to reflect 2016-17, 2015-16, 2014-15,
                      and 2013-14 data.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >September 28, 2018</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    On September 28, 2018, the Department updated the College
                    Scorecard website with the second installment of its annual
                    refresh that includes newer, updated data for metrics from
                    Treasury Department data sources. NSLDS data have not yet
                    been updated
                    <sup>1</sup>, but all other data have been refreshed in
                    2018. In addition to the updated Treasury-derived metrics,
                    key changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      Some Scorecard data elements previously available in the
                      Scorecard data files, but not loaded into the API have now
                      been loaded into the API. These metrics are:
                      <ul class="my-3">
                        <li>
                          IPEDS 200% completion rates for 4 and less-than-4-year
                          institutions
                        </li>
                        <li>
                          Pooled, suppressed versions of the 200% IPEDS
                          completions rates for 4-year and less-than-4-year
                          institutions
                        </li>
                      </ul>
                    </li>
                    <li>
                      A new variable for threshold earnings describing the
                      proportion of former students earning above $28,000 (prior
                      calculations of threshold earnings used a $25,000
                      threshold).
                    </li>
                    <li>
                      The following user interface changes to the College
                      Scorecard consumer website were included with this update:
                      <ul class="my-3">
                        <li>
                          Removal of Percentage Earning above High School
                          Graduate given caveats described in the
                          <a
                            @click="
                              trackDownload('InstitutionDataDocumentation.pdf')
                            "
                            :href="'/assets/InstitutionDataDocumentation.pdf'"
                            target="_blank"
                            >Documentation Report</a
                          >. As this was the default sort of the search results,
                          the default sort was updated to be Salary After
                          Attending.
                        </li>
                        <li>
                          Removal of the national median indicators. On bar
                          charts, the lines that once indicated the national
                          median were removed. Additionally, the arrows and text
                          that stated whether an institution was above or below
                          the national median have also been removed.
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <hr />
                  <p class="footnote">
                    <sup>1</sup> NSLDS -derived data elements will also be
                    updated in the fall of 2018
                    <br />
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >September 6, 2018</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    In early September 2018, the Department updated the College
                    Scorecard website with the first installment of its annual
                    refresh that includes newer, updated data for many elements.
                    Data elements coming from the NSLDS and the Treasury
                    Department have not yet been updated
                    <sup>1</sup>, but all other data have been refreshed (e.g,
                    IPEDS-based metrics). Key changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      In addition to accessing data by year in the API,
                      developers can now reference a top-level “latest” object
                      that will contain the most recent data available for a
                      particular institution.
                    </li>
                    <li>
                      Updates to IPEDS data due to revisions by institutions
                      have been applied to the 2015-16 Scorecard data files
                      (2014-15 and prior Scorecard files released in September
                      2017 already used final IPEDS data)
                    </li>
                    <li>
                      Metrics in the 2015-16 Scorecard data file based on the
                      Outcome Measures (OM) component of IPEDS have been updated
                      to use the 2015-16 OM component files instead of the
                      2016-17 OM data. 2016-17 data was previously included in
                      the 2015-16 Scorecard data as a proxy due initial
                      availability issues for the 2015-16 OM data file.
                    </li>
                    <li>
                      Some Scorecard data elements are available in the
                      September 2018 data release that were not previously made
                      available in Scorecard data files and API:
                      <ul class="my-3">
                        <li>
                          Pooled, suppressed versions of the 100% IPEDS
                          completions rates for 4-year and less-than-4-year
                          institutions
                        </li>
                        <li>
                          IPEDS 150% completions rates for 4-year and
                          less-than-4-year institutions by Pell Grant and
                          Subsidized Direct Loan recipient status (received a
                          Pell Grant, received a Subsidized Direct Loan but not
                          a Pell Grant, and received neither a Pell Grant nor a
                          Subsidized Direct Loan)
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <hr />
                  <p class="footnote">
                    <sup>1</sup> NSLDS and Treasury Department derived data
                    elements will also be updated in the fall of 2018
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>March 2018</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p>
                    In March 2018, the Department updated five data elements
                    that appear on the consumer website and/or the downloadable
                    data files/API with more recent data values:
                  </p>
                  <ul class="my-3">
                    <li>Currently Operating Status Flag</li>
                    <li>Heightened Cash Monitoring Flag</li>
                    <li>Accrediting Agency Name</li>
                    <li>Accrediting Agency Code</li>
                    <li>Title IV Approval Date</li>
                  </ul>
                  <p>
                    The Department also added data elements that pool the
                    retention rate and transfer rate data across years to help
                    stabilize those rates for institutions with smaller cohort
                    sizes. Furthermore, these new rates were suppressed for
                    cohort sizes less than 30 students.
                  </p>
                  <p>
                    In addition, the Department updated the consumer website
                    with the following changes:
                  </p>
                  <ul class="my-3">
                    <li>
                      The share feature has been enhanced to include social
                      media options in addition to e-mail.
                    </li>
                    <li>
                      On the institution comparison page, the "By Family Income
                      Category" and "Race/Ethnicity" charts are now grouped by
                      school type: 4-year, 2-year, or certificate.
                    </li>
                    <li>
                      Some data elements on the institution profile are derived
                      from information from all main and branch campus
                      locations. These metrics are now identified in the tooltip
                      descriptions on the institution profile and comparison
                      pages.
                    </li>
                    <li>
                      The institution profile page currently displays the
                      predominant degree awarded by the institution. If the
                      institution offers additional degrees and/or certificates,
                      this is now noted in the tooltip.
                    </li>
                    <li>
                      The retention rate variable used on the institution
                      profile and comparison pages has been updated to reference
                      the new pooled data variable.
                    </li>
                    <li>
                      Certificate programs are now included in list of Available
                      Programs on the institution page.
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >December 2017</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    In December 2017, the Department updated five data elements
                    that appear on the consumer website and/or the downloadable
                    data files/API with more recent data values:
                  </p>
                  <ul class="my-3">
                    <li>Currently Operating Status Flag</li>
                    <li>Heightened Cash Monitoring Flag</li>
                    <li>Accrediting Agency Name</li>
                    <li>Accrediting Agency Code</li>
                    <li>Title IV Approval Date</li>
                  </ul>
                  <p>
                    In addition, the Department added twenty-eight new data
                    elements corresponding to information from the Outcome
                    Measures survey component of IPEDS. These data provide
                    additional information about completion, transfer, and
                    continued enrollment for cohorts of students beyond (but
                    including) the full-time first-time students captured in
                    most other IPEDS outcomes metrics within the Scorecard data.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >September 2017</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    <strong>Consumer Website:</strong> In September 2017, the
                    U.S. Department of Education (the Department) updated the
                    College Scorecard consumer website with an annual refresh
                    that includes newer, updated data for virtually all
                    elements. In addition, the Department made some changes to
                    how data are presented on the consumer website. Key changes
                    include:
                  </p>
                  <ul class="my-3">
                    <li>
                      School Comparison feature. The consumer website has been
                      updated with a new page for comparing user-selected
                      schools. Users of the website can select schools by
                      clicking on the “Add to Compare” star-icon and then
                      visiting the new page.
                    </li>
                    <li>
                      Replaced “National Average” text with “National Median”.
                      The College Scorecard consumer website has been displaying
                      the National Median values for various metrics to show how
                      schools measure up to other schools. This “average” label,
                      however, was misleading as it was actually the median
                      value. The consumer website now adequately labels these
                      values appropriately.
                    </li>
                  </ul>
                  <p>
                    <strong>Downloadable Data Files and API:</strong> In
                    addition to providing newer, updated data in the College
                    Scorecard downloadable data files and API, the Department
                    updated and replaced all previously published NSLDS metrics
                    with values calculated with a newer NSLDS data extract.
                    These metrics include repayment rates, student loan
                    cumulative debt percentiles, and NSLDS completion rates.
                  </p>

                  <p>
                    In addition, the Department made minor changes in the
                    methodology of how data values were calculated for a small
                    subset of variables. In some cases, the Department
                    recalculated data values and replaced previously published
                    data values. Key changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      The method of calculating the Predominant Award and
                      Highest Award classifications has been changed to count
                      institutions that award only graduate certificates as
                      graduate institutions rather than certificate
                      institutions. In addition, some institutions that
                      previously did not have values of Predominant Award
                      assigned could be classified as certificate institutions
                      using a value of the IPEDS Institutional Category variable
                      (not included in the Scorecard data) that was not used in
                      prior Scorecard releases.
                    </li>
                    <li>
                      The source data for the average faculty salary metrics for
                      the 2001-02 and prior Scorecard data files was updated and
                      as a result, some average faculty salary values have
                      changed in these data files.
                    </li>
                    <li>
                      Whenever institution identifying information from IPEDS
                      (e.g., name) is available in a later data file, the most
                      recent value is used in all Scorecard data files. For
                      example, if an institution changed their name in 2015-16,
                      the new name will be carried through to all Scorecard data
                      files.
                    </li>
                    <li>
                      Updates to IPEDS data due to revisions by institutions
                      have been applied to the 2013-14 and 2014-15 Scorecard
                      data files (2012-13 and prior Scorecard files released in
                      September 2016 already used final IPEDS data).
                    </li>
                    <li>
                      The method for calculating the share of entering
                      undergraduate students who are first-time, full-time
                      degree/certificate-seeking undergraduate students
                      (PFTFTUG1_EF) changed to exclude
                      non-degree/certificate-seeking undergraduate students from
                      the denominator. All institutions had their data replaced
                      for this metric.
                    </li>
                    <li>
                      Some Scorecard data elements are available in the
                      September 2017 data release that were not previously made
                      available in Scorecard data files and API:
                      <ul class="my-3">
                        <li>Open admissions policy indicator</li>
                        <li>
                          Denominator of the percentage of undergraduates that
                          were awarded a Pell grant or federal student loan
                        </li>
                        <li>
                          Number of undergraduate non-degree-seeking students
                          enrolled in the fall of the academic year
                        </li>
                        <li>
                          Number of graduate students enrolled in the fall of
                          the academic year
                        </li>
                        <li>
                          Number of students in the adjusted cohort for the 150%
                          completion rate calculations by race
                        </li>
                        <li>
                          PEPS code corresponding to the accrediting agency
                          provided in the Scorecard data file
                        </li>
                        <li>
                          Earliest date of initial Title IV approval for any
                          location associated with each IPEDS UNITID
                        </li>
                      </ul>
                    </li>
                    <li>
                      One Treasury Department-produced data element (COUNT_ED)
                      describing earnings cohorts is no longer available and has
                      been assigned all NULL values.
                    </li>
                  </ul>
                  <p>
                    * The Department updated all downloadable data files on
                    October 2, making additional values available from
                    NSLDS-derived data (e.g. the 2012-2013 data file)
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >January 2017</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    In January 2017, the Department updated three data elements
                    that appear on the consumer website and/or the downloadable
                    data files/API with more recent data values:
                  </p>
                  <ul class="my-3">
                    <li>Currently Operating Status Flag</li>
                    <li>Heightened Cash Monitoring 2 Flag</li>
                    <li>Accrediting Agency</li>
                  </ul>
                  <p>
                    The Department also made corrections to three elements,
                    improving data quality:
                  </p>
                  <ul class="my-3">
                    <li>
                      The OPEID of two institutions now correctly identifies the
                      institution as the main campus (as opposed to a branch
                      campus)
                    </li>
                    <li>
                      The flag indicating that an institution is a main campus
                      was removed for five institutions across eight years of
                      data, correctly identifying them as branch campuses
                    </li>
                    <li>
                      Repayment rates were recalculated for all institutions
                      across all years of data.
                    </li>
                  </ul>
                  <p>
                    After identifying an error in the code that generates
                    repayment rates, the Department fixed the error and
                    recalculated all repayment rates and replaced the previously
                    published repayment rate data values with revised values.
                    The error was a technical one in the coding that caused
                    undercounting of some borrowers who had not reduced their
                    balances, and therefore inflated repayment rates for almost
                    all schools. This revision includes all repayment rate data
                    values in all of the merged data files and all versions of
                    repayment rates including repayment rates for each repayment
                    rate cohort, the 1-, 3-, 5-, 7-year repayment rates, and all
                    repayment rates disaggregated by demographic category (e.g.
                    first-generation status, gender, etc.). The relative
                    difference—that is, whether schools fall above, about, or
                    below average— is modest; over 90 percent of institutions on
                    the College Scorecard tool do not change categories from the
                    previously published to the new rates. However, in some
                    cases, the nominal differences are significant.
                  </p>
                  <p>
                    The Department also updated the data dictionary to resolve
                    an issue that prevented the repayment rate data elements and
                    one additional data element, describing the share of
                    students with family incomes between $48,001-$75,000, from
                    being accessible from the API. In prior releases, these
                    elements were only available in the downloadable data files.
                    In addition, the Department resolved a data dictionary
                    labeling issue on the description for low income students by
                    independent/dependent status.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >September 2016</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    <strong>Consumer Website:</strong> In September 2016, the
                    U.S. Department of Education (the Department) updated the
                    College Scorecard consumer website with an annual refresh
                    that includes newer, updated data for virtually all
                    elements. Please note that the Department made a minor
                    change to the methodology for calculating the median debt
                    presented on the website. See the description for median
                    loan debt below for more details. In addition, the
                    Department made some changes to how data are presented on
                    the consumer website. Key changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      Presenting completion rates as graduating within 150% of
                      time for all institutions regardless of institutional
                      characteristics. In contrast, the previous consumer
                      website version presented completion rates of either 150%
                      or 200% depending on whether the institution was a
                      four-year institution or a two-year institution,
                      respectively.
                    </li>
                    <li>
                      Identifying minority-serving institutions (MSIs) in the
                      specialized mission category based on the institution’s
                      eligibility to apply for Department MSI grants. In
                      contrast, the previous consumer website version presented
                      only recent grant recipients as MSIs.
                    </li>
                  </ul>
                  <p>
                    <strong>Downloadable Data Files and API:</strong> In
                    addition to providing newer, updated data in the College
                    Scorecard downloadable data files and API, the Department
                    made minor changes in the methodology of how data values
                    were calculated. In some cases, the Department recalculated
                    data values and replaced previously published data values.
                    Key changes include:
                  </p>
                  <ul class="my-3">
                    <li>
                      NSLDS derived data elements:
                      <ul class="my-3">
                        <li>
                          To improve data quality and to better protect
                          individual privacy, many NSLDS-derived data elements,
                          including those describing earning cohorts, have been
                          subject to statistical imputation and minor data
                          improvement recalculations. Many NSLDS-generated data
                          values previously published in the previous data files
                          have been replaced with recalculated data values.
                        </li>
                        <li>
                          In addition, the Department recalculated and replaced
                          earnings cohort data previously calculated by the
                          Treasury Department. These recalculated data elements
                          include:
                          <ul class="my-3">
                            <li>
                              The share of female students (FEMALE), students
                              over 23 at entry (AGEGE24), married students
                              (MARRIED), dependent students (DEPENDENT), veteran
                              students (VETERAN); and first-generation students
                              (FIRST_GEN
                              <sup>1</sup>).
                            </li>
                            <li>
                              The average and median family income of students
                              (FAMINC and MD_FAMINC) and separately of
                              independent students (FAMINC_IND)
                              <sup>2</sup>;
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      MSIs:
                      <ul class="my-3">
                        <li>
                          In the previous version of Scorecard, MSIs were
                          designated as recent MSI grantees. In contrast, MSI
                          indicators in the September 2016 data release (except
                          HBCU) replace the earlier measures and instead are
                          derived from the Eligibility Matrix
                          <sup>3</sup> constructed by the Department. The Matrix
                          classifies eligibility on 19 distinct grant programs.
                          The below bullets indicate the correspondence between
                          the Scorecard indicators and the columns of the
                          Matrix:
                          <ul class="my-3">
                            <li>
                              AANAPII: AANAPISI Elig or AANAPISI-F Elig
                            </li>
                            <li>ANNHI: ANNH Elig or ANNH-F Elig</li>
                            <li>HSI: HSI Elig or HSI Stem Elig</li>
                            <li>NANTI: NASNTI Elig or NASNTI-F Elig</li>
                            <li>PBI: PBI Comp or PBI Mand</li>
                            <li>TRIBAL: TCCU Elig</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Median Loan Debt:
                      <ul class="my-3">
                        <li>
                          In the previous version of Scorecard, the median
                          undergraduate loan debt (DEBT_MDN) was calculated for
                          those who separated (i.e., either graduated or
                          withdrew) in a given fiscal year , measured at the
                          time of calculation (October 2014). These values were
                          recalculated and replaced, by calculating median debt
                          for those who separate in a given fiscal year,
                          measured at the time of separation.
                          <sup>4</sup>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Carnegie Classification:
                      <ul class="my-3">
                        <li>
                          Carnegie Classification data are now based on the 2015
                          Carnegie Classification scheme. Previously published
                          data from the previous version of Scorecard (using the
                          previous Carnegie Classification scheme) are no longer
                          available in the data files.
                        </li>
                      </ul>
                    </li>
                    <li>
                      New Data Elements:
                      <ul class="my-3">
                        <li>
                          Scorecard data elements available in the September
                          2016 data release that were not previously made
                          available in Scorecard data files and API:
                          <ul class="my-3">
                            <li>Institution name aliases</li>
                            <li>Level of institution</li>
                            <li>
                              Total share of enrollment of undergraduate
                              degree-seeking students who are men
                            </li>
                            <li>
                              Total share of enrollment of undergraduate
                              degree-seeking students who are women
                            </li>
                            <li>
                              Completion rate for first-time, full-time students
                              at four-year institutions (100% of expected time
                              to completion/6 years)
                            </li>
                            <li>
                              Completion rate for first-time, full-time students
                              at less-than-four-year institutions (100% of
                              expected time to completion)
                            </li>
                            <li>
                              Adjusted cohort count for completion rate at
                              four-year institutions (denominator of 100%
                              completion rate)
                            </li>
                            <li>
                              Adjusted cohort count for completion rate at
                              less-than-four-year institutions (denominator
                              of100% completion rate)
                            </li>
                            <li>
                              Transfer rate for first-time, full-time students
                              at four-year institutions (within 150% of expected
                              time to completion/6 years)
                            </li>
                            <li>
                              Transfer rate for first-time, full-time students
                              at less-than-four-year institutions (150% of
                              expected time to completion)
                            </li>
                            <li>
                              Adjusted cohort count for transfer rate at
                              less-than-four-year institutions (denominator of
                              150% transfer rate)
                            </li>
                            <li>
                              Adjusted cohort count for transfer rate at
                              four-year institutions (denominator of 150%
                              transfer rate)
                            </li>
                            <li>
                              Number of students in the cohort for the
                              three-year cohort default rate
                            </li>
                            <li>
                              Number of students in the cohort for the two-year
                              cohort default rate
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Data Elements No Longer Available:
                      <ul class="my-3">
                        <li>
                          Several Treasury Department-produced data elements
                          describing earnings cohorts are no longer available
                          (assigned NULL values). These include age of entry
                          squared (AGE_ENTRY_SQ), log of family income
                          (LNFAMINC) log of family income (LNFAMINC_IND), and
                          the share of students who submitted FAFSA&reg; Forms
                          to only one institution or multiple institutions
                          <sup>5</sup> (FSEND_* for 1-5).
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <hr />
                  <p class="footnote">
                    <sup>1</sup> This data element is redundant with
                    PAR_ED_1STGEN.
                  </p>
                  <p class="footnote">
                    <sup>2</sup> NSLDS calculations of the percentage of
                    students in each income groups are based on nominal dollar
                    values (not adjusted for inflation). This methodology
                    differs from the way the Treasury Department identified
                    income groups (with inflation adjustments) for disaggregated
                    earnings calculations.
                  </p>
                  <p class="footnote">
                    <sup>3</sup> The Eligibility Matrix is available at
                    <a
                      @click="
                        trackDownload(
                          'http://www2.ed.gov/about/offices/list/ope/idues/em2016.xls'
                        )
                      "
                      href="http://www2.ed.gov/about/offices/list/ope/idues/em2016.xls"
                      target="_blank"
                      >http://www2.ed.gov/about/offices/list/ope/idues/em2016.xls<v-icon
                        x-small
                        class="pl-1"
                        color="#007000"
                      >
                        fas fa-external-link-alt
                      </v-icon></a
                    >. For the purpose of the indicators included in Scorecard,
                    some of these programs were combined (and others were not
                    relevant). Values of 5, 6, or ‘E’ in the Matrix yielded a
                    corresponding flag value of 1 (Yes). All other values were
                    mapped to a corresponding flag value of 0 (No). If multiple
                    values were considered for a flag (either across grant
                    programs or across branches of the institution), the
                    Scorecard indicator was set to 1 when any one of the values
                    indicated eligibility.
                  </p>
                  <p class="footnote">
                    <sup>4</sup> In the previous version of Scorecard, if a
                    student separated and then went back and got further
                    undergraduate loans at the same institution after separation
                    and prior to October 2014 (time of measurement), then those
                    additional loans would be included in the total.
                  </p>
                  <p class="footnote">
                    <sup>5</sup> This information recalculated by the Department
                    of Education is available under the data elements
                    APPL_SCH_PCT_GE*.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>March 2016</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p>
                    In March 2016, the Department updated two data elements with
                    more recent data values that appear on both the consumer
                    website and downloadable data files/API:
                  </p>
                  <ul class="my-3">
                    <li>Currently Operating Status Flag</li>
                    <li>Heighten Cash Monitoring Flag</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >February 2016</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <p>
                    In February 2016, the Department expanded the number of
                    institutions that are presented on the College Scorecard
                    consumer website to include roughly 700 less-than-two-year
                    institutions (institutions that predominately award
                    undergraduate certificates) that offer and award Associate
                    and/or Bachelor’s degrees. The previous version of the
                    consumer website did not include these predominantly
                    less-than-two-year institutions.
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DataNavigation from "~/components/DataNavigation.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"

export default {
  mixins: [AnalyticsEvents],
  components: {
    "data-navigation": DataNavigation,
  },
  data() {
    return {
      panels: [],
    }
  },
  methods: {
    all() {
      this.panels = [...Array(29).keys()].map((k, i) => i)
    },
    // Reset the panel
    none() {
      this.panels = []
    },
  },
  metaInfo: {
    title: "Change Log",
    meta: [
      {
        name: 'description',
        content: 'The change log describes the changes that have been made to the College Scorecard or API over time.'
      },
      {
        name: 'keywords',
        content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, API'
      }
    ],
  },
}
</script>
