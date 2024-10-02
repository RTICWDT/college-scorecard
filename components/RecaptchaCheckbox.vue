<template>
  <div>
    <div v-if="recaptchaLoaded" class="g-recaptcha" :data-sitekey="siteKey" data-callback="onRecaptchaVerified"></div>
  </div>
</template>

<script setup>
const { siteKey, recaptchaLoaded, setOnSuccess } = useRecaptcha()

// Expose setOnSuccess method to parent components
defineExpose({ setOnSuccess })
</script>