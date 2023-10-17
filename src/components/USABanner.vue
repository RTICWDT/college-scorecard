<template>
  <us-official-header class="banner"></us-official-header>
</template>

<style lang="scss" scoped>
.banner {
  background-color: #1b1b1b;
  z-index: 1000 !important;
  position: fixed;
  width: 100%;
  ::v-deep .usx-banner-text {
    margin-bottom: 0;
    font-size: 0.75rem;
    padding: 2px 25px;
    color: white;
    .usx-flag {
      vertical-align: middle;
    }
    .usx-banner-toggle {
      color: #adadad;
      text-decoration: underline;
      cursor: pointer;
      .fa-chevron-down,
      .fa-chevron-up {
        color: rgb(36, 145, 255);
        font-size: 9px;
      }
    }
  }
  ::v-deep .usx-banner-info-container {
    padding: 10px 25px;
    color: white;
    @media (max-width: 960px) {
      display: block;
    }
    .usx-component {
      display: flex;
    }
    .row {
      @media (max-width: 960px) {
        display: block;
      }
    }
    .usx-banner-icon {
      width: 50px;
      margin-right: 15px;
    }
    .usx-banner-info-text {
      max-width: 400px;
    }
  }
}
</style>
