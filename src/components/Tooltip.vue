<template>
  <div class="icon-placement">
    <v-btn
      @click.stop.prevent="showDialog = true"
      icon
      small
      class="align-start ml-n2"
      aria-label="More Information"
    >
      <v-icon x-small allow-overflow :color="color" dark class="tooltip-icon"
        >fas fa-info-circle</v-icon
      >
      <span class="sr-only">More Information</span>
    </v-btn>
    <v-dialog max-width="500px" v-model="showDialog">
      <v-card>
        <v-btn @click="showDialog = false"  alt="Close More Information tooltip" aria-required="true" icon class="float-right mt-3 mr-3"
          ><v-icon>fas fa-times-circle</v-icon></v-btn
        >
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text class="pb-5">
          <div class="tooltip-text" v-html="content" @click="handleClicks"></div>
          <!-- <p v-if="limitedFoS">
            The data shown is for undergraduate fields of study (undergraduate
            certificates, associate's degrees, and bachelor's degrees) for which
            there is data. For more information on other credentials, including
            Graduate-level degrees and certificates, see
            <a :href="limitedFoS">All Fields of Study</a> for this school.
          </p> -->
          <p v-if="showBranch">
            This information is based on all locations of this school.
          </p>
          <p v-if="showCompare">
            For schools with multiple locations, this information is based on
            all of their locations.
          </p>
          <div v-if="info" v-html="info"></div>
          <p class="mt-3" v-if="hasGlossary">
            <v-btn
              :href="$url('/data/glossary/#' + definition)"
              small
              color="secondary"
              class="px-4"
              target="_blank"
              >More Information</v-btn
            >
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.csTooltip {
  font-size: 1rem;
}

.v-card__title {
  word-break:normal;
  word-wrap:break-word;
}

.tool-tip-dialog-title {
  word-break: normal;
  word-wrap: break-word;
  display: inline-block;
  width: 450px;
}

.icon-placement {
  width: 30px;
  display: inline;
}
</style>

<script>
import { SiteData } from "~/js/mixins/SiteData.js"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"

export default {
  mixins: [SiteData, AnalyticsEvents],
  props: {
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
  },
  data() {
    return {
      showDialog: false,
    }
  },
  methods: {
    handleClicks(event) {
      // ensure we use the link, in case the click has been received by a subelement
      let { target } = event

      console.log(target)

      while (target && target.tagName !== "A") target = target.parentNode
      // handle only links that occur inside the component and do not reference external resources
      if (target && target.matches(".tooltip-text p a") && target.href) {
        // some sanity checks taken from vue-router:
        // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
        const {
          altKey,
          ctrlKey,
          metaKey,
          shiftKey,
          button,
          defaultPrevented,
        } = event
        // don't handle with control keys
        if (metaKey || altKey || ctrlKey || shiftKey) return
        // don't handle when preventDefault called
        if (defaultPrevented) return
        // don't handle right clicks
        if (button !== undefined && button !== 0) return

        this.transitionOutboundLink(event)
      }
    },
  },
  computed: {
    glossary() {
      return this.site.data.glossary
    },
    entry() {
      return this.glossary[this.definition]
    },
    title() {
      return this.entry["title"]
    },
    content() {
      if (this.isNegative && this.entry["negative"])
        return this.entry["negative"]
      else if (this.isCompare && this.entry["compare"])
        return this.entry["compare"]
      else if (this.isGraduate && this.entry["graduate"])
        return this.entry["graduate"]
      else if (this.isPell && this.entry["pell"]) return this.entry["pell"]
      else if (this.isPell) return this.entry[this.version + "-pell"]
      else return this.entry[this.version]
    },
    info() {
      return this.entry["info"] && this.showInfo ? this.entry["info"] : false
    },
    hasGlossary() {
      return this.entry["glossary"] ? true : false
    },
    showBranch() {
      return this.entry.branch && this.isBranch
    },
    showCompare() {
      return this.entry.branch && this.isCompare
    },
  },
  mounted() {},
}
</script>
