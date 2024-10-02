// composables/useRecaptcha.js
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

export const useRecaptcha = (size = 'normal') => {
  const config = useRuntimeConfig()
  const siteKey = config.public.recaptchaKey

  const recaptchaLoaded = ref(false)
  const recaptchaToken = ref(null)
  let onSuccessCallback = null

  const loadRecaptchaScript = () => {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      recaptchaLoaded.value = true
    }
  }

  const onRecaptchaVerified = (token) => {
    recaptchaToken.value = token
    if (onSuccessCallback) {
      onSuccessCallback(token)
    }
  }

  const setOnSuccess = (callback) => {
    onSuccessCallback = callback
  }

  onMounted(() => {
    loadRecaptchaScript()
    window.onRecaptchaVerified = onRecaptchaVerified
  })

  return {
    siteKey,
    recaptchaLoaded,
    recaptchaToken,
    setOnSuccess,
    size
  }
}