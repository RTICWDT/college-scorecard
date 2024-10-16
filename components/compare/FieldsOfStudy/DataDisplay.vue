<template>
  <div class="my-5">
    <div v-if="fieldsOfStudy.undergrad.length > 0">
      <h4 class="text-overline">Undergraduate Certificate or Diploma</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.undergrad" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.associates.length > 0">
      <h4 class="text-overline">Associate's Degree</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.associates" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.bachelors.length > 0">
      <h4 class="text-overline">Bachelor's Degree</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.bachelors" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.baccalaureate.length > 0">
      <h4 class="text-overline">Post-baccalaureate Degree</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.baccalaureate" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.masters.length > 0">
      <h4 class="text-overline">Master's Degree</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.masters" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.doctorate.length > 0">
      <h4 class="text-overline">Doctoral Degree</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.doctorate" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.professionalDegree.length > 0">
      <h4 class="text-overline">First Professional Degree</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.professionalDegree" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>

    <div v-if="fieldsOfStudy.professionalCertificate.length > 0">
      <h4 class="text-overline">Graduate/Professional Certificate</h4>
      <div class="py-3">
        <div v-for="fos in fieldsOfStudy.professionalCertificate" class="pl-5 py-3 ml-2 result-card">
          <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">{{ fos.title }} - {{ fos.school.name }}</NuxtLink>
          <Spacer :height="10" />
          <slot name="data" :fos="fos"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  fieldsOfStudy: Object,
});

// const { schoolLink } = useComplexFieldMethods()

const schoolLink = (fos) => {
  // debugger
  return "/"
}

console.log(props.fieldsOfStudy)
</script>

<style lang="scss" scoped>
// Add any additional styles here
.result-card {
  border-left: 1px solid #666;
}


</style>