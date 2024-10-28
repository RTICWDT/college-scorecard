<template>
  <Combobox :dense="dense" color="#FDB022" :options="options" v-model="selectedItem" :onFilter="onFilter" />
</template>

<script setup>
const props = defineProps({
  dense: {
    type: Boolean,
    default: false,
  }
})

const { site } = useSiteData()
const selectedItem = ref()
const options = ref(site.value.data.cip_6_digit.map((item) => {
  return { id: item.code, text: item.title, subtitle: item.cip4Title }
}))

const onFilter = (input, options) => {
  if (!input) return options;

  const cleanedFilter = cleanString(input).toLowerCase();
  if (!cleanedFilter) return options;

  // Calculate scores in a separate array
  const scoredOptions = options.map(option => ({
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

  if (!filtered.length) return options;
  return filtered;
}


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
</script>