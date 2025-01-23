<template>
  <div>
    <div 
      v-if="recaptchaLoaded" 
      class="g-recaptcha" 
      :data-sitekey="siteKey" 
      data-callback="onRecaptchaVerified"
      :data-size="size"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'compact'].includes(value)
  }
})

const { siteKey, recaptchaLoaded, setOnSuccess, size } = useRecaptcha(props.size)

// Expose setOnSuccess method to parent components
defineExpose({ setOnSuccess })
</script>