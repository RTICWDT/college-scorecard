<style scoped>
li {
  padding: 0 12px;
  position: relative;
}

li a, li span {
  text-decoration: none;
  color: white;
  padding-bottom: 10px;
  cursor: pointer;
}

li a.active, li span.active {
  font-weight: bold;
  border-bottom: 3px solid #97cff5;
  z-index: -100;
}

.icon {
  color: white;
  width: 15px;
}

.subnav {
  position: absolute;
  z-index: 100;
  background-color: white;
  top: 31px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subnav .button {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  text-decoration: none;
  color: inherit;
}
</style>

<template>
  <li 
    @mouseenter="showSubnav" 
    @mouseleave="hideSubnav"
    @keydown="handleKeyDown"
    @focus="showSubnav"
    @blur="handleBlur"

  >
    <span 
      :class="{ 'active': active }"
      tabindex="0"
      role="button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      {{ label }}
      <v-icon class="icon">{{ isOpen ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
    </span>
    <div class="subnav" :style="{ right: rightOffset }" v-if="isOpen">
      <v-btn 
        v-for="(item, index) in items" 
        :key="index"
        class="justify-start" 
        text
        x-large
        @click="handleItemClick(item.action)"
        tabindex="0" 
        @blur="handleSubnavBlur"
        @keydown="handleKeyDown"
        :data-route="item.action"
      >
        {{ item.label }}
    </v-btn>
    </div>
  </li>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    required: true
    // Each item should be an object with 'label' and 'action' properties
  },
  rightOffset: {
    type: String,
    default: 'none'
  },
  onNavigate: {
    type: Function,
    required: true
  }
})

const router = useRouter()
const isOpen = ref(false)

const showSubnav = () => {
  isOpen.value = true
}

const hideSubnav = () => {
  isOpen.value = false
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
    const route = event.target.dataset.route
    if (route) {
      hideSubnav()
      props.onNavigate(route)
      router.push(route)
      return
    }
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleSubnav()
  } else if (event.key === 'Escape' && isOpen.value) {
    hideSubnav()
    event.target.focus() // Keep focus on the main item
  }
}

const toggleSubnav = () => {
  isOpen.value = !isOpen.value
}

const handleBlur = (event) => {
  setTimeout(() => {
    if (!event.target.contains(document.activeElement)) {
      hideSubnav()
    }
  }, 0)
}

const handleSubnavBlur = (event) => {
  setTimeout(() => {
    const li = event.target.closest('li')
    if (!li) { return }
    if (!li.contains(document.activeElement)) {
      hideSubnav()
    }
  }, 0)
}

const handleItemClick = (action) => {
  // You may want to implement your own analytics tracking here
  // or use a composable for analytics
  hideSubnav()
  props.onNavigate(action)
  router.push(action)
}
</script>