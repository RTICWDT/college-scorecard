<template>
  <div :class="classes" ref="arrowContainer">
    <svg :width="width" :height="height" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        :class="['arrow-path', { 'animate': hasBeenVisible }]" 
        :d="path" 
        :style="{ '--arrow-color': color }"
      />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  path: {
    type: String,
  },
  color: {
    type: String,
  },
  width: {
    type: [Number, String],
  },
  height: {
    type: [Number, String],
  },
  viewBox: {
    type: String,
  },
  classes: {
    type: [String, Array, Object],
    default: ''
  }
})

const arrowContainer = ref(null)
const hasBeenVisible = ref(false) // Changed from isVisible to hasBeenVisible
const maxRetries = 3
let retryCount = 0

const setupObserver = () => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.intersectionRect.x && !entry.intersectionRect.y && retryCount < maxRetries) {
      retryCount++
      observer.disconnect()
      
      setTimeout(() => {
        setupObserver()
      }, 100)
      
      return
    }

    // If the element becomes visible, set hasBeenVisible to true and disconnect the observer
    if (entry.isIntersecting) {
      hasBeenVisible.value = true
      observer.disconnect() // Stop observing once animation has triggered
    }
  }, {
    threshold: 1
  })

  if (arrowContainer.value) {
    observer.observe(arrowContainer.value)
  }

  return observer
}

onMounted(async () => {
  await nextTick()
  setupObserver()
})
</script>

<style scoped lang="scss">
.arrow-path {
  stroke: var(--arrow-color);
  stroke-width: 1;
  fill: var(--arrow-color);
  fill-opacity: 0;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
}

.arrow-path.animate {
  animation: draw 1s ease forwards 0.5s, fillIn 0.5s ease forwards 1s;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fillIn {
  from {
    fill-opacity: 0;
  }
  to {
    fill-opacity: 1;
  }
}
</style>