<style lang="scss" scoped>

.splash-container {
  margin-bottom: -80px;
}

.subsplash-container {
  padding-top: 60px;
}
.banner-text-container {
  position: relative;
  width: 100%;
}

.banner-text-wrapper {
  top: 115px;
  width: 100%;
  position: absolute;

  h1 {
    font-size: 50px;
    font-weight: 700;
  }

  @include xs {
    top: 45px;
    h1 {
      font-size: 25px;
    }
    img {
      width: 17px;
    }
  }

  @include sm {
    top: 70px;
    h1 {
      font-size: 40px;
    }
    img {
      width: 27px;
      top: 5px;
    }
  }

  @include md {
    top: 65px;
    h1 {
      font-size: 40px;
    }
    img {
      width: 27px;
    }
  }

  @include lg {
    top: 93px;
    h1 {
      font-size: 50px;
    }
    img {
      width: 37px;
    }
  }
}
.banner-image-wrapper {
  @include xs { min-height: 30px; }
  @include sm { min-height: 290px; }
  @include md { min-height: 290px; }
  @include lg { min-height: 420px; }
}

.banner-image-small {
  height: 310px;
  object-fit: cover;
  border-radius: 20px;

  @include xs {
    height: 182px;
  }

  @include sm {
    height: 310px;
  }
}

.bg-white {
  background: white !important;
}

.bg-gray {
  background: use-theme('gray-100') !important;
}

.text-black {
  color: black;
}

.top-3 {
  top: 3px;
}

.mw-270 {
  min-width: 270px;
}

.content-box {
  border: 1px solid use-theme('gray-200');
  border-radius: 10px;
  background-color: white;
  padding: 2rem;
  padding-bottom: 1rem;
}

.content-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.h-tag {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.48px;
  text-transform: uppercase;
  font-weight: 600;

  &.tag-green {
    color: use-theme('primary-green');
  }

  &.tag-blue {
    color: use-theme('secondary-blue');
  }
}

.get-materials {
  p {
    font-size: 0.875rem;
  }

  .download-wrapper {
    justify-content: end;
    @include md {
      justify-content: start;
    }
  }
}

.subsplash-blurb {
  min-height: 140px;

  @include md {
    min-height: 0px;
  }
}

.toolkit-icon {
  width: 100px;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #d8dfe8;
  background: white;
  margin-right: 1rem;
}

.anchor-tag {
  position: relative;
  bottom: 100px;
}
</style>

