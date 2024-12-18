<template>
  <div class="combobox combobox-list w-100">
    <div class="group" ref="groupNode">
      <div
        class="input-wrapper"
        :class="{ 
          'active': comboboxHasVisualFocus, 
          'options-visible': isOpen, 
          'variant-dense': variant === 'dense',
          'variant-home': variant === 'home',
          }"
        >
        <div style="width: 25px;">
          <v-icon v-if="loading" size="small" class="icon" icon="fa:fas fa-circle-notch fa-spin" aria-label="Loading results" />
          <v-icon v-else class="icon" icon="mdi:mdi-magnify" aria-label="Search" />
        </div>
        <input
          id="cb1-input"
          ref="comboboxNode"
          class="cb_edit w-100"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="isOpen && options.length > 0"
          aria-controls="cb1-listbox"
          aria-label="Search items"
          :aria-activedescendant="activeDescendant"
          :value="filter"
          @input="onComboboxInput"
          @keydown="onComboboxKeyDown"
          @keyup="onComboboxKeyUp"
          @focus="onComboboxFocus"
          @blur="removeVisualFocusAll()"
        >
        <div
          ref="placeholderNode"
          class="placeholder-text position-absolute"
          :class="{
            'variant-dense': variant === 'dense',
            'variant-home': variant === 'home',
          }"
          @click="onPlaceHolderClick">
          {{ placeholder }}
        </div>
        <button
          v-show="options.length > 0"
          id="cb1-button"
          ref="buttonNode"
          tabindex="-1"
          aria-label="Toggle dropdown"
          :aria-expanded="isOpen && options.length > 0"
          aria-controls="cb1-listbox"
          @click="onButtonClick"
        >
          <svg width="18" height="18" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
            <polygon class="arrow" stroke-width="0" fill="#000" points="4,9 14,9 9,14"></polygon>
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <ul
        id="cb1-listbox"
        ref="listboxNode"
        role="listbox"
        aria-label="States"
        :class="{ 'focus': listboxHasVisualFocus, 'update:modelValue': listboxHasVisualFocus }"
        class="elevation-4"
        :style="listboxStyle"
      >
        <li
          v-for="option in options"
          :key="`${option.code}.${option.title}.${option.subtitle}`"
          :id="option.code"
          role="option"
          :aria-selected="option === selectedOption"
          @click="onOptionClick(option)"
          class="pl-3 py-2 pr-3"
        >
          <!-- Disable exact match bolding for now -->
          <p class="text-body-1" :class="{ 'font-weight-bold': option.exact && false }">{{ option.text }}</p>
          <p class="text-body-2 text-gray-700">{{ option.subtitle }}</p>
        </li>
      </ul>
    </Teleport>

  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  onFilter: {
    type: Function,
    default: (searchInput, options) => { return options }
  },
  color: {
    type: String,
    default: '#007000'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'homepage', 'dense'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'onSubmit', 'onClear', 'onSearch'])
const themeColor = ref(props.color)
const themeColorTranparent = ref(props.color + '11')

const comboboxNode = ref(null)
const placeholderNode = ref(null)
const groupNode = ref(null)
const buttonNode = ref(null)
const listboxNode = ref(null)

const filter = ref()

const isOpen = ref(false)
const selectedOption = ref(props.modelValue)
const activeDescendant = ref('')
const comboboxHasVisualFocus = ref(false)
const listboxHasVisualFocus = ref(false)

const firstOption = computed(() => props.options[0] || null)
const lastOption = computed(() => props.options[props.options.length - 1] || null)

onMounted(() => {
  if (props.modelValue) {
    if (typeof props.modelValue === 'string') {
      filter.value = props.modelValue
    } else {
      filter.value = props.modelValue.title
    }
  }
})

// 
// COMBOBOX INPUT HANDlERS & CLICKS
//

const onComboboxInput = (event) => {
  filter.value = event.target.value
  props.onFilter(filter.value)
  emit('onInput', filter.value)
}

watch(props.options, (newVal) => {
  props.options.lenth > 0 ? open() : close()
})

