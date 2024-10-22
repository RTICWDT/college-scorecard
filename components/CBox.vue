<template>
  <div class="combobox combobox-list w-100">
    <div class="group" ref="groupNode">
      <div class="input-wrapper" :class="{ 'active': comboboxHasVisualFocus, 'options-visible': isOpen }">
        <v-icon width="20" height="20" class="icon">mdi-magnify</v-icon>
        <input
          id="cb1-input"
          ref="comboboxNode"
          class="cb_edit"
          type="text"
          role="combobox"
          :aria-autocomplete="autocomplete"
          :aria-expanded="isOpen"
          aria-controls="cb1-listbox"
          :aria-activedescendant="activeDescendant"
          :value="filter"
          @input="onComboboxInput"
          @keydown="onComboboxKeyDown"
          @keyup="onComboboxKeyUp"
          @focus="onComboboxFocus"
          @blur="onComboboxBlur"
          @click="onComboboxClick"
          placeholder="Type to search"
        >
        <button
          id="cb1-button"
          ref="buttonNode"
          tabindex="-1"
          aria-label="States"
          :aria-expanded="isOpen"
          aria-controls="cb1-listbox"
          @click="onButtonClick"
        >
          <svg width="18" height="16" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
            <polygon class="arrow" stroke-width="0" fill-opacity="0.75" fill="#888" points="3,6 15,6 9,14"></polygon>
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
        :class="{ 'focus': listboxHasVisualFocus, 'selected': listboxHasVisualFocus }"
        class="elevation-4"
        :style="listboxStyle"
        @mouseover="onListboxMouseover"
        @mouseout="onListboxMouseout"
      >
        <li
          v-for="option in filteredOptions"
          :key="`${option.id}.${option.title}.${option.subtitle}`"
          :id="option.id"
          role="option"
          :aria-selected="option === selectedOption"
          @click="onOptionClick(option)"
          @mouseover="onOptionMouseover(option)"
          @mouseout="onOptionMouseout"
          class="pl-3 py-2 pr-3"
        >
          <p class="text-body-1">{{ option.text }}</p>
          <p class="text-body-2 text-gray-700">{{ option.subtitle }}</p>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup>
const comboboxNode = ref(null)
const groupNode = ref(null)
const buttonNode = ref(null)
const listboxNode = ref(null)
const filter = ref('')
const isOpen = ref(false)
const hasHover = ref(false)
const selectedOption = ref(null)
const activeDescendant = ref('')
const comboboxHasVisualFocus = ref(false)
const listboxHasVisualFocus = ref(false)

