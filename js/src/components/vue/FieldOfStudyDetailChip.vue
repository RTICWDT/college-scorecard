<template>
  <v-chip
    class="mb-1"
    tag="div"

  >
    <v-row>
      <v-col cols="12" md="2">
        <v-btn icon
          @click="showDetail = !showDetail"
        >
          <v-icon v-if="showDetail">mdi-menu-up</v-icon>
          <v-icon v-else>mdi-menu-down</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="8">
        {{fieldOfStudy.field}}
      </v-col>
      <v-col cols="12" md="2">
        <v-btn icon absolute right
         @click="$emit('chip-close',fieldOfStudy)"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div
      v-if="showDetail"
      class="fos-chip-detail mb-1"
    >
      <p>This field of study includes the following programs:</p>
      <ul>
        <li
          v-for="cip6 in cipSixItems"
          class="mb-1"
        >
          {{cip6.title}}
        </li>
      </ul>
    </div>
  </v-chip>
</template>

<style lang="scss">
  .fos-chip-detail {
    max-height: 200px;
    overflow-y: scroll;
  }

</style>

<script>
  export default {
    props: {
      fieldOfStudy:{
        required: true
      },
      cipSixItems: {
        required: true
      }
    },
    data(){
      return {
        showDetail: false
      }
    }
  }
</script>