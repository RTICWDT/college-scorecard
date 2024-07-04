<style lang="scss" scoped>
li {
  padding: 0 12px;
  position: relative;

  a, span {
    text-decoration: none;
    color: white;
    padding-bottom: 10px;
    cursor: pointer;

    &.active {
      font-weight: bold;
      border-bottom: 3px solid #97cff5;
      z-index: -100;
    }

    .icon {
      color: white;
      width: 15px;
    }
  }
}

.subnav {
  position: absolute;
  z-index: 9999;
  background-color: white;
  top: 31px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  button {
    height: 40px !important;
  }
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
      :class="{ 'active': isActive }"
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
        :data-route="item.action"
      >
        {{ item.label }}
      </v-btn>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Subnav',
  props: {
    label: {
      type: String,
      required: true
    },
    isActive: {
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
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    showSubnav() {
      this.isOpen = true;
    },
    hideSubnav() {
      this.isOpen = false;
    },
    handleKeyDown(event) {
      if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
        const route = event.target.dataset.route;
        if (route) {
          return this.$router.push(route);
        }
      };

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleSubnav();
      } else if (event.key === 'Escape' && this.isOpen) {
        this.hideSubnav();
        event.target.focus(); // Keep focus on the main item
      }
    },
    toggleSubnav() {
      this.isOpen = !this.isOpen;
    },
    handleBlur(event) {
      setTimeout(() => {
        if (!event.target.contains(document.activeElement)) {
          this.hideSubnav();
        }
      }, 0);
    },
    handleSubnavBlur(event) {
      setTimeout(() => {
        const li = event.target.closest('li');
        if (!li.contains(document.activeElement)) {
          this.hideSubnav();
        }
      }, 0);
    },
    handleItemClick(action) {
      return this.$router.push(action);
    }
  }
}
</script>