const props = defineProps({
  dense: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selected'])

const allOptions = ref(props.items)
const firstOption = computed(() => filteredOptions.value[0] || null)
const lastOption = computed(() => filteredOptions.value[filteredOptions.value.length - 1] || null)
const autocomplete = 'list'



// SEARCH ALGO
const cleanString = (str) => {
  return str.replace(/[^a-zA-Z\s]/g, '').trim();
}

function calculateStringSimilarity(str1, str2) {  
  // Convert to lowercase once for performance
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) {
    return 1 
  };
  
  // If str2 (search term) contains spaces, try matching it as a complete phrase first
  if (s2.includes(' ')) {
    // Complete phrase match at word boundary
    const phraseRegex = new RegExp(`\\b${escapeRegExp(s2)}\\b`, 'i');
    if (phraseRegex.test(s1)) return 0.98;
    
    // Complete phrase match anywhere
    if (s1.includes(s2)) {
      const position = s1.indexOf(s2);
      const positionPenalty = position / s1.length * 0.1;
      return 0.95 - positionPenalty;
    }
  }
  
  // Word boundary match
  const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(s2)}\\b`, 'i');
  if (wordBoundaryRegex.test(s1)) return 0.9;
  
  // Start of word match
  const startOfWordRegex = new RegExp(`\\b${escapeRegExp(s2)}`, 'i');
  if (startOfWordRegex.test(s1)) return 0.85;
  
  // Contains as exact substring
  if (s1.includes(s2)) {
    const position = s1.indexOf(s2);
    const positionPenalty = position / s1.length * 0.1;
    return 0.8 - positionPenalty;
  }
  
  // If the target contains the search term
  if (s2.includes(s1)) {
    return 0.6;
  }
  
  // Calculate Levenshtein distance for fuzzy matching
  const matrix = Array(s2.length + 1).fill().map(() => Array(s1.length + 1).fill(0));
  
  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  const distance = matrix[s2.length][s1.length];
  const lengthDifference = Math.abs(s1.length - s2.length);
  const lengthPenalty = lengthDifference / maxLength * 0.1;
  
  return Math.max(0, (1 - (distance / maxLength)) - lengthPenalty);
}

// Utility function to escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const filteredOptions = computed(() => {
  if (!filter.value) return allOptions.value;

  const cleanedFilter = cleanString(filter.value).toLowerCase();
  if (!cleanedFilter) return allOptions.value;
  
  // Calculate scores in a separate array
  const scoredOptions = allOptions.value.map(option => ({
    option,
    score: (() => {
      const cleanText = cleanString(option.text).toLowerCase();
      const cleanSubtitle = cleanString(option.subtitle).toLowerCase();

      // Calculate scores for each search term
      const textScores = [cleanedFilter].map(term => calculateStringSimilarity(cleanText, term));
      const subtitleScores = [cleanedFilter].map(term => calculateStringSimilarity(cleanSubtitle, term));
      
      // Get the best match score for each field
      const bestTextScore = Math.max(...textScores);
      const bestSubtitleScore = Math.max(...subtitleScores);

      const weights = {
        text: 0.7,       // Primary text carries 70% of the weight
        subtitle: 0.3    // Subtitle carries 30% of the weight
      };

      // Noramlized return
      return (bestTextScore * weights.text) + (bestSubtitleScore * weights.subtitle);
    })()
  }));
  
  // Filter and sort based on scores, but return original objects
  const threshold = 0.5;
  const filtered = scoredOptions
    .filter(item => item.score > threshold)
    .sort((a, b) => b.score - a.score)
    .map(item => item.option);

  if (!filtered.length) return allOptions.value;
  return filtered;
});

// Add this computed property for listbox positioning
const listboxStyle = computed(() => {
  if (!isOpen.value || !comboboxNode.value || !groupNode.value) return { display: 'none' }
  const rect = groupNode.value.getBoundingClientRect()

  return {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left + window.scrollX + 5}px`,
    width: `${rect.width - 8}px`,
    display: 'block'
  }
})

const onComboboxInput = (event) => {
  filter.value = event.target.value
  if (filter.value.length > 0) {
    open()
  } else {
    close()
  }
}

