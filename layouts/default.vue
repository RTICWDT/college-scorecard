

<template>
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
  
</template>

<script setup>
import socialImage from '/social-card.png'

useHead({
  titleTemplate: '%s | College Scorecard',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { 'http-equiv': "Cache-control", content: "private, no-store" },
    { name: 'HandheldFriendly', property: 'HandheldFriendly', content: 'True' },
    { name: 'MobileOptimized', property: 'MobileOptimized', content: '320' },
    { name: "google-site-verification", property: 'google-site-verification', content: "joZQgj-M8GQ05V29ojfVsbsNk44SRgGqJfws9tBcnPU" },
    { name: "google-site-verification", property: 'google-site-verification', content: "V-KEdRwSWd6GSLEWRBddZy6B5yLCs6vkRRflrImQiKE" },
    { name: "viewport", property: 'viewport', content: "width=device-width,initial-scale=1.0" },
    { name: "description", property: 'description', content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
    { name: "twitter:card", property: 'twitter:card', content: "summary_large_image" },
    { name: "twitter:title", property: 'twitter:title', content: "College Scorecard" },
    { name: "twitter:description", property: 'twitter:description', content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
    { name: "twitter:image", property: 'twitter:image', content: `https://collegescorecard.ed.gov${socialImage}` },
    { name: "og:description", property: 'og:description', content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
    { name: "og:image", property: 'og:image', content: `https://collegescorecard.ed.gov${socialImage}` },
    { name: "og:type", property: 'og:type', content: "website" },
    { name: 'og:url', property: 'og:url', content: 'https://collegescorecard.ed.gov/' },
    { name: 'og:title', property: 'og:title', content: 'College Scorecard' },
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://use.typekit.net/nmj8tls.css'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ],
  script: [
    { id: "_fed_an_ua_tag", src: "https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" },
    { type: "text/javascript", src: "https://www.googletagmanager.com/gtag/js?id=UA-48605964-29", async: true },
    { type: "text/javascript", src: "https://www.googletagmanager.com/gtag/js?id=UA-48605964-29", async: true },
  ],
})
</script>