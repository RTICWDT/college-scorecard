<template>
  <DocumentationCard title="Glossary">
    <div v-for="entry in glossary" :key="entry.id">
      <div v-if="entry.glossary">
        <h3 :id="entry.id" class="mt-4">{{ entry.title }}</h3>
        <div @click="handleClicks" v-html="entry.glossary" style="max-width: 800px" class="glossary-text" />
      </div>
    </div>
  </DocumentationCard>
</template>

<script setup>
const analytics = useAnalytics()
import Glossary from "~/assets/data/glossary.json"
const glossary = ref([])


// Initialize glossary data
for (const key in Glossary) {
  glossary.value.push({
    ...Glossary[key],
    id: key
  })
}

// Sort glossary by title
glossary.value.sort((a, b) => a.title.localeCompare(b.title))
const handleClicks = (event) => {
  let { target } = event

  while (target && target.tagName !== "A") target = target.parentNode

  if (target && target.matches(".glossary-text-4f5ai a") && target.href) {
    const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event

    if (metaKey || altKey || ctrlKey || shiftKey) return
    if (defaultPrevented) return
    if (button !== undefined && button !== 0) return

    analytics.transitionOutboundLink(event)
  }
}

const { scrollToAnchor } = useScroll()
const route = useRoute()
onMounted(() => {
  setTimeout(() => {
    if (route.hash) {
      scrollToAnchor(route.hash, 150, "instant")
    }
  }, 50)
})

useHead({
  title: "Glossary",
  meta: [
    {
      name: 'description',
      content: 'The glossary includes detailed description of every datapoint and relevant data variables on the College Scorecard.'
    },
    {
      name: 'keywords',
      content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS'
    }
  ],
})
</script>

<!-- the glossary doesn't inherit the styles of a scoped stylesheets, hence these class-scoped override -->
<style lang="scss" scoped>
:deep(.glossary-text) {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;

  p {
    margin-bottom: 1rem;
  }

  ul,
  li {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 0.8rem;

    ul {
      margin-left: 2rem;
    }
  }
}
</style>