const onComboboxKeyDown = (event) => {
  let flag = false
  const altKey = event.altKey

  if (event.ctrlKey || event.shiftKey) {
    return
  }

  switch (event.key) {
    case 'Enter':
      if (selectedOption.value) {
        emit('update:modelValue', selectedOption.value)
        emit('onSubmit', selectedOption.value)
      } else {
        emit('onSearch', filter.value)
      }

      if (listboxHasVisualFocus.value) {
        setValue(selectedOption.value.text)
      }

      close(true)
      setVisualFocusCombobox()
      flag = true
      emit('update:modelValue', selectedOption.value)
      
      break
    case 'ArrowDown':
      if (props.options.length > 0) {
        if (altKey) {
          open()
        } else {
          open()
          if (listboxHasVisualFocus.value) {
            setOption(getNextOption(selectedOption.value), true)
            setVisualFocusListbox()
          } else {
            setOption(firstOption.value, true)
            setVisualFocusListbox()
          }
        }
      }
      flag = true
      break
    case 'ArrowUp':
      if (props.options.length > 0) {
        if (listboxHasVisualFocus.value) {
          setOption(getPreviousOption(selectedOption.value), true)
        } else {
          open()
          if (!altKey) {
            setOption(lastOption.value, true)
            setVisualFocusListbox()
          }
        }
      }
      flag = true
      break
    case 'Escape':
      if (isOpen.value) {
        close(true)
        filter.value = comboboxNode.value.value
      } else {
        setValue('')
        comboboxNode.value.value = ''
      }
      selectedOption.value = null
      flag = true
      break
    case 'Tab':
      close(true)
      if (listboxHasVisualFocus.value && selectedOption.value) {
        setValue(selectedOption.value.text)
      }
      break
    case 'Home':
      comboboxNode.value.setSelectionRange(0, 0)
      flag = true
      break
    case 'End':
      const length = comboboxNode.value.value.length
      comboboxNode.value.setSelectionRange(length, length)
      flag = true
      break
  }

  if (flag) {
    event.stopPropagation()
    event.preventDefault()
  }
}

const onComboboxKeyUp = (event) => {
  const char = event.key

  if (isPrintableCharacter(char)) {
    filter.value += char
  }

  if (comboboxNode.value.value.length < filter.value.length) {
    filter.value = comboboxNode.value.value
    selectedOption.value = null
  }

  if (event.key === 'Escape') {
    return
  }

  switch (event.key) {
    case 'Backspace':
      setVisualFocusCombobox()
      filter.value = comboboxNode.value.value
      selectedOption.value = null
      break
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Home':
    case 'End':
      selectedOption.value = null
      setVisualFocusCombobox()
      break
    default:
      // enter a character to search on
      if (isPrintableCharacter(char)) {
        setVisualFocusCombobox()
        const option = props.options[0]

        if (option) {
          if (isOpen.value === false && comboboxNode.value.value.length) {
            open()
          }
          if (option.text.toLowerCase().startsWith(comboboxNode.value.value.toLowerCase())) {
            selectedOption.value = option
            if (listboxHasVisualFocus.value) {
              setOption(option)
            }
          } else {
            selectedOption.value = null
          }
        } else {
          close()
          selectedOption.value = null
        }
      }
      break
  }
}

const onComboboxFocus = () => {
  filter.value = comboboxNode.value.value
  setVisualFocusCombobox()
  selectedOption.value = null
  placeholderNode.value.classList.add('focus')
  placeholderNode.value.classList.add('active')
  open()
}

const onPlaceHolderClick = () => {
  comboboxNode.value.focus()
}

const onButtonClick = () => {
  isOpen.value ? close(true) : open()
  placeholderNode.value.classList.add('active')
  placeholderNode.value.classList.add('focus')
}

watch(() => [props.options, isOpen], () => {
  if (props.options.length > 0 && isOpen.value) {
    comboboxNode.value.setAttribute('aria-expanded', 'true')
    buttonNode.value.setAttribute('aria-expanded', 'true')
  } else {
    comboboxNode.value.setAttribute('aria-expanded', 'false')
    buttonNode.value.setAttribute('aria-expanded', 'false')
  }
})

// OPEN & CLOSE
//
const open = () => {
  isOpen.value = true
}

