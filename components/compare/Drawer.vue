<template>
  <div>
    <!-- DRAWER CONTENT -->
    <v-navigation-drawer
      v-model="showDrawer"
      location="bottom"
      temporary
      height="auto"
      class="drawer pa-5"
      elevation="0"
    >
      <v-container class="drawer-content elevation-10">
        <v-row>
          <v-col class="d-flex align-center">
            <p>Add up to 10 Schools and 10 Fields of Study to compare.</p>
            <v-btn
              class="ml-auto"
              color="tertiary"
              size="small"
              @click="showDrawer = !showDrawer"
              icon="mdi-close"
              :tabindex="showDrawer ? 0 : -1"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="border-e d-flex flex-column" cols="12" sm="6">
            <div class="d-flex align-center mb-5">
              <v-btn
                size="small"
                icon="fa:fas fa-university"
                class="bg-schoolgreen mr-2"
                :readonly="true"
              />
              <h3>Compare Schools</h3>
            </div>

            <div class="items-list">
              <div v-if="maxSchoolsReached">
                Maximum of 10 Schools Selected
              </div>

              <div v-if="noSchoolsSelected">
                <p class="text-body-2 pl-3 font-weight-bold">No Schools Selected</p>
              </div>
              <div v-else v-for="institution in store.institutions">
                <div class="d-flex align-center mb-5">
                  <v-btn icon="fa: fa-solid fa-trash-can" color="error" size="x-small" class="mr-3 ml-1" @click="store.removeSchool(institution)" :tabindex="showDrawer ? 0 : -1"/>
                  <p class="text-body-2"><strong>{{ institution.school.name }}</strong></p>
                </div>
              </div>
            </div>
            <div class="flex-grow-1"></div>
            <div class="d-flex justify-center bg-white pt-3">
              <NuxtLink v-if="noSchoolsSelected" to="/search" :tabindex="-1">
                <v-btn color="primary"  :tabindex="showDrawer ? 0 : -1">
                  Search Schools
                </v-btn>
              </NuxtLink>
              <NuxtLink v-else to="/compare?toggle=institutions" :tabindex="-1">
                <v-btn color="primary" :tabindex="showDrawer ? 0 : -1">
                  Compare {{ store.institutions.length }} School{{ oneSchoolSelected ? '' : 's' }}
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>

          <v-col class="d-flex flex-column" cols="12" sm="6">
            <div class="d-flex align-center mb-5">
              <v-btn
                size="small"
                icon="fa:fas fa-award"
                class="bg-yellow mr-2"
                :readonly="true"
              />
              <h3>Compare Fields of Study</h3>
            </div>

            <div class="items-list">
              <v-card v-if="maxFosReached" class="pa-2 mb-5 bg-lightyellow font-weight-bold">
                Maximum of 10 Fields of Study selected
              </v-card>

              <div v-if="noFosSelected">
                <p class="text-body-2 pl-3 font-weight-bold">No Fields of Study Selected</p>
              </div>
              <div v-else v-for="fos in store.fos">
                <div class="d-flex align-center mb-5">
                  <v-btn icon="fa: fa-solid fa-trash-can" color="error" size="x-small" class="mr-3 ml-1" @click="store.removeFieldOfStudy(fos)" :tabindex="showDrawer ? 0 : -1"/>
                  <div>
                    <p class="text-body-2"><strong>{{ fos.title }}</strong></p>
                    <p class="text-caption text-uppercase">{{ fos.credential.title }}</p>
                    <p class="text-caption">{{ fos.school.name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-grow-1"></div>
            <div class="d-flex justify-center bg-white pt-3">
              <NuxtLink v-if="noFosSelected" to="/search/fos-landing" :tabindex="-1">
                <v-btn v-if="noFosSelected" color="primary" :tabindex="showDrawer ? 0 : -1">
                  Search Fields of Study
                </v-btn>
              </NuxtLink>
              <NuxtLink v-else to="/compare?toggle=fos" :tabindex="-1">
                <v-btn color="primary" :tabindex="showDrawer ? 0 : -1">
                  Compare {{ store.fos.length }} Field{{ oneFosSelected ? '': 's' }} of Study
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>
        </v-row>

      </v-container>
    </v-navigation-drawer>



    <!-- DRAWER RAIL -->
    <div class="position-fixed w-100 rail" :class="{ 'visible': !showDrawer && showRail }">
      <div class="d-flex justify-center">
        <div class='flex-grow-1 toggle-content-border'>
          <v-btn
            class="toggle-content-wrapper w-100" 
            @click="showDrawer = !showDrawer" 
            tabindex="0" 
            :disabled="showDrawer"
            block
          >
            <v-container class="toggle-content py-2">
              <v-row no-gutters align="center">
                <v-col class="text-left d-flex pl-0 pl-sm-4 align-center">
                  <div class="d-none d-sm-block mr-5">
                    <p class="font-weight-bold">Ready to Compare:</p>
                  </div>
                  <div class="d-flex align-center mr-5">
                    <v-btn
                      size="x-small"
                      :icon="maxSchoolsReached ? 'fa:fas fa-exclamation-circle' : 'fa:fas fa-award'"
                      class="mx-2"
                      :class="{ 'bg-schoolgreen': !maxSchoolsReached, 'bg-error': maxSchoolsReached }"
                      :readonly="true"
                    />
                    <p>{{ store.institutions.length }} School{{ oneSchoolSelected ? '' : 's' }}</p>
                    <v-tooltip v-if="maxSchoolsReached" activator="parent" location="top">
                      Maximum of 10 Schools Reached
                    </v-tooltip>
                  </div>
                  <div class="d-flex align-center">
                    <v-btn
                      size="x-small"
                      :icon="maxFosReached ? 'fa:fas fa-exclamation-circle' : 'fa:fas fa-award'"
                      class="mx-2"
                      :class="{ 'bg-yellow': !maxFosReached, 'bg-error': maxFosReached }"
                      :readonly="true"
                    />
                    <p>{{ store.fos.length }} Field{{ oneFosSelected ? '' : 's' }} of Study</p>
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
  </div>
</template>

<script setup>
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


watch(() => route.fullPath, () => {
  console.log(route.fullPath)
  if (route.fullPath.includes('compare')) {
    showRail.value = false
    showDrawer.value = false
  } else {
    showRail.value = hasItemsToCompare.value && !onComparePage.value
  }
})

watch(() => store.fos.length, () => { showRail.value = hasItemsToCompare.value && !onComparePage.value })
watch(() => store.institutions.length, () => { showRail.value = hasItemsToCompare.value && !onComparePage.value })
</script>

<style scoped lang="scss">
.toggle-content-border {
  max-width: 900px;
  background-color: #000;

  @include mdAndUp {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
}

.toggle-content-wrapper {
  background-color: transparent;
  color: white;
  z-index: 1000;
  cursor: pointer;
  height: 55px;
  padding-left: 0;
  padding-right: 0;
  font-size: 16px;
}

.drawer {
  background-color: transparent;
  border-top: none;
  padding: 0 !important;
}

.drawer-content {
  background-color: white;
  max-width: 900px;
  border-top: 8px solid #000;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

  height: calc(100vh - 125px);
  overflow-y: scroll;
  @include smAndUp {
    height: inherit;
  }
  
}

.toggle-content {
  height: 100%;
  display: flex;
  align-items: center;
  background-color: black;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

:deep(.v-btn__content) {
  width: 100%;
  justify-content: flex-start;
}

.rail {
  transition: bottom 0.3s;
  bottom: -55px;
  z-index: 1001;

  &.visible {
    bottom: 0px;
  }
}

.items-list {
  @include smAndUp {
    max-height: 400px;
    min-height: 400px;
    overflow-y: scroll;

  }
}
</style>