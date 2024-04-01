<style lang="scss" scoped>
@import "~/sass/_variables.scss";
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

  img {
    width: 37px;
    position: relative;
    top: 10px;
  }

  @media only screen and (max-width: 1903px) {
    top: 95px;
  }

  @media only screen and (max-width: 1264px) {
    top: 70px;
    h1 { font-size: 40px; }
    img { width: 27px; }
  }

  @media only screen and (max-width: 959px) {
    top: 80px;
    h1 { font-size: 40px; }
    img { width: 27px; }
  }

  @media only screen and (max-width: 566px) {
    top: 45px;
    h1 { font-size: 25px; }
    img { width: 17px; top: 5px; }
  }
}

.banner-image-small {
  height: 310px;
  object-fit: cover;
  border-radius: 20px;

  @media only screen and (max-width: 566px) {
    height: 182px;
  }
}

.bg-white {
  background:white !important;
}

.bg-gray {
  background: $bg-gray !important;
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
  border: 1px solid #DFE6F0;
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
  font-weight: 100;

  &.tag-green {
    color: #027A48;
  }

  &.tag-blue {
    color: #1570EF;
  }
}

.get-materials {
  p { font-size: .875rem; }

  .download-wrapper {
    justify-content: end;
    @media only screen and (max-width: 959px) {
      justify-content: start;
    }
  }
}

