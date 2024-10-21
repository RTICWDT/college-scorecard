<template>
  <v-app>
    <header class="d-print-none">
      <LayoutUsaBanner />
      <LayoutHeader />
    </header>
    <v-main id="mainContent">
      <slot />
      
    </v-main>
    <LayoutFooter />
    <CompareDrawer />  
  </v-app>
  
</template>

<script setup>
useHead({
  titleTemplate: '%s | College Scorecard',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { 'http-equiv': "Cache-control", content: "private, no-store" },
    { name: 'HandheldFriendly', content: 'True' },
    { name: 'MobileOptimized', content: '390' },
    { name: "google-site-verification", content: "joZQgj-M8GQ05V29ojfVsbsNk44SRgGqJfws9tBcnPU" },
    { name: "google-site-verification", content: "V-KEdRwSWd6GSLEWRBddZy6B5yLCs6vkRRflrImQiKE" },
    { name: "viewport", content: "width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1" },
    { name: "description", content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "College Scorecard" },
    { name: "twitter:description", content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
    { name: "twitter:image", content: "/social-card.png" },
    { name: "og:description", content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
    { name: "og:image", content: "/social-card.png" },
    { name: "og:type", content: "website" },
    { name: 'og:url', content: 'https://collegescorecard.ed.gov/' },
    { name: 'og:title', content: 'College Scorecard' },
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
    },
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