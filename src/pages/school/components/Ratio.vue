<template>
  <div>
  <div class="circle-container">
    <div class="bg-circle"></div>
    <div class="circle light">{{value}}</div> : 
    <div class="circle dark">1</div>
  </div>
  <div class="mt-4 d-inline-block float-left">
    <div class="key-box medium-blue"></div>Full-Time Students
    <div class="key-box ml-3 mid-dark-blue"></div>Full-Time Staff
</div>
</div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";


.circle-container {
  display:inline-flex;
  justify-content: center;
  align-items: center;
  width: 400px; height: 200px;
  font-weight:600;
  font-size:28px;
}

.bg-circle {
  height:200px;
  width:200px;
  position:absolute;
  border-radius: 50%;
  z-index:1;
  border:2px solid #ededed;
}
.circle {
  border-radius: 50%;
  background-color: blue;
  border-radius: 50%;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 5em;
  width: 5em;
  color: $white;
  z-index:2

}

.light {
  background : $medium-blue;
  border: 0.1875em solid $medium-blue;
}

.dark {
  background : $medium-dark-blue;
  border: 0.1875em solid $medium-dark-blue;
}

</style>

<script>
export default {
  props: {
    value: {
      type: Number,
    },
  },
  data() {
    return {
      selected: null,
    }
  },
  methods: {
    tabID(context, controlTab) {
      if (context === "institutions") {
        return controlTab === 0
          ? "compare-toggle-school-active"
          : "compare-tab-inactive"
      } else if (context === "fos") {
        return controlTab === 1
          ? "compare-toggle-fos-active"
          : "compare-tab-inactive"
      }
    },
  },
  mounted() {
    // Hacky way to remove the pagination slider arrows.
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__prev').remove();
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__next').remove();
  },
}
</script>