.subsplash-blurb {
  min-height: 140px;

  @media only screen and (max-width: 959px) {
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
  border: 1px solid #D8DFE8;
  background: white;
  margin-right: 1rem;
}

.anchor-tag {
  position: relative;
  bottom: 100px;
}

</style>

<template>
  <v-main>
    <div class="bg-gray splash-container">
      <v-container>
        <Spacer :height="30"/>
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="banner-text-container">
              <div class="banner-text-wrapper">
                <h1 class="text-center">
                  Educator <br/>
                  and Advisor <br/>
                  Resources <br />
                  <img :src="$url('img/double-caret.svg')" />
                </h1>
              </div>
            </div>
            <img :src="$url('img/resources-banner.svg')" alt="Resources" class="d-none d-md-block" width="100%" />
            <img :src="$url('img/resources-banner.svg')" alt="Resources" class="d-block d-md-none banner-image-small" width="100%"/>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="bg-white subsplash-container">
      <v-container>
        <Spacer :height="20" />
        <v-row>
          <v-col cols="12" md="5">
            <p class="mb-2 h-tag tag-green">For Educators</p>
            <h2 class="mb-3">Toolkit for the Classroom</h2>
            <p class="subsplash-blurb">Equip your students with the knowledge and tools they need to navigate their post-secondary educational journey with confidence. This 5-activity series is designed to be picked up by counselors, teachers, or college access advisors and used directly with students.</p>
            <v-btn
              class="d-block d-md-none"
              color="#027A48"
              outlined
              @click="scrollToAnchor('educators-anchor')"
              >
                <span class="text-black">View the Educator Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
              >
                fas fa-arrow-down
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="0" md="1" />
          <v-col cols="12" md="5">
            <p class="mb-2 h-tag tag-blue">For Advisors</p>
            <h2 class="mb-3">Toolkit for College Access Advisors</h2>
            <p class="subsplash-blurb">Empower college access advisors with this pre-built College Scorecard professional development training. Follow our comprehensive toolkit to deliver meaningful training on the value of the College Scorecard as a resource for students.</p>
            <v-btn
              class="d-block d-md-none"
              color="#027A48"
              outlined
              @click="scrollToAnchor('advisors-anchor')"
              >
                <span class="text-black">View the Advisor Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
              >
                fas fa-arrow-down
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="0" md="1" />
        </v-row>

        <v-row class="d-none d-md-flex">
          <v-col cols="12" md="5">
            <v-btn
              color="#027A48"
              outlined
              @click="scrollToAnchor('educators-anchor')"
              >
                <span class="text-black">View the Educator Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
              >
                fas fa-arrow-down
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="0" md="1" />
          <v-col cols="12" md="5">
            <v-btn
              color="#027A48"
              outlined
              @click="scrollToAnchor('advisors-anchor')"
              >
                <span class="text-black">View the Advisor Toolkit</span>
              <v-icon
                x-small
                color="black"
                class="pl-2 pb-1 align-self-end top-3"
              >
                fas fa-arrow-down
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <Spacer />
      </v-container>
    </div>

    <div id="educators-anchor" class="anchor-tag" />
    <div class="bg-gray">
      <v-container>
        <Spacer />
        <v-row>
          <v-col cols="12" md="8">
            <p class="mb-2 h-tag tag-green">For Educators</p>
            <h2 class="mb-3">College Scorecard for the Classroom: Empowering Data-Driven Decision-Making</h2>
            <p class="mb-0">Enable your students to confidently navigate the higher education decision process with essential knowledge and resources. This series of 5 activities is designed for counselors, teachers, or college access advisors to use directly with their students. These activities focus on comprehending College Scorecard data and providing students with the tools to make informed decisions regarding their higher education aspirations.</p>
          </v-col>
          <Spacer />
          <v-col cols="12" md="4" class="get-materials align-self-end">
            <div class="d-flex download-wrapper">
              <div>
                <p class="mb-1">Get the materials (.zip, 4 MB)</p>
                <v-btn
                  class="mw-270"
                  color="secondary"
                  href="https://studentaid.gov/h/apply-for-aid/fafsa"
                  target="_blank"
                  @click="
                    transitionOutboundLink(
                      $event
                    )
                  "
                  >
                    Download Activities
                  <v-icon
                    x-small
                    color="white"
                    class="pl-2 pb-1 align-self-end top-3"
                  >
                    fas fa-download
                  </v-icon>
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
                <img :src="$url('img/icon-guide.svg')" alt="Instructor Guide" />
              </div>
              <div>
                <p class="mb-0"><strong>Instructor Guide</strong></p>
                <p>A detailed roadmap to assist the instructor in seamlessly delivering each activity.</p>
              </div>
            </div>
            <Spacer :height="20" />
            <div class="d-flex">
              <div class="toolkit-icon">
                <img :src="$url('img/icon-slides.svg')" alt="Activity Slides" />
              </div>
              <div>
                <p class="mb-0"><strong>Activity Slides</strong></p>
                <p>Dynamic presentation slides to guide instructors and captivate students throughout the lessons.</p>
              </div>
            </div>
            <Spacer :height="20" />
            <div class="d-flex">
              <div class="toolkit-icon">
                <img :src="$url('img/icon-docs.svg')" alt="Resources" />
              </div>
              <div>
                <p class="mb-0"><strong>Resources</strong></p>
                <p>Supplementary materials to support student learning and engagement during activities.</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <h4 class="mb-5 d-none d-md-block">Contents of the Zip File</h4>
            <div class="content-box">
              <h4 class="mb-5 d-block d-md-none">Contents of the Zip File</h4>
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Instructor_Guide.docx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-ppt.svg')" class="mr-1"/>Lesson-1_Introduction-to-College-Scorecard.pptx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Lesson-1_Resource.docx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-ppt.svg')" class="mr-1"/>Lesson-2_School-Data.pptx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Lesson-2_Resource.docx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-ppt.svg')" class="mr-1"/>Lesson-3_Field-of-Study.pptx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Lesson-3_Resource.docx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-ppt.svg')" class="mr-1"/>Lesson-4_Grasping-Financial-Commitments.pptx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Lesson-4_Resource.docx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-ppt.svg')" class="mr-1"/>Lesson-5_Drawing-Conclusions.pptx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Lesson-5_Resource.docx</a>
              <br />
              <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-pdf.svg')" class="mr-1"/>Using_the_College_Scorecard.pdf</a>
              <br />
              <hr>
              <a href="#" target="_blank" rel="noreferrer" class="content-link mb-0"><img :src="$url('img/icon-google-drive.svg')" class="mr-1" width="17px" height="17px"/>View on Google Drive</a>
            </div>
          </v-col>
        </v-row>
        <Spacer />
      </v-container>

      <div id="advisors-anchor" class="anchor-tag" />
      <div class="bg-white">
        <v-container>
          <Spacer />
          <v-row>
            <v-col cols="12" md="8">
              <p class="mb-2 h-tag tag-blue">For Advisors</p>
              <h2 class="mb-3">Professional Development Toolkit for College Access Advisors</h2>
              <p>Welcome to our free, comprehensive toolkit designed to empower college access advisors to utilize everything College Scorecard has to offer. This 1-hour training session is tailored to meet professional development needs, equipping advisors with the skills to effectively train others on utilizing the College Scorecard. Whether you’re leading sessions with counselors, presenting at professional conferences, or engaging with events hosted by school districts or state agencies, this toolkit provides all the necessary resources to train others on how best to equip students toward making data-informed decisions about higher education.</p>
            </v-col>
            <Spacer />
            <v-col cols="12" md="4" class="get-materials align-self-end">
              <div class="d-flex download-wrapper">
                <div>
                  <p class="mb-1">Get the full advisor toolkit (.zip, 2.5 MB)</p>
                  <v-btn
                    class="mw-270"
                    color="secondary"
                    href="https://studentaid.gov/h/apply-for-aid/fafsa"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event
                      )
                    "
                    >
                      Download Advisor Toolkit
                    <v-icon
                      x-small
                      color="white"
                      class="pl-2 pb-1 align-self-end top-3"
                    >
                      fas fa-download
                    </v-icon>
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
                  <img :src="$url('img/icon-guide.svg')" alt="Facilitation Guide" />
                </div>
                <div>
                  <p class="mb-0"><strong>Facilitation Guide</strong></p>
                  <p>A step-by-step manual to help instructors seamlessly navigate through the training sessions.</p>
                </div>
              </div>
              <Spacer :height="20" />
              <div class="d-flex">
                <div class="toolkit-icon">
                  <img :src="$url('img/icon-slides.svg')" alt="Training Slides" />
                </div>
                <div>
                  <p class="mb-0"><strong>Training Slides</strong></p>
                  <p>Engaging presentation slides to facilitate learning and stimulate discussions during training sessions.</p>
                </div>
              </div>
              <Spacer :height="20" />
              <div class="d-flex">
                <div class="toolkit-icon">
                  <img :src="$url('img/icon-docs.svg')" alt="Handouts" />
                </div>
                <div>
                  <p class="mb-0"><strong>Handouts</strong></p>
                  <p>Visual aids and supplementary materials to complement the training sessions and reinforce key concepts.</p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <h4 class="mb-5 d-none d-md-block">Contents of the Zip File</h4>
              <div class="content-box">
                <h4 class="mb-5 d-block d-md-none">Contents of the Zip File</h4>
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>College_Scorecard_Facilitation_Guide.docx</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-ppt.svg')" class="mr-1"/>College_Scorecard_Training_Slides.pptx</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Handout_1_College Data Sources.docx</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Handout_2_Student_Priorities.docx</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Handout_3_Scenario_Activity.docx</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-doc.svg')" class="mr-1"/>Handout_3_Scenario_Activity_Instructor_Guide.docx</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-pdf.svg')" class="mr-1"/>Handout_4_Tips_for_Delivery.pdf</a>
                <br />
                <a href="#" target="_blank" rel="noreferrer" class="content-link"><img :src="$url('img/icon-pdf.svg')" class="mr-1"/>Using_the_College_Scorecard.pdf</a>
                <br />
                <hr>
                <a href="#" target="_blank" rel="noreferrer" class="content-link mb-0"><img :src="$url('img/icon-google-drive.svg')" class="mr-1" width="17px" height="17px"/>View on Google Drive</a>
              </div>
            </v-col>
          </v-row>
          <Spacer />
        </v-container>
      </div>
    </div>
  </v-main>
</template>

<script>
import Spacer from '~/components/Spacer.vue';

export default {
  name: 'Resources',
  components: {
    Spacer,
  },
  methods: {
    scrollToAnchor(anchorId) {
      const anchor = document.querySelector(`#${anchorId}`);
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }
};
</script>