<template>
  <div class="d-flex flex-column align-center justify-center h-100 w-100">
    <h1 class="navy-text">Test</h1>
    <v-container>
      <v-row>  
        <CBox :items="options"/>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const { site } = useSiteData()

const options = ref(site.value.data.cip_6_digit.map((item) => {
  return { id: item.code, text: item.title, subtitle: item.cip4Title }
}))

</script>