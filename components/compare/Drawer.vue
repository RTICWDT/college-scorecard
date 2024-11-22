<template>
    <!-- DRAWER CONTENT -->
    <v-navigation-drawer
      v-model="showDrawer"
      location="bottom"
      temporary
      height="auto"
      class="drawer pa-5 wrapper"
      elevation="0"
    >
      <v-container class="drawer-content elevation-10">
        <v-row>
          <v-col class="d-flex align-center">
            <p>Add up to 10 Schools and 10 Fields of Study to compare.</p>
            <v-btn
              class="ml-auto"
              color="secondary-gray"
              size="small"
              @click="toggleDrawer"
              icon="mdi-close"
              :tabindex="showDrawer ? 0 : -1"
              aria-label="Close Compare Drawer"
              id="compare_drawer--close-drawer-button"
            />
          </v-col>
        </v-row>

        <v-row>

          <!-- SCHOOLS -->
          <v-col class="border-e d-flex flex-column" cols="12" sm="6">
            <div class="d-flex align-center mb-5">
              <v-btn
                size="small"
                icon="fa:fas fa-university"
                class="bg-tertiary-green mr-2"
                :readonly="true"
                :tabindex="-1"
                aria-label="Compare Schools Icon"
              />
              <h3>Compare Schools</h3>
            </div>

            <div class="items-list">
              <div v-if="maxSchoolsReached" class="pa-2 mb-5 bg-tertiary-yellow font-weight-bold">
                Maximum of 10 Schools Selected
              </div>

              <div v-if="noSchoolsSelected">
                <p class="text-body-2 pl-3 font-weight-bold">No Schools Selected</p>
              </div>
              <div v-else v-for="institution in store.institutions">
                <div class="d-flex align-center mb-5">
                  <v-tooltip location="bottom" text="Remove School" aria-label="Remove School from Compare" id="aria-remove-school">
                    <template v-slot:activator="{ props }">
                      <v-btn aria-labelledby="aria-remove-school" v-bind="props" icon="mdi-close" color="error" size="x-small" class="mr-3 ml-1" @click="store.removeSchool(institution)" :tabindex="showDrawer ? 0 : -1"/>
                    </template>
                  </v-tooltip>
                  <NuxtLink :to="schoolLink(institution)" class="text-body-2" :tabindex="showDrawer ? 0 : -1"><strong>{{ institution.school.name }}</strong></NuxtLink>
                </div>
              </div>
            </div>
            <div class="flex-grow-1"></div>
            <div class="d-flex justify-start justify-sm-center bg-white pt-3 pb-10 pb-sm-0" :class="{ 'border-b': breakpoints.xs.value }">
              <NuxtLink v-if="noSchoolsSelected" to="/search/" :tabindex="-1">
                <v-btn color="primary-green"  :tabindex="showDrawer ? 0 : -1">
                  Search Schools
                </v-btn>
              </NuxtLink>
              <NuxtLink v-else to="/compare/?toggle=institutions" :tabindex="-1">
                <v-btn color="primary-green" :tabindex="showDrawer ? 0 : -1">
                  Compare {{ store.institutions.length }} School{{ oneSchoolSelected ? '' : 's' }}
                </v-btn>
              </NuxtLink>
            </div>

          </v-col>

          <!-- FOS -->
          <v-col class="d-flex flex-column" cols="12" sm="6">
            <div class="d-flex align-center mb-5">
              <v-btn
                size="small"
                icon="fa:fas fa-award"
                class="bg-primary-yellow mr-2"
                :readonly="true"
                tabindex="-1"
                aria-label="Compare Fields of Study Icon"
              />
              <h3>Compare Fields of Study</h3>
            </div>

            <div class="items-list">
              <v-card v-if="maxFosReached" class="pa-2 mb-5 bg-tertiary-yellow font-weight-bold">
                Maximum of 10 Fields of Study selected
              </v-card>

              <div v-if="noFosSelected">
                <p class="text-body-2 pl-3 font-weight-bold">No Fields of Study Selected</p>
              </div>
              <div v-else v-for="fos in store.fos">
                <div class="d-flex align-center mb-5">
                  <v-tooltip location="bottom" text="Remove Field of Study" aria-label="Remove Field of Study from Compare" id="aria-remove-fos">
                    <template v-slot:activator="{ props }">
                      <v-btn aria-labelledby="aria-remove-fos" v-bind="props" icon="mdi-close" color="error" size="x-small" class="mr-3 ml-1" @click="store.removeFieldOfStudy(fos)" :tabindex="showDrawer ? 0 : -1"/>
                    </template>
                  </v-tooltip>
                  <div>
                    <NuxtLink :to="fosLink(fos)" class="text-body-2" :tabindex="showDrawer ? 0 : -1"><strong>{{ fos.title }}</strong></NuxtLink>
                    <p class="text-caption text-uppercase">{{ fos.credential.title }}</p>
                    <p class="text-caption">{{ fos.school.name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-grow-1"></div>
            <div class="d-flex justify-start justify-sm-center bg-white pt-3">
              <NuxtLink v-if="noFosSelected" to="/search/fos-landing/" :tabindex="-1">
                <v-btn v-if="noFosSelected" color="primary-green" :tabindex="showDrawer ? 0 : -1">
                  Search Fields of Study
                </v-btn>
              </NuxtLink>
              <NuxtLink v-else to="/compare/?toggle=fos" :tabindex="-1">
                <v-btn color="primary-green" :tabindex="showDrawer ? 0 : -1">
                  Compare {{ store.fos.length }} Field{{ oneFosSelected ? '': 's' }} of Study
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>
        </v-row>

      </v-container>
    </v-navigation-drawer>



    <!-- DRAWER RAIL -->
    <div class="position-fixed w-100 rail wrapper" :class="{ 'visible': !showDrawer && showRail }">
      <div class="d-flex justify-center">

        <div class='flex-grow-1 toggle-content'>
          <v-btn
            class="button w-100" 
            @click="toggleDrawer" 
            tabindex="0"
            :disabled="showDrawer"
            id="compare_drawer--open-drawer-button"
            block
          >
            <v-container class="inner-button py-2">
              <v-row>
                <v-col class="text-left d-flex pl-0 pl-sm-4 align-center">
                  <div class="d-none d-sm-block mr-5">
                    <p class="font-weight-bold">Ready to Compare:</p>
                  </div>
                  <div class="d-flex align-center mr-5">
                      <div :class="maxFosReamaxSchoolsReachedched ? 'bg-error' : 'bg-tertiary-green'"  class="pa-2 mr-2 rounded-circle">
                        <v-icon size="xsmall" :icon="maxSchoolsReached ? 'fa:fas fa-exclamation-circle' : 'fa:fas fa-university'" />
                      </div>
                      <p>{{ store.institutions.length }} School{{ oneSchoolSelected ? '' : 's' }}</p>
                      <v-tooltip v-if="maxSchoolsReached" activator="parent" location="top">
                        Maximum of 10 Schools Reached
                      </v-tooltip>
                  </div>
                  <div class="d-flex align-center mr-5">
                      <div :class="maxFosReached ? 'bg-error' : 'bg-primary-yellow'" class="pa-2 mr-2 rounded-circle">
                        <v-icon size="xsmall" :icon="maxFosReached ? 'fa:fas fa-exclamation-circle' : 'fa:fas fa-award'" />
                      </div>
                      <p>{{ store.institutions.length }} School{{ oneFosSelected ? '' : 's' }}</p>
                      <v-tooltip v-if="maxFosReached" activator="parent" location="top">
                        Maximum of 10 Fields of Study Reached
                      </v-tooltip>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-btn>
        </div>

      </div>
    </div>
</template>

<script setup>
const { breakpoints } = useVuetify()
const store = useCompareStore()
const route = useRoute()

const showDrawer = ref(false)
const hasItemsToCompare = computed(() => store.institutions.length > 0 || store.fos.length > 0)
const onComparePage = computed(() => route.fullPath.includes('compare'))
const showRail = ref(hasItemsToCompare.value && !onComparePage.value)

const maxSchoolsReached = computed(() => store.institutions.length === 10)
const oneSchoolSelected = computed(() => store.institutions.length === 1)
const maxFosReached = computed(() => store.fos.length === 10)
const oneFosSelected = computed(() => store.fos.length === 1)

const noSchoolsSelected = computed(() => store.institutions.length === 0)
const noFosSelected = computed(() => store.fos.length === 0)
const { schoolLink, fieldsLink } = useComplexFieldMethods()

const fosLink = computed(() => (fos) => {
  // this is unfortunate
  const groomed = {
    id: fos.unit_id,
    'school.name': fos.school.name,
  }

  const baseLink = fos.credential.level <= 3 ? schoolLink(groomed) : fieldsLink(groomed)
  return `${baseLink}&fos_code=${fos.code}&fos_credential=${fos.credential.level}`
});

watch(() => route.fullPath, () => {
  if (route.fullPath.includes('compare')) {
    showRail.value = false
    showDrawer.value = false
  } else {
    showRail.value = hasItemsToCompare.value && !onComparePage.value
  }
})

watch(() => store.fos.length, () => { showRail.value = hasItemsToCompare.value && !onComparePage.value })
watch(() => store.institutions.length, () => { showRail.value = hasItemsToCompare.value && !onComparePage.value })


const toggleDrawer = async (e) => {
  showDrawer.value = !showDrawer.value

  await nextTick()
  if (showDrawer.value) {
    document.getElementById('compare_drawer--close-drawer-button').focus()
  } else {
    document.getElementById('compare_drawer--open-drawer-button').focus()
  }
  e.preventDefault()
}
</script>

<style scoped lang="scss">
.wrapper {
  max-width: 900px;
  left: 50%;
  transform: translateX(-50%);
}
.drawer {
  background-color: transparent;
  border-top: none;
  padding: 0 !important;
  max-width: 900px;

  @media (min-width: 900px) {
    position: fixed;
    // left: 20% !important;
    // assuming 900px width, calc the center with only using left
    left: calc(50% - 450px) !important;
  }
}

.drawer-content {
  background-color: white;
  max-width: 900px;
  border-top: 8px solid black;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

  height: calc(100vh - 125px);
  overflow-y: scroll;
  @include smAndUp {
    height: inherit;
  }
  
}

.items-list {
  @include smAndUp {
    max-height: 400px;
    min-height: 400px;
    overflow-y: scroll;

  }
}


.rail {
  transition: bottom 0.3s;
  bottom: -55px;
  z-index: 1001;

  &.visible {
    bottom: 0px;
  }

  .toggle-content {
    max-width: 900px;
    background-color: black;

    @include mdAndUp {
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
    }

    .button {
      background-color: transparent;
      color: white;
      z-index: 1000;
      cursor: pointer;
      height: 55px;
      padding-left: 0;
      padding-right: 0;
      font-size: 16px;

      &:deep(.v-btn__content) {
        width: 100%;
      }

      .inner-button {
        height: 100%;
        display: flex;
        align-items: center;
        background-color: black;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
      }
    }
  }
}
</style>