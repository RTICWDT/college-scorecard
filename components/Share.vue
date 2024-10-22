<template>
  <div>
    <v-menu location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          size="small"
          :elevation="elevation"
          :color="color"
          :variant="variant"
        >
          <v-icon size="default" class="mr-1 share">mdi-share</v-icon>
          {{ label }}
        </v-btn>
      </template>
      <v-list min-width="200">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="picked(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="showCopy" @click="copyURL">
          <v-list-item-title>{{ copyText }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-tooltip
      v-model="showCopyNotify"
      location="top"
      transition="fade-transition"
    >
    <template v-slot:activator="{ props }">
      <div v-bind="props" class="position-relative" style="bottom: 25px;">
        <!-- This div acts as an anchor for the tooltip -->
        <!-- You might want to bind this to your copy button or the copied content -->
      </div>
    </template>
    <div>URL Copied!</div>
  </v-tooltip>


  </div>
</template>

<style lang="scss" scoped>
.v-copy-notify {
  overflow: hidden;
}
</style>

<script setup>
const props = defineProps({
  url: { type: String, default: "" },
  label: { type: String, default: "Share" },
  small: { type: Boolean, default: false },
  text: { type: Boolean, default: false },
  fos: { type: Boolean, default: false },
  color: { type: String, default: "secondary-green" },
  variant: { type: String, default: "small" },
  elevation: { type: Number, default: 1 },
  hide: { type: Array, default: () => [] },
  showCopy: { type: Boolean, default: false },
  copyText: { type: String, default: "Copy URL to Clipboard" },
})

const showCopyNotify = ref(false)
const copyStatus = ref('Copied!')
const analytics = useAnalytics()

const items = computed(() => {
  const shareOptions = [
    {
      title: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?text=${sentence.value}&url=`,
    },
    {
      title: "Facebook",
      url: "https://www.facebook.com/sharer/sharer.php?u=",
    },
    {
      title: "Email",
      url: `mailto:?subject=${sentence.value.slice(0, -1)}&body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A`,
    },
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=",
    },
  ]

  return shareOptions.filter((option) => !props.hide.includes(option.title.toLowerCase()))
})

const sentence = computed(() => {
  switch (props.label.toLowerCase()) {
    case "share":
      return "Take a look at this school search from the College Scorecard:"
    case "share this comparison":
      return "Take a look at this school comparison on the College Scorecard:"
    case "share this school":
      return "Take a look at this school on the College Scorecard:"
    default:
      return ""
  }
})

function picked(item) {
  analytics.trackShare(item.title)
  window.open(item.url + encodeURIComponent(props.url), "_blank")
}


function copyURL() {
  if (navigator.clipboard && window.isSecureContext) {
    // For modern browsers in secure contexts
    navigator.clipboard.writeText(props.url)
      .then(() => {
        copyStatus.value = 'Copied!'
        showCopyNotification()
      })
      .catch(() => {
        copyStatus.value = 'Failed to copy'
        showCopyNotification()
      })
  } else {
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement("textarea")
    textArea.value = props.url
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      copyStatus.value = 'Copied!'
    } catch (err) {
      copyStatus.value = 'Failed to copy'
    }

    document.body.removeChild(textArea)
    showCopyNotification()
  }
}

function showCopyNotification() {
  showCopyNotify.value = true
  setTimeout(() => (showCopyNotify.value = false), 1500)
}
</script>