const close = (force = false) => {
  if (force || (!comboboxHasVisualFocus.value && !listboxHasVisualFocus.value)) {
    isOpen.value = false
    comboboxNode.value.setAttribute('aria-expanded', 'false')
    buttonNode.value.setAttribute('aria-expanded', 'false')
    setActiveDescendant(null)

    if (!comboboxNode.value.value) {
      placeholderNode.value.classList.remove('active')
    }
  }
}

// SETTERS & FOCUS
// 

const setValue = (value) => {
  filter.value = value
  comboboxNode.value.value = filter.value
  comboboxNode.value.setSelectionRange(filter.value.length, filter.value.length)
}

const setOption = (option, flag = false) => {
  if (option) {
    selectedOption.value = option
    setActiveDescendant(option)

    comboboxNode.value.value = option.text
    if (flag) {
      comboboxNode.value.setSelectionRange(option.text.length, option.text.length)
    } else {
      comboboxNode.value.setSelectionRange(filter.value.length, option.text.length)
    }
  }
}

const onOptionClick = (option) => {
  setValue(option.text)
  emit('update:modelValue', option)
  emit('onSubmit', option)
  close(true)
}

const setVisualFocusCombobox = () => {
  listboxNode.value.classList.remove('focus')
  comboboxNode.value.parentNode.classList.add('focus')
  comboboxHasVisualFocus.value = true
  listboxHasVisualFocus.value = false
  setActiveDescendant(null)
}

const setVisualFocusListbox = () => {
  comboboxNode.value.parentNode.classList.remove('focus')
  comboboxHasVisualFocus.value = false
  listboxHasVisualFocus.value = true
  listboxNode.value.classList.add('focus')
  if (selectedOption.value) {
    setActiveDescendant(selectedOption.value)
  }
}

const removeVisualFocusAll = () => {
  if (!comboboxNode.value) {
    return
  }

  comboboxNode.value.parentNode.classList.remove('focus')
  comboboxHasVisualFocus.value = false
  listboxHasVisualFocus.value = false
  listboxNode.value.classList.remove('focus')
  selectedOption.value = null
  setActiveDescendant(null)
  placeholderNode.value.classList.remove('focus')
}

// OPTION SCROLLING
//

