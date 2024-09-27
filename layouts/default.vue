<template>
  <v-app>
    <header class="d-print-none">
      <UsaBanner />
      <Header />
    </header>
    <div>
      <p>HEADER</p>
      <slot />
      <p>FOOTER</p>
    </div>
  </v-app>
</template>