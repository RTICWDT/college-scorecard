<template>
  <v-chip
    class="mb-2 pa-2"
    tag="div"
  >
    <div class="search-fos-chip-expand-container">
      <v-btn
        icon
        @click="showDetail = !showDetail"
      >
        <v-icon v-if="showDetail">mdi-menu-up</v-icon>
        <v-icon v-else>mdi-menu-down</v-icon>
      </v-btn>
    </div>

    <div class="search-fos-chip-title-container">
      <v-btn
        @click="showDetail = !showDetail"
        text
      >
        <span class="search-fos-chip-title">{{fieldOfStudy.field}}</span>
      </v-btn>
    </div>

<!--    <v-btn-->
<!--      class="ml-4"-->
<!--      icon-->
<!--      absolute-->
<!--      right-->
<!--     @click="$emit('chip-close',fieldOfStudy)"-->
<!--    >-->
<!--      <v-icon>mdi-close-circle</v-icon>-->
<!--    </v-btn>-->

    <div class="search-fos-chip-close-container">
      <v-btn
        icon
        @click="$emit('chip-close',fieldOfStudy)"
      >
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </div>


<!--    <v-row>-->
<!--      <v-col sm="2">-->
<!--        <v-btn icon-->
<!--          @click="showDetail = !showDetail"-->
<!--        >-->
<!--          <v-icon v-if="showDetail">mdi-menu-up</v-icon>-->
<!--          <v-icon v-else>mdi-menu-down</v-icon>-->
<!--        </v-btn>-->
<!--      </v-col>-->

<!--      <v-col sm="8">-->
<!--        {{fieldOfStudy.field}}-->
<!--      </v-col>-->

<!--      <v-col sm="2">-->
<!--        <v-btn icon absolute right-->
<!--         @click="$emit('chip-close',fieldOfStudy)"-->
<!--        >-->
<!--          <v-icon>mdi-close-circle</v-icon>-->
<!--        </v-btn>-->
<!--      </v-col>-->
<!--    </v-row>-->

    <div
      v-if="showDetail"
      class="fos-chip-detail mb-1 mt-2"
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
    overflow-y: auto;
  }

  .search-fos-chip-expand-container{
    display: inline-block;
  }

  .search-fos-chip-title-container{
    display: inline-block;

    .search-fos-chip-title{
      height: auto;
      width: 150px;
      display: block;
      overflow-wrap: normal;
      white-space: normal !important;
      font-weight: normal !important;
      letter-spacing: normal !important;
      text-transform: none !important;
    }

    button{
      width: 150px;
      height: auto !important;
      span{
      }
    }
  }

  .search-fos-chip-close-container{
    display: inline-block;
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