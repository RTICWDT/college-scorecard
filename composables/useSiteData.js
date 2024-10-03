import { ref, computed } from 'vue'
import cip_2_digit from "~/assets/data/cip_2_digit.json"
import cip_4_digit from "~/assets/data/cip_4_digit.json"
import glossary from "~/assets/data/glossary.json"
import race_ethnicity from "~/assets/data/race_ethnicity.json"
import religious_affiliations from "~/assets/data/religious_affiliations.json"
import special_designations from "~/assets/data/special_designations.json"
import states from "~/assets/data/states.json"
import cip_6_digit from "~/assets/data/cip_6_test.json"
import repayment_rates from "~/assets/data/repayment_rates.json"

export function useSiteData() {
  const site = ref({
    data: {
      cip_2_digit,
      cip_4_digit,
      cip_6_digit,
      glossary,
      race_ethnicity,
      religious_affiliations,
      special_designations,
      states,
      repayment_rates,
    }
  })

  const RELIGIOUS_AFFILIATIONS_BY_NUMBER = computed(() => 
    site.value.data.religious_affiliations.reduce((object, value) => {
      object[value.value] = value.label
      return object
    }, {})
  )

  const CIP2 = computed(() => 
    site.value.data.cip_2_digit.reduce((object, value) => {
      object[value.label] = value.value
      return object
    }, {})
  )

  const CIP4 = computed(() => 
    site.value.data.cip_4_digit.map(value => ({
      cip4: value.label, 
      field: value.value.replace('.', '')
    }))
  )

  function locateCip4Field(cip4Code) {
    let formattedCip4Code = cip4Code.toString()

    let cip4Object = CIP4.value.find((cip4Object) => 
      cip4Object.cip4.replace(/\./g, '') === formattedCip4Code.replace(/\./g, '')
    )

    return cip4Object && cip4Object.field ? cip4Object.field : null
  }

  function findAllCip6fromCip4(cip4Code) {
    return site.value.data.cip_6_digit.filter((cip6) => 
      Number(cip6.code.slice(0, 4)) === Number(cip4Code)
    )
  }

  return {
    site,
    RELIGIOUS_AFFILIATIONS_BY_NUMBER,
    CIP2,
    CIP4,
    locateCip4Field,
    findAllCip6fromCip4
  }
}