<template>
  <Combobox 
    v-model="search"
    placeholder="Enter college name (optional)"  
    :dense="dense" 
    :loading="loading"
    :options="items" 
    :onFilter="onFilter"
    @onSubmit="handleSubmit"
    @onClear="handleClear"
    @onSearch="handleSearch"
  />
</template>

<script setup>
const { prepareParams } = usePrepareParams()
const { fields } = useConstants()
const { apiGet } = useApi()

const emit = defineEmits(['onClear', 'onSubmit', 'onSearch'])
const items = ref([]);
const isLoading = ref(false);
const search = ref(null);
const loading = ref(false);

const props = defineProps({
  initialSchool: {
    type: String,
    default: null,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  const nuxtApp = useNuxtApp()
  search.value = props.initialSchool
  
  nuxtApp.hook('search-form-reset', () => {
    search.value = null
  })
})

const onFilter = async (newVal, options) => {
  runSearch(newVal)
}

const handleSubmit = () => {
  if (search.value) {
    emit('onSubmit', search.value)
  }
}

const handleClear = () => {
  search.value = null
  emit('onClear', null)
}

const handleSearch = (newVal) => {
  emit('onSearch', newVal)
}

const runSearch = useDebounce((newVal) => {
  if (newVal === '') {
    items.value = [];
    return emit('onSearch', newVal)
  }

  performSearch(newVal)
}, 300);

const performSearch = async (newVal) => {
  if (!newVal) return;

  isLoading.value = true;
  const query = {
    fields: [fields.ID, fields.NAME, fields.ALIAS, fields.SEARCH].join(","),
    per_page: 20,
    sort: 'alias:asc', // Not perfect, helps to ensure items with alias are on first page.
    "school.search": newVal || "",
  };

  const preparedQuery = prepareParams(query);

  try {
    loading.value = true;
    const response = await apiGet("/schools", preparedQuery);
    loading.value = false;
    let schools = response.results;

    if (!schools.length) {
      items.value = [];
      return;
    }

    // Promote alias match to the top, remove from result list
    const aliasMatch = schools.filter((school) => {
      if (!school["school.alias"]) return false;

      const lowerAlias = school["school.alias"].toLowerCase();
      const aliasWords = useWords(lowerAlias);
      const lowerNewVal = newVal.toLowerCase();

      return lowerNewVal === lowerAlias || aliasWords.includes(lowerNewVal);
    });

    // Remove alias matches from the original array
    schools = schools.filter(school => !aliasMatch.includes(school));

    // Add flag for alias Match and add to the front of the result array
    if (aliasMatch.length > 0) {
      const flaggedAliasMatch = aliasMatch.map(school => ({ ...school, alias: true }));
      schools.unshift(...flaggedAliasMatch);
    }

    const searchTermLower = newVal.toLowerCase();

    // sort based on school.name match
    schools.sort((a, b) => {
        // Convert school names to lowercase for comparison
        const aNameLower = a[fields.NAME].toLowerCase();
        const bNameLower = b[fields.NAME].toLowerCase();
        
        // Check for exact matches
        const aIsExactMatch = aNameLower === searchTermLower;
        const bIsExactMatch = bNameLower === searchTermLower;
        
        if (aIsExactMatch && !bIsExactMatch) {
            return -1; // a comes first
        }
        if (!aIsExactMatch && bIsExactMatch) {
            return 1;  // b comes first
        }
        
        // If neither is an exact match, maintain original order based on relevance score
        return b.relevance_score - a.relevance_score;
    });

    items.value = schools.map((school) => ({
      ...school,
      code: school[fields.ID],
      title: school[fields.NAME],
      text: school[fields.NAME],
      exact: school[fields.NAME].toLowerCase() === searchTermLower,
    }));

  } catch (error) {
    console.error("Error fetching schools:", error);
    items.value = [];
  } finally {
    isLoading.value = false;
  }
}

defineExpose({
  resetForm: () => {
    search.value = null
  },
})


</script>