<template>
    <div class="bg-gray splash-container">
      <v-container class="resources-container">
        <Spacer :height="30" />
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="banner-text-container">
              <div class="banner-text-wrapper">
                <h1 class="text-center">
                  <span class="d-block">Educator</span>
                  <span class="d-block">and Advisor</span>
                  <span class="d-block">Resources</span>
                  <img src="~/assets/images/double-caret.svg" alt="Scroll Down" />
                </h1>
              </div>
            </div>
            <div class="banner-image-wrapper">
              <img
                src="~/assets/images/resources-banner.svg"
                alt=""
                class="d-none d-md-block banner-image-large"
                width="100%"
              />
              <img
                src="~/assets/images/resources-banner.svg"
                alt=""
                class="d-block d-md-none banner-image-small"
                width="100%"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="bg-white subsplash-container">
      <v-container class="resources-container">
        <Spacer :height="20" />
        <v-row>
          <v-col cols="12" md="5">
            <p class="mb-2 h-tag tag-green">For Educators</p>
            <h2 class="mb-3">Toolkit for the Classroom</h2>
            <p class="subsplash-blurb">
              Equip your students with the knowledge and tools they need to
              navigate their post-secondary educational journey with confidence.
              This 5-activity series is designed to be picked up by counselors,
              teachers, or college access advisors and used directly with
              students.
            </p>
            <v-btn
              id="firstFocus"
              class="d-block d-md-none"
              color="primary-green"
              variant="outlined"
              @click="scrollToAnchor('educators-anchor')"
            >
              <span class="text-black">View the Educator Toolkit</span>
              <v-icon
                size="x-small"
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
                icon="fa:fas fa-arrow-down"
              />
            </v-btn>
          </v-col>
          <v-col cols="0" md="1" />
          <v-col cols="12" md="5">
            <p class="mb-2 h-tag tag-blue">For Advisors</p>
            <h2 class="mb-3">Toolkit for College Access Advisors</h2>
            <p class="subsplash-blurb">
              Empower college access advisors with this pre-built College
              Scorecard professional development training. Follow our
              comprehensive toolkit to deliver meaningful training on the value
              of the College Scorecard as a resource for students.
            </p>
            <v-btn
              class="d-block d-md-none"
              color="primary-green"
              variant="outlined"
              @click="scrollToAnchor('advisors-anchor')"
            >
              <span class="text-black">View the Advisor Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
                icon="fa:fas fa-arrow-down"
              />
            </v-btn>
          </v-col>
          <v-col cols="0" md="1" />
        </v-row>

        <v-row class="d-none d-md-flex">
          <v-col cols="12" md="5">
            <v-btn
              color="primary-green"
              variant="outlined"
              @click="scrollToAnchor('educators-anchor')"
            >
              <span class="text-black">View the Educator Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
                icon="fa:fas fa-arrow-down"
              />
            </v-btn>
          </v-col>
          <v-col cols="0" md="1" />
          <v-col cols="12" md="5">
            <v-btn
              color="primary-green"
              variant="outlined"
              @click="scrollToAnchor('advisors-anchor')"
            >
              <span class="text-black">View the Advisor Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
                icon="fa:fas fa-arrow-down"
              />
            </v-btn>
          </v-col>
        </v-row>
        <Spacer />
      </v-container>
    </div>

    <div id="educators-anchor" class="anchor-tag" />
    <div class="bg-gray">
      <v-container class="resources-container">
        <Spacer />
        <v-row>
          <v-col cols="12" md="8" class="pb-0">
            <p class="mb-2 h-tag tag-green">For Educators</p>
            <h2 class="mb-3">
              College Scorecard for the Classroom: Empowering Data-Driven
              Decision-Making
            </h2>
          </v-col>
          <Spacer />
        </v-row>
        <v-row class="mt-0">
          <v-col cols="12" md="8">
            <p class="mb-0">
              Enable your students to confidently navigate the higher education
              decision process with essential knowledge and resources. This
              series of 5 activities is designed for counselors, teachers, or
              college access advisors to use directly with their students. These
              activities focus on comprehending College Scorecard data and
              providing students with the tools to make informed decisions
              regarding their higher education aspirations.
            </p>
          </v-col>
          <Spacer />
          <v-col cols="12" md="4" class="get-materials align-self-start">
            <div class="d-flex download-wrapper">
              <div>
                <p class="mb-1">Get the materials (.zip, 3.6 MB)</p>
                <v-btn
                  class="mw-270"
                  color="secondary-green"
                  href="https://ed-public-download.scorecard.network/resources/College_Scorecard_Student_Toolkit.zip"
                  target="_blank"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  Download Activities
                  <v-icon
                    x-small
                    color="white"
                    class="pl-2 pb-1 align-self-end top-3"
                    icon="fa:fas fa-download"
                  />
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <Spacer />
        <v-row>
          <v-col cols="12" md="6">
            <h4 class="mb-5">What's Included:</h4>
            <div class="d-flex">
              <div class="toolkit-icon">
                <img src="~/assets/images/icon-guide.svg" alt="" />
              </div>
              <div>
                <p class="mb-0"><strong>Instructor Guide</strong></p>
                <p>
                  A detailed roadmap to assist the instructor in seamlessly
                  delivering each activity.
                </p>
              </div>
            </div>
            <Spacer :height="20" />
            <div class="d-flex">
              <div class="toolkit-icon">
                <img src="~/assets/images/icon-slides.svg" alt="" />
              </div>
              <div>
                <p class="mb-0"><strong>Activity Slides</strong></p>
                <p>
                  Dynamic presentation slides to guide instructors and captivate
                  students throughout the lessons.
                </p>
              </div>
            </div>
            <Spacer :height="20" />
            <div class="d-flex">
              <div class="toolkit-icon">
                <img src="~/assets/images/icon-docs.svg" alt="" />
              </div>
              <div>
                <p class="mb-0"><strong>Resources</strong></p>
                <p>
                  Supplementary materials to support student learning and
                  engagement during activities.
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <h4 class="mb-5 d-none d-md-block">Contents of the Zip File</h4>
            <div class="content-box">
              <h4 class="mb-5 d-block d-md-none">Contents of the Zip File</h4>
              <a
                href="https://ed-public-download.scorecard.network/resources/students/College_Scorecard_Instructor_Guide.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Instructor Guide</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%201_Introduction-to-College-Scorecard.pptx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-ppt.svg"
                  alt="Powerpoint Presentation File"
                  class="mr-1"
                />Activity 1: Introduction to College Scorecard</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%201_Handout-1.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Activity 1: Handout</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%202_School-Data.pptx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-ppt.svg"
                  alt="Powerpoint Presentation File"
                  class="mr-1"
                />Activity 2: School Data</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%202_Handout-2.1.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Activity 2: Handout 1</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%202_Handout-2.2.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Activity 2: Handout 2</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%203_Field-of-Study.pptx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-ppt.svg"
                  alt="Powerpoint Presentation File"
                  class="mr-1"
                />Activity 3: Field of Study</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%203_Handout-3.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Activity 3: Handout</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%204_Grasping-Financial-Commitments.pptx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-ppt.svg"
                  alt="Powerpoint Presentation File"
                  class="mr-1"
                />Activity 4: Grasping Financial Commitments</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%204_Handout-4.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Activity 4: Handout</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%205_Drawing-Conclusions.pptx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-ppt.svg"
                  alt="Powerpoint Presentation File"
                  class="mr-1"
                />Activity 5: Drawing Conclusions</a
              >
              <br />
              <a
                href="https://ed-public-download.scorecard.network/resources/students/Activity%205_Handout-5.docx"
                target="_blank"
                rel="noreferrer"
                class="content-link"
                ><img
                  src="~/assets/images/icon-doc.svg"
                  alt="Document File"
                  class="mr-1"
                />Activity 5: Handout</a
              >
              <br />
              <hr />
              <a
                href="https://drive.google.com/drive/folders/1GVcbgjMrwGEw3RhJNnex0UpZBYMP4xpz?usp=sharing"
                target="_blank"
                rel="noreferrer"
                class="content-link mb-0"
                ><img
                  src="~/assets/images/icon-google-drive.svg"
                  alt="Google Drive"
                  class="mr-1"
                  width="17px"
                  height="17px"
                />View on Google Drive</a
              >
            </div>
          </v-col>
        </v-row>
        <Spacer />
      </v-container>

      <div id="advisors-anchor" class="anchor-tag" />
      <div class="bg-white">
        <v-container class="resources-container">
          <Spacer />
          <v-row>
            <v-col cols="12" md="8" class="pb-0">
              <p class="mb-2 h-tag tag-blue">For Advisors</p>
              <h2 class="mb-3">
                Professional Development Toolkit for College Access Advisors
              </h2>
            </v-col>
            <Spacer />
          </v-row>
          <v-row class="mt-0">
            <v-col cols="12" md="8">
              <p>
                Welcome to our free, comprehensive toolkit designed to empower
                college access advisors to utilize everything College Scorecard
                has to offer. The toolkit contains three training modules, each
                designed for a 1-hour session. The modules can be tailored to
                meet various professional development needs, equipping advisors
                with the skills to effectively train others on utilizing the
                College Scorecard. Whether you’re leading sessions with
                counselors, presenting at professional conferences, or engaging
                with events hosted by school districts or state agencies, this
                toolkit provides all the necessary resources to train others on
                how best to equip students toward making data-informed decisions
                about higher education.
              </p>
            </v-col>
            <Spacer />
            <v-col cols="12" md="4" class="get-materials align-self-start">
              <div class="d-flex download-wrapper">
                <div>
                  <p class="mb-1">
                    Get the full advisor toolkit (.zip, 4.4 MB)
                  </p>
                  <v-btn
                    class="mw-270"
                    color="secondary-green"
                    href="https://ed-public-download.scorecard.network/resources/College_Scorecard_Counselor_and_Advisor_Toolkit.zip"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    Download Advisor Toolkit
                    <v-icon
                      x-small
                      color="white"
                      class="pl-2 pb-1 align-self-end top-3"
                      icon="fa:fas fa-download"
                    />
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
          <Spacer />
          <v-row>
            <v-col cols="12" md="6">
              <h4 class="mb-5">What's Included:</h4>
              <div class="d-flex">
                <div class="toolkit-icon">
                  <img src="~/assets/images/icon-guide.svg" alt="" />
                </div>
                <div>
                  <p class="mb-0"><strong>Facilitation Guide</strong></p>
                  <p>
                    A step-by-step manual to help instructors seamlessly
                    navigate through the training sessions.
                  </p>
                </div>
              </div>
              <Spacer :height="20" />
              <div class="d-flex">
                <div class="toolkit-icon">
                  <img src="~/assets/images/icon-slides.svg" alt="" />
                </div>
                <div>
                  <p class="mb-0"><strong>Training Slides</strong></p>
                  <p>
                    Engaging presentation slides to facilitate learning and
                    stimulate discussions during training sessions.
                  </p>
                </div>
              </div>
              <Spacer :height="20" />
              <div class="d-flex">
                <div class="toolkit-icon">
                  <img src="~/assets/images/icon-docs.svg" alt="" />
                </div>
                <div>
                  <p class="mb-0"><strong>Handouts</strong></p>
                  <p>
                    Visual aids and supplementary materials to complement the
                    training sessions and reinforce key concepts.
                  </p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <h4 class="mb-5 d-none d-md-block">Contents of the Zip File</h4>
              <div class="content-box">
                <h4 class="mb-5 d-block d-md-none">Contents of the Zip File</h4>
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/College_Scorecard_Facilitation_Guide.docx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-doc.svg"
                    alt="Document File"
                    class="mr-1"
                  />Facilitation Guide</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/College_Scorecard_Training_Slides%20-%20Module%201.pptx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-ppt.svg"
                    alt="Powerpoint Presentation File"
                    class="mr-1"
                  />Training Slides: Module 1</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/Handout_1_Scorecard_Benefits.docx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-doc.svg"
                    alt="Document File"
                    class="mr-1"
                  />Handout 1: College Scorecard Benefits</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/College_Scorecard_Training_Slides%20-%20Module%202.pptx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-ppt.svg"
                    alt="Powerpoint Presentation File"
                    class="mr-1"
                  />Training Slides: Module 2</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/Handout_2_Student_Priorities.docx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-doc.svg"
                    alt="Document File"
                    class="mr-1"
                  />Handout 2: Student Priorities</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/College_Scorecard_Training_Slides%20-%20Module%203.pptx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-ppt.svg"
                    alt="Powerpoint Presentation File"
                    class="mr-1"
                  />Training Slides - Module 3</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/Handout_3_Scenario_Activity.docx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-doc.svg"
                    alt="Document File"
                    class="mr-1"
                  />Handout 3: Scenario Activity</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/Handout_3_Scenario_Activity_Instructor_Guide.docx"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-doc.svg"
                    alt="Document File"
                    class="mr-1"
                  />Handout 3: Scenario Activity, Instructor Guide</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/Handout_4_Tips_for_Delivery.pdf"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-pdf.svg"
                    alt="PDF File"
                    class="mr-1"
                  />Handout 4: Tips for Delivery</a
                >
                <br />
                <a
                  href="https://ed-public-download.scorecard.network/resources/advisors/Using_the_College_Scorecard.pdf"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link"
                  ><img
                    src="~/assets/images/icon-pdf.svg"
                    alt="PDF File"
                    class="mr-1"
                  />Using the College Scorecard</a
                >
                <br />
                <hr />
                <a
                  href="https://drive.google.com/drive/folders/1p9KbEtwyB8HmNQ5dOfo04g8lwuXUnrmh?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  class="content-link mb-0"
                  ><img
                    src="~/assets/images/icon-google-drive.svg"
                    alt="Google Drive"
                    class="mr-1"
                    width="17px"
                    height="17px"
                  />View on Google Drive</a
                >
              </div>
            </v-col>
          </v-row>
          <Spacer />
        </v-container>
      </div>
    </div>
</template>

<script setup>
const { scrollToAnchor } = useScroll()
</script>