const setActiveDescendant = (option) => {
  if (option && listboxHasVisualFocus.value) {
    activeDescendant.value = option.code
    if (!isOptionInView(option)) {
      const optionNode = document.getElementById(option.code)
      optionNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  } else {
    activeDescendant.value = ''
  }
}

const getNextOption = (currentOption) => {
  if (currentOption !== lastOption.value) {
    const index = props.options.indexOf(currentOption)
    return props.options[index + 1]
  }
  return firstOption.value
}

const getPreviousOption = (currentOption) => {
  if (currentOption !== firstOption.value) {
    const index = props.options.indexOf(currentOption)
    return props.options[index - 1]
  }
  return lastOption.value
}

const isOptionInView = (option) => {
  const optionNode = document.getElementById(option.code)
  const bounding = optionNode.getBoundingClientRect()
  const listboxBounds = listboxNode.value.getBoundingClientRect()



  return (
    bounding.top >= listboxBounds.top &&
    bounding.left >= listboxBounds.left &&
    bounding.bottom <= listboxBounds.bottom &&
    bounding.right <= listboxBounds.right
  )
}

const isPrintableCharacter = (str) => {
  if (!str) return false
  return str.length === 1 && str.match(/\S| /)
}




// LISTBOX STYLING and VISIBILITY
//
const onBackgroundMouseDown = (event) => {
  if (!comboboxNode.value.contains(event.target) &&
      !listboxNode.value.contains(event.target) &&
      !buttonNode.value.contains(event.target)) {
    comboboxHasVisualFocus.value = false
    removeVisualFocusAll()
    close(true)
  }
}

const styleRef = ref({ display: 'none' })

// Debounced update function
const updateStyle = () => {
  if (!isOpen.value || !comboboxNode.value || !groupNode.value) {
    styleRef.value = { display: 'none' }
    return
  }

  const rect = groupNode.value.getBoundingClientRect()
  styleRef.value = {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    display: 'block'
  }
} // roughly one frame at 60fps


watch([isOpen, comboboxNode, groupNode], updateStyle)
const listboxStyle = computed(() => styleRef.value)
const onWindowResize = () => { updateStyle() }
const onScroll = () => { updateStyle() }

onMounted(() => {
  document.addEventListener('mousedown', onBackgroundMouseDown, true)
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('scroll', onScroll)

  if (selectedOption.value) {
    placeholderNode.value.classList.add('active')
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onBackgroundMouseDown, true)
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped lang="scss">
.placeholder-text {
  user-select: none;
  left: 43px;
  background-color: white;
  padding-left: 5px;
  padding-right: 5px;
  transition: all 0.2s;
  top: 15px;
  color: use-theme('gray-700');
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

  &.variant-dense:not(.active) {
    top: 8px;
  }

  &.variant-home:not(.active) {
    top: 23px;
  }

  &.active {
    font-size: 12px;
    top: -10px;
    left: 25px;

    .variant-home & {
      top: 5px;
      left: 40px;
    }
  }

  &.focus {
    color: v-bind('themeColor');
  }
}

.cb_edit {
  outline: none;;
}
.combobox-list {
  position: relative;
}

.combobox .group {
  display: flex;
  cursor: pointer;
  align-items: center;
}

.combobox input {
  flex-grow: 2;
  font-size: 16px !important;
}

.combobox input,
.combobox button {
  background-color: white;
  color: black;
  box-sizing: border-box;
  height: 30px;
  padding: 0;
  margin: 0;
  vertical-align: bottom;
  border: 1px solid gray;
  position: relative;
  cursor: pointer;
}

.combobox input {
  cursor: text;
}

.combobox input {
  border: none;
  outline: none;
  font-size: 87.5%;
  padding: 1px 3px;
}

.combobox button {
  width: 19px;
  border: none;
  outline: none;
  color: rgb(0 90 156);
  
}

.combobox button[aria-expanded="true"] svg {
  transform: rotate(180deg) translate(0, -3px);
  transition: all 0.2s;
}

.combobox button[aria-expanded="false"] svg {
  transform: rotate(0deg) translate(0, 0px);
  transition: all 0.2s;
}

ul[role="listbox"] {
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 1000000;
  left: 4px;
  top: 66px;
  list-style: none;
  background-color: white;
  display: none;
  box-sizing: border-box;
  max-height: 350px;
  overflow: scroll;
  overflow-x: hidden;
  font-size: 87.5%;
  cursor: pointer;
  width: calc(100% - 8px);
}

ul[role="listbox"] li[role="option"] {
  margin: 0;
  display: block;
  padding-left: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
}

/* focus and hover styling */

.combobox .group.focus,
.combobox .input-wrapper:hover {
  border-color: black;
}

.combobox .group.focus polygon,
.combobox .group:hover polygon {
  fill-opacity: 1;
}

[role="listbox"].focus [role="option"][aria-selected="true"],
[role="listbox"] [role="option"]:hover {
  background-color: v-bind('themeColorTranparent');
  padding-top: 0;
  padding-bottom: 0;
  outline: 1px solid v-bind('themeColor');

}


.combobox .input-wrapper {
  background-color: white;
  border: 1px solid grey;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 1rem;
  height: 55px;

  transition: border-color 0.15s ease, outline-color 0.15s ease;
  cursor: text;
  box-sizing: border-box;

  &.variant-dense {
    height: 40px;
  }

  &.variant-home {
    height: 70px;
    border: 1px solid transparent;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
}

.combobox .input-wrapper:focus-within,
.combobox .input-wrapper.active {
  border-width: 2px;
  border-color: v-bind('themeColor');
  // outline-color: v-bind('themeColor');
}

/* Add this class to the input-wrapper when options are being viewed */
.combobox .input-wrapper.options-visible {
  border-width: 2px;
  border-color: v-bind('themeColor');
  // outline-color: v-bind('themeColor');
}

/* Style for the v-icon */
.combobox .input-wrapper .icon {
  color: gray; /* Default color */
  transition: color 0.15s ease;
}

/* Change icon color when input is focused or options are visible */
.combobox .input-wrapper:focus-within .icon,
.combobox .input-wrapper.active .icon,
.combobox .input-wrapper.options-visible .icon {
  color: v-bind('themeColor'); /* Match the border color */
}

#cb1-listbox {
  position: fixed;
  z-index: 1000000;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border-radius: 3px;
  max-height: 250px;
  overflow-y: auto;
}
</style>