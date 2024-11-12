<template>
  <div>
    <v-container fluid class="bg-gray-100 w-100 py-0 px-0" style="z-index: 900;" aria-label="Official government website">
      <div class="d-flex align-items-center px-3">
        <LayoutUsaFlag class="mx-2"/>
        <p class="mb-0 py-1" style="font-size: .75rem">
          <span> 
            An official website of the United States government
            <button tabindex="2" @click="toggleInfo" alt="Here's how you know">
              <span style="color: #0065A8; text-decoration: underline;">
                <span class="pr-1">Here's how you know</span><i class="fas reveal-caret" :class="showInfo ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </span>
            </button>
          </span>
        </p>
      </div>

      <v-container fluid class="w-100 position-relative py-0 px-0 pl-2" style="z-index: 1000;" v-show="showInfo">
        <div class="pt-4 pb-3 w-100" style="left: 12px; top:-4px;">
          <v-row class="bg-gray-100 w-100 pb-3">
            <v-col md="6" sm="12">
              <div class="d-flex">
                <div class="mr-3 mt-3 min-w-50">
                  <LayoutUsaGovIcon/>
                </div>
                <div class="max-w-400">
                  <p><strong>Official websites use .gov</strong><br> A <strong>.gov</strong> website belongs to an official government organization in the United States.</p>
                </div>
              </div>
            </v-col>

            <v-col>
              <div class="d-flex">
                <div class="mr-3 mt-3 min-w-50">
                  <LayoutUsaLockIcon />
                </div>
                <div class="max-w-400">
                  <p><strong>Secure .gov websites use HTTPS</strong><br> A <strong>lock</strong> (<i class="fas fa-lock"></i>) or <strong>https://</strong> means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-container>
  </div>
</template>

<script setup>
const showInfo = ref(false)

const toggleInfo = () => {
  showInfo.value = !showInfo.value
}
</script>

<style scoped>
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