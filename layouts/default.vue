<template>
  <v-app>
    <header class="d-print-none">
      <LayoutUsaBanner />
      <LayoutHeader />
    </header>
    <div id="mainContent">
      <slot/>
    </div>
    <LayoutFooter />
  </v-app>
</template>