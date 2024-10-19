<template>
  <div class="icon-placement">
    <v-btn
      @click.stop.prevent="showDialog = true"
      icon="fa:fas fa-info-circle"
      size="x-small"
      aria-label="More Information"
      color="transparent"
    >
      <span class="sr-only">More Information</span>
      <v-icon icon="fa:fas fa-info-circle"></v-icon>
    </v-btn>

    <v-dialog max-width="500px" v-model="showDialog">
      <v-card class="px-3 py-3">

        <div class="d-flex">
          <div class="text-h6 pl-4 pt-2">{{ title }}</div>
          <div class="flex-grow-1" />
          <v-btn 
            @click="showDialog = false" 
            alt="Close More Information tooltip" 
            aria-required="true" 
            icon="mdi:mdi-close"
            elevation="0"
            color="tertiary"
            class="ml-5"
          />
        </div>

        <v-card-text class="pb-5 px-5">
          <div class="tooltip-text" v-html="content" @click="handleClicks"></div>
          <p v-if="showBranch">
            This information is based on all locations of this school.
          </p>
          <p v-if="showCompare">
            For schools with multiple locations, this information is based on
            all of their locations.
          </p>
          <div class="text-body-2 mt-5" v-if="info" v-html="info"></div>
          <p class="mt-3" v-if="hasGlossary">
            <v-btn
              size="small"
              color="secondary"
              class="px-4 mt-3"
              @click="navigateToGlossary"
            >
              More Information
            </v-btn>
          </p>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  definition: String,
  color: {
    type: String,
    default: "darkgrey",
  },
  version: {
    type: String,
    default: "default",
  },
  isBranch: {
    type: Boolean,
    default: false,
  },
  isCompare: {
    type: Boolean,
    default: false,
  },
  limitedFoS: {
    type: String,
    default: null,
  },
  showInfo: {
    type: Boolean,
    default: true,
  },
  isNegative: {
    type: Boolean,
    default: false,
  },
  isPell: {
    type: Boolean,
    default: false,
  },
})

const { site } = useSiteData()
const { transitionOutboundLink } = useAnalytics()

const showDialog = ref(false)

const glossary = computed(() => site.value.data.glossary)
const entry = computed(() => glossary.value[props.definition])
const title = computed(() => entry.value.title)
const content = computed(() => {
  if (props.isNegative && entry.value.negative) return entry.value.negative
  if (props.isCompare && entry.value.compare) return entry.value.compare
  if (props.isGraduate && entry.value.graduate) return entry.value.graduate
  if (props.isPell && entry.value.pell) return entry.value.pell
  if (props.isPell) return entry.value[props.version + "-pell"]
  return entry.value[props.version]
})
const info = computed(() => entry.value.info && props.showInfo ? entry.value.info : false)
const hasGlossary = computed(() => !!entry.value.glossary)
const showBranch = computed(() => entry.value.branch && props.isBranch)
const showCompare = computed(() => entry.value.branch && props.isCompare)

const router = useRouter()

const navigateToGlossary = () => {
  const url = `/data/glossary/#${props.definition}`
  router.push(url)
}

function handleClicks(event) {
  let { target } = event
  while (target && target.tagName !== "A") target = target.parentNode
  if (target && target.matches(".tooltip-text p a") && target.href) {
    const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event
    if (metaKey || altKey || ctrlKey || shiftKey) return
    if (defaultPrevented) return
    if (button !== undefined && button !== 0) return
    transitionOutboundLink(event)
  }
}
</script>

<style lang="scss" scoped>
  .csTooltip {
    font-size: 1rem;
  }

  .v-card__title {
    word-break: normal;
    word-wrap: break-word;
  }

  .tool-tip-dialog-title {
    word-break: normal;
    word-wrap: break-word;
    display: inline-block;
    width: 450px;
  }

  .icon-placement {
    width: 20px;
    display: inline;
  }

  .tooltip-text {
    font-size: 14px;
    line-height: 1.5;
  }

  :deep(a) {
    color: green;
    margin-right: 5px;
  }

  .title-wrapper {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
  }

  a {
    color: green !important;
  }

</style>