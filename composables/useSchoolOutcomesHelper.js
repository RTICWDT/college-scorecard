export const useSchoolOutcomesHelper = () => {
  const showPellOnly = ref(false)
  const options = ref({
    study: 'study_both',
    enroll: 'enroll_both',
  })

  return {
    showPellOnly,
    options,
  }
}