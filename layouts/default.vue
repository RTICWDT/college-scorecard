

<template>
  <ClientOnly>
    <v-app>
      <header class="d-print-none" style="position: sticky; top: 0px; z-index: 1000;">
        <LayoutUsaBanner />
        <LayoutHeader />
      </header>
      <v-main id="mainContent" style="min-height: 80vh">
        <slot />
      </v-main>
      <LayoutFooter />
      <CompareDrawer />  
    </v-app>
  </ClientOnly>
</template>

<script setup>
const route = useRoute()
const page = ref('') 
const description = ref('')
const keywords = ref('')
const title = ref('')

const matchRoute = (path) => route.fullPath.includes(path);

const mapRouteToSEO = () => {
  switch (true) {
    case matchRoute('/compare'):
      page.value = 'Compare'
      description.value = "Compare colleges nationwide. Compare data on cost, graduation rate, student outcomes, potential earnings, financial aid and debt, test scores, and more."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, graduation rate, tuition cost, average annual cost, net price, median earnings, typical earnings, salary after completion, student outcomes, pell grant, loan payment, financial aid, federal loan, parent PLUS loan, repayment rate, repayment status, study body demographics, test scores, SAT, ACT, acceptance rate"
      break

    case matchRoute('/search/fos-landing'):
      page.value = 'Field of Study Search'
      description.value = "Search the fields of study offered at each school by degree type. Fields of study are areas of academic concentration (e.g, majors or programs)."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings; field of study, program, major, CIP, Classification of Instructional Programs, salary after completing, median total debt, WIOA"
      break

    case matchRoute('/search/fos'):
      page.value = 'Search Fields of Study'
      description.value = "Search the fields of study offered at each school by degree type. Fields of study are areas of academic concentration (e.g, major sor programs)."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings; field of study, program, major, CIP, Classification of Instructional Programs, salary after completing, median total debt, WIOA"
      break

    case matchRoute('/search'):
      page.value = 'Search Schools'
      description.value = "Search colleges nationwide. Search for schools based on degree type, cost, school type, test scores, size, mission, afflication, and more."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, tutition costs, graduation rates, median earnings, acceptance rate, school size, WIOA"
      break

    case matchRoute('/data/glossary'):
      page.value = 'Glossary'
      description.value = "The glossary includes detailed description of every datapoint and relevant data variables on the College Scorecard."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS"
      break

    case matchRoute('/data/changelog'):
      page.value = 'Changelog'
      description.value = "The change log describes the changes that have been made to the College Scorecard or API over time."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, API"
      break

    case matchRoute('/data/api-documentation'):
      page.value = 'API Documentation'
      description.value = "Technical documentation provides in-depth information about institution-level and field-of-study-level data files."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, institution level data, field of study data, API, OPEID, IPEDS UNITID"
      break

    case matchRoute('/data/data-documentation'):
      page.value = 'Data Documentation'
      description.value = "Technical documentation provides in-depth information about institution-level and field-of-study-level data files."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, institution level data, field of study data, API, OPEID, IPEDS UNITID"
      break

    case matchRoute('/data'):
      page.value = 'Data Home'
      description.value = "Download institution-level and field-of-study-level data files directly from the College Scorecard. Available data goes as far back as 1997."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, institution level data, field of study data, API, OPEID, IPEDS UNITID"
      break

    case matchRoute('/resources'):
      page.value = 'Resources'
      description.value = "The U.S. Department of Education's College Scorecard has the most reliable data on college costs, graduation rates, and post-college earnings."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings"
      break

    case matchRoute('/school/fields'):
      page.value = 'Field of Study Profile'
      description.value = "The U.S. Department of Education's College Scorecard has the most reliable data on college costs, graduation rates, and post-college earnings."
      break

    case matchRoute('/school'):
      const key = Object.keys(route.query)[0]
      if (key) {
        let arr = key.split('-')
        arr.shift()
        let schoolname = arr.join(' ')
        page.value = schoolname
      } else {
        page.value = 'School Profile'
        description.value = "The school profile provides a wealth of data, including average cost, graduation rates, financial aid and debt, typical earnings of graduates, and more."
        keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, graduation rate, tuition cost, average annual cost, net price, median earnings, typical earnings, salary after completion, student outcomes, pell grant, loan payment, financial aid, federal loan, parent PLUS loan, repayment rate, repayment status, student faculty ratio, study body demographics, test scores, SAT, ACT, acceptance rate, FAFSA, GI Bill"
      }
      break

    case matchRoute('/training'):
      page.value = 'Training Programs'
      description.value = "Find the right training program for you. Search for schools with training programs and training programs by field of study."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings"
      break

    default:
      page.value = 'Home'
      description.value = "The U.S. Department of Education's College Scorecard has the most reliable data on college costs, graduation rates, and post-college earnings."
      keywords.value = "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings"
      break
  }

  title.value = `${page.value} | College Scorecard`

  useSeoMeta({
    title: page.value,
    titleTemplate: '%s | College Scorecard',
    description: description.value,
    keywords: keywords.value,
    ogTitle: title.value,
    ogDescription: description.value,
    ogUrl: 'https://collegescorecard.ed.gov/',
    ogImage: 'https://collegescorecard.ed.gov/social-card.png',
    twitterTitle: title.value,
    twitterDescription: description.value,
    twitterCard: 'summary_large_image',
    twitterImage: 'https://collegescorecard.ed.gov/social-card.png',
    ogType: 'website',
    htmlAttrs: {
      lang: 'en'
    },
  })
}
watch(() => route.path, () => {
  mapRouteToSEO()
})

mapRouteToSEO()
</script>