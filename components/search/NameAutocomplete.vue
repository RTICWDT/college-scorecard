<template>
  <div>
    <v-combobox
      v-model="search"
      :items="items"
      :loading="isLoading"
      :search="search"
      :return-object="true"
      :no-filter="true"
      label="Enter a school"
      item-title="school.name"
      autocomplete="off"
      hide-details
      color="#007000"
      variant="outlined"
      prepend-inner-icon="fa:fas fa-search"
      hide-no-data
      @update:search="runSearch"
      aria-label="Name Search"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      id="institution-search-box"
      class="pt-0 mt-0"
    >
      <template v-slot:item="{ item, props }">
        <v-list-item v-bind="props" @click="goToSchool">
          <v-list-item-title>
            <span class="name-complete-school-name" />
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-combobox>
  </div>
</template>

<style lang="scss">
.v-application .institution-search-color--text {
  color: variables.$darker-green !important;
}
</style>

<script setup>
const { prepareParams } = usePrepareParams()
const { fields } = useConstants()
const { apiGet } = useApi()

const emit = defineEmits(['school-name-selected'])
const items = ref([]);
const isLoading = ref(false);
const search = ref(null);

const props = defineProps({
  initialSchool: {
    type: String,
    default: null,
  },
  searchEmptyName: {
    type: Boolean,
    default: true,
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

const goToSchool = () => {
  if (search.value) {
    emit('school-name-selected', search.value)
  }
}

const runSearch = useDebounce((newVal) => performSearch(newVal), 300);

const performSearch = async (newVal) => {
  if (!newVal) return;

  isLoading.value = '#77b713';
  const query = {
    fields: [fields.ID, fields.NAME, fields.ALIAS, fields.SEARCH].join(","),
    per_page: 20,
    sort: 'alias:asc', // Not perfect, helps to ensure items with alias are on first page.
    "school.search": newVal || "",
  };

  const preparedQuery = prepareParams(query);

  try {
    const response = await apiGet("/schools", preparedQuery);
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

    items.value = schools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    items.value = [];
  } finally {
    isLoading.value = false;
  }
}


</script>
