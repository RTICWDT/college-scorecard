<template>
  <v-main>
    <v-container class="px-0">
      <v-row>
        <v-col cols="12">
          <v-card class="py-5 px-10 ma-5" flat>
            <h1 class="text-h4 mb-2 font-weight-bold">Glossary</h1>
            <hr />
              <div
                v-for="entry in glossary"
                :key="entry.id"
              >
                <div v-if="entry.glossary">
                  <h3 :id="entry.id" class="mt-4">{{ entry.title }}</h3>
                  <div
                    @click="handleClicks"
                    v-html="entry.glossary"
                    style="max-width: 800px"
                    class="glossary-text-4f5ai"
                  />
                </div>
              </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style lang="scss">
// the glossary doesn't inherit the styles of a scoped stylesheet here, hence these class-scoped overrides

 div.glossary-text-4f5ai {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
 }

 div.glossary-text-4f5ai > p {
    margin-bottom: 1rem;
  }

  div.glossary-text-4f5ai > ul, div.glossary-text-4f5ai > li {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 2rem;

    ul {
      margin-left: 2rem;
    }
  }
</style>

<script setup>
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

for (const entry of glossary.value) {
  console.log(entry.glossary)
}

const handleClicks = (event) => {
  let { target } = event

  while (target && target.tagName !== "A") target = target.parentNode

  if (target && target.matches(".glossary-text-4f5ai a") && target.href) {
    const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event
    
    if (metaKey || altKey || ctrlKey || shiftKey) return
    if (defaultPrevented) return
    if (button !== undefined && button !== 0) return

    // Assuming transitionOutboundLink is defined elsewhere in your app
    transitionOutboundLink(event)
  }
}

onMounted(() => {
  if (window.location.hash) {
    // You may need to implement a custom scrollTo function or use a library
    scrollTo(window.location.hash, { offset: 30 })
  }
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