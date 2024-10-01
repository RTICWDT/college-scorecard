<template>
  <v-app>
    <header class="d-print-none">
      <LayoutUsaBanner />
      <LayoutHeader />
    </header>
    <v-main id="mainContent">
      <slot/>
    </v-main>
    <LayoutFooter />
  </v-app>
</template>