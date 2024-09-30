<template>
  <v-app>
    <header class="d-print-none">
      <LayoutUsaBanner />
      <LayoutHeader />
    </header>
    <div>
      <slot />
    </div>
    <LayoutFooter />
  </v-app>
</template>