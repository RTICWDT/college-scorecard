<style lang="scss" scoped>
  .bg-white { background-color: #eff1f5; }
  .align-items-center { align-items: center; }
  .justify-space-between { justify-content: space-between; }
  .w-100 { width: 100%; }
  .position-relative { position: relative; }
  .position-absolute { position: absolute; }
  .max-w-400 { max-width: 400px; }
  .min-w-50 { min-width: 50px; }
  .hide-mobile {
    @media screen and (max-width: 600px) {
      display: none;
    }
  }
  .reveal-caret {
    position: relative;
    top: 1px;
  }
</style>

<template>
  <div class="bg-white w-100" style="z-index: 1000;" aria-label="Official government website">
    <div class="d-flex align-items-center px-5">
      <USAFlag class="mx-2"/>
      <p class="mb-0 py-1" style="font-size: .75rem">
        <span> 
          An official website of the United States government 
          <button tabindex="2" @click="toggleInfo" alt="Here's how you know" aria-required="true">
            <span style="color: #0071bb; text-decoration: underline;">
              <span class="hide-mobile pr-1">Here's how you know</span> <i class="fas reveal-caret" :class="showInfo ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </span>
          </button>
        </span>
      </p>
    </div>

    <div class="w-100 position-relative" style="z-index: 1000;" v-show="showInfo">
      <div class="bg-white pt-4 pb-3 w-100 position-absolute">
        <v-row class="px-5">
          <v-col cols="12" md="6">
            <div class="d-flex">
              <div class="mr-3 mt-3 min-w-50">
                <USAGovIcon/>
              </div>
              <div class="max-w-400">
                <p><strong>Official websites use .gov</strong><br> A <strong>.gov</strong> website belongs to an official government organization in the United States.</p>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="d-flex">
              <div class="mr-3 mt-3 min-w-50">
                <USALockIcon />
              </div>
              <div class="max-w-400">
                <p><strong>Secure .gov websites use HTTPS</strong><br> A <strong>lock</strong> (<i class="fas fa-lock"></i>) or <strong>https://</strong> means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.</p>
              </div>
            </div>
          </v-col>
        </v-row>

      </div>
    </div>
  </div>
</template>

<script>
import USAFlag from "@/components/USAFlag.vue"
import USAGovIcon from "@/components/USAGovIcon.vue"
import USALockIcon from "@/components/USALockIcon.vue"

export default {
  components: {
    USAFlag,
    USAGovIcon,
    USALockIcon,
  },
  data() {
    return {
      showInfo: false,
    }
  },
  methods: {
    toggleInfo() {
      this.showInfo = !this.showInfo;
    },
  },
  computed: {

  },
  mounted() {},
}
</script>