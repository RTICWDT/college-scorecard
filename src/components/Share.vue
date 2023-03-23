<template>
  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="color"
          v-on="on"
          :small="small"
          :text="text"
          :class="{ share: true, fos: fos }"
          outlined
          :elevation="1"
        >
          <v-icon x-small class="mr-2 share">fas fa-share</v-icon> {{ label }}
        </v-btn>
      </template>
      <v-list min-width="200">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="picked(item)"
          role="menuitem"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="showCopy" @click="copyURL">
          <v-list-item-title>{{ copyText }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="showCopyNotify"
      @close="showCopyNotify = false"
      content-class="vCopyNotify"
      overlay-opacity=".15"
      max-width="180"
      transition="fade-transition"
    >
      <v-card>
        <v-btn
          @click="showCopyNotify = false"
          icon
          class="float-right mt-3 mr-3"
          ><v-icon>fas fa-times-circle</v-icon></v-btn
        >
        <v-card-text class="pb-5 pt-5" style="text-align:center;">
          <div>Copied!</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.vCopyNotify {
  overflow: hidden;
}

.fos {
  color:black !important;
  border: thin solid $bg-gray !important;
  font-weight:normal !important;
}
</style>

<script>
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import _ from "lodash"
// import clipboard from 'clipboard';

export default {
  mixins: [AnalyticsEvents],
  props: {
    url: { type: String, default: "" },
    label: { type: String, default: "Share" },
    small: { type: Boolean, default: false },
    text: { type: Boolean, default: false },
    fos: { type: Boolean, default: false },
    color: { type: String, default: "secondary" },
    hide: { type: Array, default: null },
    showCopy: { type: Boolean, default: false },
    copyText: { type: String, default: "Copy URL to Clipboard" },
    showCopyNotify: { type: Boolean, default: false },
  },
  computed: {
    items() {
      let shareOptions = [
        {
          title: "Twitter",
          url:
            "https://twitter.com/intent/tweet?text=" + this.sentence + "&url=",
        },
        {
          title: "Facebook",
          url: "https://www.facebook.com/sharer/sharer.php?u=",
        },
        {
          title: "Email",
          url:
            "mailto:?subject=" +
            this.sentence.slice(0, -1) +
            "&body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A",
        },
        {
          title: "LinkedIn",
          url: "https://www.linkedin.com/sharing/share-offsite/?url=",
        },
      ]

      // Remove items that that should be hidden
      return shareOptions.filter((option) => {
        // Return if not in the hide prop array
        if (_.indexOf(this.hide, option.title.toLowerCase()) < 0) {
          return option
        }
      })
    },
    sentence() {
      let sentence = ""
      switch (this.label.toLowerCase()) {
        case "share":
          sentence =
            "Take a look at this school search from the College Scorecard:"
          break
        case "share this comparison":
          sentence =
            "Take a look at this school comparison on the College Scorecard:"
          break
        case "share this school":
          sentence = "Take a look at this school on the College Scorecard:"
          break
      }
      return sentence
    },
  },
  methods: {
    picked(item) {
      this.trackShare(item.title)
      window.open(item.url + encodeURIComponent(this.url), "_blank")
    },
    copyURL() {
      this.$copyText(this.url)
      this.showCopyNotify = true
      setTimeout(() => (this.showCopyNotify = false), 3000)
    },
  },
}
</script>
