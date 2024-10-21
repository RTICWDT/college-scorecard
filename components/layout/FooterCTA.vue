<template>
  <div class="bottom-panel">
    <v-container>
      <v-row class="align-stretch">
        <v-col cols="12" md="6" class="my-md-10">
          <v-card variant="outlined" class="pa-5 fill-height bg-white elevation-1">
            <div>
              <h2>Start Your FAFSA&reg; Application</h2>
              <hr />
              <div>
                <p>
                  To receive financial aid, you must complete the
                  <em>Free Application for Federal Student Aid</em> (FAFSA&reg;)
                  form. Use
                  <a
                    href="https://studentaid.gov/aid-estimator/"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    Federal Student Aid Estimator
                    <v-icon size="x-small" color="#007000" class="pl-1">
                      fas fa-external-link-alt
                    </v-icon>
                  </a>
                  to see how much aid may be available to you.
                </p>
              </div>

              <div class="my-4">
                <v-btn
                  color="secondary"
                  href="https://studentaid.gov/h/apply-for-aid/fafsa"
                  target="_blank"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  Start Your FAFSA&reg; Application
                  <v-icon
                    size="x-small"
                    color="white"
                    class="pl-1 pb-1 align-self-end"
                  >
                    fas fa-external-link-alt
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="my-md-10">
          <v-card variant="outlined" class="pa-5 fill-height va-block">
            <h2>Other Sources</h2>
            <hr />
            <p>
              Don't forget: Do fill out the FAFSA® form, but also look into other
              programs such as
              <a
                href="https://www.vets.gov/gi-bill-comparison-tool"
                target="_blank"
                @click="analytics.transitionOutboundLink($event)"
              >
                GI Bill Benefits
                <v-icon size="x-small" color="#7BD88C" class="pl-1">
                  fas fa-external-link-alt
                </v-icon>
              </a>
            </p>
            <p>
              <a
                href="https://www.vets.gov/gi-bill-comparison-tool"
                target="_blank"
                @click="analytics.transitionOutboundLink($event)"
              >
                <img
                  src="~/assets/images/VA-Logo.svg"
                  style="max-width: 300px"
                  alt="VA Logo"
                  width="300"
                  height="67"
                  contain
                />
              </a>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const analytics = useAnalytics();
</script>

<style lang="scss" scoped>
.va-block {
  background-color: #102E52;
  color: #FFFFFF;
  a {
    color: #7BD88C;
  }
}

.bg-gray {
  background: variables.$bg-gray;
}

.bottom-panel {
  background-color: variables.$light-gray;
}
</style>