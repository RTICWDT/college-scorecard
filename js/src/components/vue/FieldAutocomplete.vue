<template>
  <div>
    <v-autocomplete
      v-model="cip4"
      :items="items"
      :loading="isLoading"
      item-text="field"
      item-value="cip4"
      placeholder="Start typing to search"
      return-object
      autocomplete="off"
      :value="value"
      v-on:change="$emit('input', cip4.cip4.replace('\.',''))"
    />
  </div>
</template>

<script>
export default {
  props: ["value"],
  data: () => ({
    isLoading: false,
    cip4: ''
  }),
  computed: {
    items() {
      return picc.CIP4;
    }
  }
};
</script>
