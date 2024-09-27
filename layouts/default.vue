<template>
  <v-app>
    <header class="d-print-none">
      <UsaBanner />
      <Header />
    </header>
    <div>
      <slot />
    </div>
    <Footer />
  </v-app>
</template>