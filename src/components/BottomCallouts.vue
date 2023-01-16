<template>
    <div class="bottom-panel">
  <v-container class="">
    <v-row class="align-stretch">
      <v-col cols="12" md="6" class="my-md-10">
        <v-card outline class="pa-5 fill-height">
          <div>
            <h2 class="">Start Your FAFSA&reg; Application</h2>
            <hr />
            <div>
              <p>
                To receive financial aid, you must complete the
                <em>Free Application for Federal Student Aid</em> (FAFSA&reg;)
                form. Use
                <!--prettyhtml-ignore-->
                <a
                  :href="$url('/school/transition/')"
                  target="_blank"
                  @click="
                    transitionOutboundLink(
                      $event,
                      'https://studentaid.gov/aid-estimator/'
                    )
                  "
                  >Federal Student Aid Estimator<v-icon
                    x-small
                    color="#007000"
                    class="pl-1"
                  >
                    fas fa-external-link-alt
                  </v-icon>
                </a>
                to see how much aid may be available to you.
              </p>
            </div>

            <div class="my-4">
              <v-btn
                color="secondary"
                :href="$url('/school/transition/')"
                target="_blank"
                @click="
                  transitionOutboundLink(
                    $event,
                    'https://studentaid.gov/h/apply-for-aid/fafsa'
                  )
                "
                >Start Your FAFSA&reg; Application<v-icon
                  x-small
                  color="white"
                  class="pl-1 pb-1 align-self-end"
                  style=""
                >
                  fas fa-external-link-alt
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="my-md-10">
        <v-card outline class="pa-5 fill-height va-block">
          <h2>Other Sources</h2>
          <hr />
          <p>
            Don't forget: Do fill out the FAFSA® form, but also look into other
            programs such as
            <a
              :href="$url('/school/transition/')"
              target="_blank"
              @click="
                transitionOutboundLink(
                  $event,
                  'https://www.vets.gov/gi-bill-comparison-tool'
                )
              "
              >GI Bill Benefits<v-icon x-small color="#7BD88C" class="pl-1">
                fas fa-external-link-alt
              </v-icon></a
            >
            <p>
                <a
              :href="$url('/school/transition/')"
              target="_blank"
              @click="
                transitionOutboundLink(
                  $event,
                  'https://www.vets.gov/gi-bill-comparison-tool'
                )
              "
              ><img src="/img/VA-Logo.svg" style="max-width: 300px" alt="VA Logo" /></a></p>
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    </div>
</template>
<style lang="scss" scoped>
@import "~/sass/_variables";

.va-block{
    background-color: #102E52;
    color: #FFFFFF;
    a{
        color: #7BD88C;
    }
}
.bottom-panel {
  background-color: $light-gray;
}
</style>
<script>
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents],
}
</scrip>