const onComboboxKeyDown = (event) => {
  let flag = false
  const altKey = event.altKey

  if (event.ctrlKey || event.shiftKey) {
    return
  }

  switch (event.key) {
    case 'Enter':
      if (listboxHasVisualFocus.value) {
        setValue(selectedOption.value.text)
      }
      close(true)
      setVisualFocusCombobox()
      flag = true
      emit('selected', selectedOption.value)
      break
    case 'ArrowDown':
      if (filteredOptions.value.length > 0) {
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
      if (filteredOptions.value.length > 0) {
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
      if (isPrintableCharacter(char)) {
        setVisualFocusCombobox()
        const option = filteredOptions.value[0]

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
}

const onComboboxBlur = () => {
  removeVisualFocusAll()
}

const onComboboxClick = () => {
  if (isOpen.value) {
    close(true)
  } else {
    open()
  }
}

const onButtonClick = () => {
  if (isOpen.value) {
    close(true)
  } else {
    open()
  }
  comboboxNode.value.focus()
  setVisualFocusCombobox()
}

const onListboxMouseover = () => {
  hasHover.value = true
}

const onListboxMouseout = () => {
  hasHover.value = false
  setTimeout(close, 1)
}

const onOptionClick = (option) => {
  setValue(option.text)
  emit('selected', option)
  close(true)
}

const onOptionMouseover = (option) => {
  hasHover.value = true
  open()
  setOption(option)
}

const onOptionMouseout = () => {
  hasHover.value = false
  setTimeout(close, 1)
}

const open = () => {
  isOpen.value = true
  comboboxNode.value.setAttribute('aria-expanded', 'true')
  buttonNode.value.setAttribute('aria-expanded', 'true')
  // Remove this line:
  // comboboxNode.value.parentNode.classList.add('focus')
}

const close = (force = false) => {
  if (force || (!comboboxHasVisualFocus.value && !listboxHasVisualFocus.value && !hasHover.value)) {
    isOpen.value = false
    comboboxNode.value.setAttribute('aria-expanded', 'false')
    buttonNode.value.setAttribute('aria-expanded', 'false')
    setActiveDescendant(null)
    // Remove this line:
    // comboboxNode.value.parentNode.classList.add('focus')
  }
}

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
  comboboxNode.value.parentNode.classList.remove('focus')
  comboboxHasVisualFocus.value = false
  listboxHasVisualFocus.value = false
  listboxNode.value.classList.remove('focus')
  selectedOption.value = null
  setActiveDescendant(null)
}

const setActiveDescendant = (option) => {
  if (option && listboxHasVisualFocus.value) {
    activeDescendant.value = option.id
    if (!isOptionInView(option)) {
      const optionNode = document.getElementById(option.id)
      optionNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  } else {
    activeDescendant.value = ''
  }
}

const getNextOption = (currentOption) => {
  if (currentOption !== lastOption.value) {
    const index = filteredOptions.value.indexOf(currentOption)
    return filteredOptions.value[index + 1]
  }
  return firstOption.value
}

const getPreviousOption = (currentOption) => {
  if (currentOption !== firstOption.value) {
    const index = filteredOptions.value.indexOf(currentOption)
    return filteredOptions.value[index - 1]
  }
  return lastOption.value
}

const isOptionInView = (option) => {
  const optionNode = document.getElementById(option.id)
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

const onBackgroundMouseDown = (event) => {
  if (!comboboxNode.value.contains(event.target) &&
      !listboxNode.value.contains(event.target) &&
      !buttonNode.value.contains(event.target)) {
    comboboxHasVisualFocus.value = false
    removeVisualFocusAll()
    setTimeout(() => close(true), 1)
  }
}

const onWindowResize = () => {
  if (isOpen.value) {
    // Force update of listbox position
    isOpen.value = false
    nextTick(() => {
      isOpen.value = true
    })
  }
}

const onScroll = () => {
  if (isOpen.value) {
    // Force update of listbox position
    isOpen.value = false
    nextTick(() => {
      isOpen.value = true
    })
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onBackgroundMouseDown, true)
  window.addEventListener('resize', onWindowResize)

  // Add this event listener for scroll events
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onBackgroundMouseDown, true)
  window.removeEventListener('resize', onWindowResize)

  // Remove this event listener for scroll events
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped lang="scss">

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

.combobox .input-wrapper {
  outline: 1px solid transparent;
  border: 1px solid gray;
  transition: border-color 0.1s, outline-color 0.1s;
  cursor: text;
}

.combobox .group.focus polygon,
.combobox .group:hover polygon {
  fill-opacity: 1;
}

.combobox .group.focus input,
.combobox .group.focus button,
.combobox .group input:hover,
.combobox .group button:hover {
  /* background-color: #def; */
}

[role="listbox"].focus [role="option"][aria-selected="true"],
[role="listbox"] [role="option"]:hover {
  background-color: theme-color('primary-yellow', 0.05);
  padding-top: 0;
  padding-bottom: 0;
  /* border-top: 2px solid currentcolor; */
  /* border-bottom: 2px solid currentcolor; */
  outline: 1px solid theme-color('primary-yellow');

}


.input-wrapper {
  background-color: white;
  border: 1px solid gray;
  border-radius: 3px;
  height: 60px;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 1rem;
}

.combobox .input-wrapper {
  transition: border-color 0.15s ease, outline-color 0.15s ease;
  outline: 2px solid transparent;
}

.combobox .input-wrapper:focus-within,
.combobox .input-wrapper.active {
  border-color: theme-color('primary-yellow'); /* Darker yellow border for contrast */
  outline-color: theme-color('primary-yellow');
}

/* Add this class to the input-wrapper when options are being viewed */
.combobox .input-wrapper.options-visible {
  border-color: theme-color('primary-yellow');
  outline-color: theme-color('primary-yellow');
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
  color: theme-color('primary-yellow'); /* Match the border color */
}

#cb1-listbox {
  position: fixed;
  z-index: 1000000;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  max-height: 450px;
  overflow-y: auto;
}
</style>