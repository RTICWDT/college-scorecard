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
         />
    </div>
</template>

<script>
export default {
    data: () => ({
      isLoading: false,
      cip4: null,
    }),
    computed:{
      items(){
        return picc.CIP4;
      }
    }
  }
</script>
