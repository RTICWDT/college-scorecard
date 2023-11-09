<template>
  <div data-v-5c1ad70f="" data-v-7a69384f="" aria-label="Official government website" class="usx-component usx-banner banner bg-dark">
    
    <div size="lg" class="usx-component container-lg"><p class="usx-banner-text"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="11px" viewBox="0 0 16 11" enable-background="new 0 0 16 11" xml:space="preserve" class="usx-flag"><image id="image0" width="16" height="11" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALBAMAAACEzBAKAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEUdM7EeNLIeM7HgQCDa
Ph/bPh/bPx/////bPyBEby41AAAAAWJLR0QHFmGI6wAAAAd0SU1FB+QIDQMpDiKjbJ0AAABTSURB
VAjXY2BUYmI0cXVzYVBXVxcqBwIGJSElpZYQlxQGgaKCQrCIgBKTUKtbSghIjSJYhImJSSElxcWF
oRwKGFw8Ulzc3IC64CIhKa1hES4uLQCkqxtECUS6FgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0w
OC0xM1QwMzo0MToxNCswMzowMGPS+9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDgtMTNUMDM6
NDE6MTQrMDM6MDASj0NrAAAAAElFTkSuQmCC"></image></svg> 

<span v-if="$vuetify.breakpoint.mdAndUp"> An official website of the United States government <button @click="toggleInfo"><span tabindex="2" class="usx-banner-toggle"> Here’s how you know <i class="fas " :class="showInfo ? 'fa-chevron-up' : 'fa-chevron-down'"></i></span></button></span>

<button @click="toggleInfo"><span v-if="$vuetify.breakpoint.smAndDown"><span tabindex="2" class=""> An official website of the United States government <i class="fas " :class="showInfo ? 'fa-chevron-up' : 'fa-chevron-down'"></i></span></span></button>

</p>

<div class="mt-2" v-show="showInfo"><div class="usx-banner-info-container usx-component row" fluid=""><div class="usx-component col"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" class="usx-banner-icon"><title>icon-dot-gov</title><path fill="#2378C3" fill-rule="evenodd" d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0zm0 1.208C14.994 1.208 1.208 14.994 1.208 32S14.994 62.792 32 62.792 62.792 49.006 62.792 32 49.006 1.208 32 1.208zm10.59 38.858a.857.857 0 0 1 .882.822v1.642H18.886v-1.642a.857.857 0 0 1 .882-.822H42.59zM25.443 27.774v9.829h1.642v-9.83h3.273v9.83H32v-9.83h3.272v9.83h1.643v-9.83h3.272v9.83h.76a.857.857 0 0 1 .882.821v.821h-21.3v-.809a.857.857 0 0 1 .88-.82h.762v-9.842h3.272zm5.736-8.188l12.293 4.915v1.642h-1.63a.857.857 0 0 1-.882.822H21.41a.857.857 0 0 1-.882-.822h-1.642v-1.642l12.293-4.915z"></path></svg><p class="usx-banner-info-text"><strong>Official websites use .gov</strong><br> A <strong>.gov</strong> website belongs to an official government organization in the United States. </p></div><div class="usx-component col"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" class="usx-banner-icon"><title>icon-https</title><path fill="#719F2A" fill-rule="evenodd" d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0zm0 1.208C14.994 1.208 1.208 14.994 1.208 32S14.994 62.792 32 62.792 62.792 49.006 62.792 32 49.006 1.208 32 1.208zm0 18.886a7.245 7.245 0 0 1 7.245 7.245v3.103h.52c.86 0 1.557.698 1.557 1.558v9.322c0 .86-.697 1.558-1.557 1.558h-15.53c-.86 0-1.557-.697-1.557-1.558V32c0-.86.697-1.558 1.557-1.558h.52V27.34A7.245 7.245 0 0 1 32 20.094zm0 3.103a4.142 4.142 0 0 0-4.142 4.142v3.103h8.284V27.34A4.142 4.142 0 0 0 32 23.197z"></path></svg><p class="usx-banner-info-text"><strong>Secure .gov websites use HTTPS</strong><br> A <strong>lock</strong> (<i class="fas fa-lock"></i>) or <strong>https://</strong> means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites. </p></div></div></div></div>


</div>
</template>

<style lang="scss" scoped>
.banner {
  background-color: #EFF1F5;
  z-index: 1000 !important;
  position: fixed;
  width: 100%;
  ::v-deep .usx-banner-text {
    margin-bottom: 0;
    font-size: 0.75rem;
    padding: 2px 25px;
    color: black;
    .usx-flag {
      vertical-align: middle;
    }
    .usx-banner-toggle {
      color: #0071BB;
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
    color: black;
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

<script>

export default {
  data() {
    return {
      showInfo: false,
    }
  },
  methods: {
    toggleInfo() {
      this.showInfo = !this.showInfo;
    },
  },
  computed: {

  },
  mounted() {},
}
</script>