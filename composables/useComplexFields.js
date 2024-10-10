// composables/useSchool.js
import _ from "lodash";

export function useComplexFields(schoolProp) {
  const { $url } = useNuxtApp();
  const { site, RELIGIOUS_AFFILIATIONS_BY_NUMBER } = useSiteData();
  const { fields, formMappings } = useConstants();
  const school = ref(schoolProp);

  // 
  // Computed Properties
  // 

  const id = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['ID'])
  })

  const schoolName = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['NAME'], 'N/A')
  })

  const city = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['CITY'], 'N/A')
  })

  const state = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['STATE'], 'N/A')
  })

  const zip = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['ZIP_CODE'], 'N/A')
  })

  const schoolUrlDisplay = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['SCHOOL_URL'], 'ed.gov')
  })

  const underInvestigation = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['UNDER_INVESTIGATION'])
  })

  const years = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields["PREDOMINANT_DEGREE"])
  })

  const awardLevels = computed(() => {
    if (!school.value) return null
    switch (years.value) {
      case 1:
        return useGet(school.value, fields.DEGREE_OFFERED + ".assoc_or_bachelors") ? "certificate" : false
      case 2:
        return useGet(school.value, fields.DEGREE_OFFERED + ".certificate") || 
              useGet(school.value, fields.DEGREE_OFFERED + ".bachelors") ? "2-year" : false
      case 3:
        return useGet(school.value, fields.DEGREE_OFFERED + ".certificate") || 
              useGet(school.value, fields.DEGREE_OFFERED + ".assoc") ? "4-year" : false
    }
    return false
  })

  const netPrice = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['NET_PRICE'])
  })

  const parentPlusDebt = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['PARENT_PLUS_TOTAL_DEBT'])
  })

  const parentPlusDebtAll = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['PARENT_PLUS_TOTAL_DEBT_ALL'])
  })

  const parentPlusPayment = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['PARENT_PLUS_LOAN_PAYMENT'])
  })

  const parentPlusPaymentAll = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['PARENT_PLUS_LOAN_PAYMENT_ALL'])
  })

  const monthlyLoanPayment = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['MONTHLY_LOAN_PAYMENT'])
  })

  const monthlyLoanPaymentAll = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['MONTHLY_LOAN_PAYMENT'])
  })

  const undergraduates = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['SIZE'])
  })

  const publicPrivate = computed(() => {
    if (!school.value) return null
    var ownership = useGet(school.value, fields["OWNERSHIP"])
    switch (+ownership) {
      case 1: return "public"
      case 2:
      case 3: return "private"
    }
    return null
  })

  const income = computed(() => {
    if (!school.value) return null
    let income = useGet(school.value, fields["NET_PRICE_BY_INCOME"])
    return income[publicPrivate.value]["by_income_level"]
  })

  const specialDesignations = computed(() => {
    if (!school.value) return null
    const designations = []
    const SPECIAL_DESIGNATIONS = site.value.data.special_designations || {}
  
    if (+useGet(school.value, fields.WOMEN_ONLY)) {
      designations.push(SPECIAL_DESIGNATIONS.women_only)
    } else if (+useGet(school.value, fields.MEN_ONLY)) {
      designations.push(SPECIAL_DESIGNATIONS.men_only)
    }
  
    const religious = useGet(school.value, fields.RELIGIOUS)
    if (religious in RELIGIOUS_AFFILIATIONS_BY_NUMBER.value) {
      designations.push(RELIGIOUS_AFFILIATIONS_BY_NUMBER.value[religious])
    }
  
    const minorityServing = useGet(school.value, fields.MINORITY_SERVING)
    if (minorityServing) {
      for (const key in SPECIAL_DESIGNATIONS) {
        if (+minorityServing[key]) {
          designations.push(SPECIAL_DESIGNATIONS[key])
        }
      }
    }

    return designations
  })
  
  const raceEthnicity = computed(() => {
    if (!school.value) return null
    const output = []
    const re = useGet(school.value, fields["RACE_ETHNICITY"])
    const re_staff = useGet(school.value, fields["RACE_ETHNICITY_STAFF"])
    const include = [
      "aian", "asian", "black", "hispanic", "nhpi",
      "non_resident_alien", "two_or_more", "unknown", "white"
    ]
    for (const item of include) {
      output.push({
        label: site.value.data.race_ethnicity[item],
        value: re[item],
        staff_value: re_staff[item]
      })
    }
    return useSortBy(output, ["label"])
  })
  
  const retentionRate = computed(() => {
    if (!school.value) return null
    let retention = useGet(school.value, fields.RETENTION_RATE)
    if (retention) {
      const fourYear = retention.four_year.full_time_pooled
      return fourYear || fourYear === 0 ? fourYear : retention.lt_four_year.full_time_pooled
    }
    retention = useGet(school.value, fields.RETENTION_RATE + ".four_year.full_time_pooled")
    return retention || retention === 0 ? retention :
      useGet(school.value, fields.RETENTION_RATE + ".lt_four_year.full_time_pooled")
  })
  
  const completionRate = computed(() => {
    if (!school.value) return null
    const OM = useGet(school.value, fields.COMPLETION_OM)
    const G150_4 = useGet(school.value, fields.COMPLETION_150_4)
    const G150_LT4 = useGet(school.value, fields.COMPLETION_150_LT4)
    if (!OM && !G150_4 && !G150_LT4) return false
    if (OM) return OM
    return years.value == 3 ? G150_4 : G150_LT4
  })
  
  const completionRatePell = computed(() => {
    if (!school.value) return null
    const OM = useGet(school.value, fields.COMPLETION_OM_PELL)
    const G150_4 = useGet(school.value, fields.COMPLETION_150_4_PELL)
    const G150_LT4 = useGet(school.value, fields.COMPLETION_150_LT4_PELL)
    if (!OM && !G150_4 && !G150_LT4) return false
    if (OM) return OM
    return years.value == 3 ? G150_4 : G150_LT4
  })
  
  const completionRateFieldDefinition = computed(() => {
    if (!school.value) return null
    const OM = useGet(school.value, fields.COMPLETION_OM)
    return OM ? 'default' : 'gr150'
  })
  
  const completionRateOverall = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields.COMPLETION_RATE)
  })
  
  const programReporter = computed(() => {
    if (!school.value) return null
    const reporterData = []
    const programs = useGet(school.value, fields.PROGRAM_REPORTER_PROGRAM)
    const cost = useGet(school.value, fields.PROGRAM_REPORTER_COST)
    for (let q = 1; q <= 6; q++) {
      if (programs[`program_${q}`].cip_6_digit.code) {
        reporterData.push({
          ...programs[`program_${q}`].cip_6_digit,
          ...cost[`program_${q}`].cip_6_digit
        })
      }
    }
    return reporterData
  })
  
  const isProgramReporter = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields.PROGRAM_REPORTER_OFFERED) > 0
  })
  
  const isBranch = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields["MAIN"]) === 0
  })
  
  const schoolUrl = computed(() => {
    if (!school.value) return null
    const url = useGet(school.value, fields['SCHOOL_URL'], '#')
    if (url === '#') return false
    return url.match(/^http/) ? url : 'http://' + url
  })
  
  const fullTimeEnrollment = computed(() => {
    if (!school.value) return null
    const fte = useGet(school.value, fields['PART_TIME_SHARE'])
    if (fte == null) return null
    return (1 - fte).toFixed(2)
  })
  
  const partTimeEnrollment = computed(() => {
    if (!school.value) return null
    const pte = useGet(school.value, fields['PART_TIME_SHARE'])
    if (pte == null) return null
    return pte.toFixed(2)
  })
  
  const socioEconomicDiversity = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['PELL_PERCENTAGE'])
  })
  
  const studentRatio = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['STUDENT_RATIO'])
  })
  
  const netPriceCalculatorUrl = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['NET_PRICE_CALC_URL'], '#')
  })

    // Part 1: allFieldsOfStudy and debtRange
  const allFieldsOfStudy = computed(() => {
    if (!school.value) return null
    let fos = useGet(school.value, fields['FIELD_OF_STUDY'])
    if (!fos) return null

    if (!fos.length) {
      fos = [fos]
    }
    for (let i = 0; i < fos.length; i++) {
      if (useGet(fos[i], 'credential.level') === 3) {
        useSet(fos[i], 'credential.title', "Bachelor's Degree")
      }
    }
    return fos
  })

  const debtRange = computed(() => {
    if (!allFieldsOfStudy.value) return null
    return generateDebtRange(allFieldsOfStudy.value, aidShowMedianDebtWithPrior.value, aidLoanSelect.value)
  })

  // Part 2: earningsRange, act, satReading, and satMath
  const earningsRange = computed(() => {
    if (!allFieldsOfStudy.value) return null
    let fos = allFieldsOfStudy.value
    if (!fos.length) {
      fos = [fos]
    }
    let cleanEarnings = fos.filter(
      obj => useGet(obj, 'earnings.highest.2_yr.overall_median_earnings') && useGet(obj, 'credential.level') <= 3
    )
    let orderedEarnings = cleanEarnings.sort(
      (a, b) => useGet(a, 'earnings.highest.2_yr.overall_median_earnings') - useGet(b, 'earnings.highest.2_yr.overall_median_earnings')
    ).filter(x => x.earnings.highest["2_yr"].overall_median_earnings)
    if (orderedEarnings[0] == null) {
      return null
    } else {
      return {
        single: orderedEarnings.length == 1 || (orderedEarnings[0].earnings.highest['2_yr'].overall_median_earnings == orderedEarnings[orderedEarnings.length - 1].earnings.highest['2_yr'].overall_median_earnings),
        min: orderedEarnings[0],
        max: orderedEarnings[orderedEarnings.length - 1]
      }
    }
  })

  const act = computed(() => {
    if (!school.value) return null
    return {
      available: useGet(school.value, fields['ACT_MIDPOINT']) != null,
      lower: useGet(school.value, fields['ACT_25TH_PCTILE']),
      upper: useGet(school.value, fields['ACT_75TH_PCTILE']),
      min: 0,
      max: 36
    }
  })

  const satReading = computed(() => {
    if (!school.value) return null
    return {
      available: useGet(school.value, fields['SAT_READING_MIDPOINT']) != null,
      lower: useGet(school.value, fields['SAT_READING_25TH_PCTILE']),
      upper: useGet(school.value, fields['SAT_READING_75TH_PCTILE']),
      min: 0,
      max: 800
    }
  })

  const satMath = computed(() => {
    if (!school.value) return null
    return {
      available: useGet(school.value, fields['SAT_MATH_MIDPOINT']) != null,
      lower: useGet(school.value, fields['SAT_MATH_25TH_PCTILE']),
      upper: useGet(school.value, fields['SAT_MATH_75TH_PCTILE']),
      min: 0,
      max: 800
    }
  })

  // Part 3: acceptance rates, admissions, and aid
  const acceptanceRate = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['ACCEPTANCE_RATE_CONSUMER'])
  })

  const acceptanceRateActual = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['ACCEPTANCE_RATE'])
  })

  const openAdmissions = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['OPEN_ADMISSIONS'])
  })

  const studentsReceivingLoans = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['AID_PERCENTAGE'])
  })

  const aidFlag = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['AID_ELIGIBILITY'])
  })

  // Part 4: links and estimated parent borrowed text
  const fieldsLink = computed(() => {
    if (!school.value) return null
    let id = useGet(school.value, fields["ID"])
    let name = useGet(school.value, fields["NAME"], "(unknown)")
    return "/school/fields/?" + id + "-" + name.replace(/\W+/g, "-")
  })

  const schoolLink = computed(() => {
    if (!school.value) return null
    let id = useGet(school.value, fields['ID'])
    let name = useGet(school.value, fields['NAME'], '(unknown)')
    return '/school/?' + id + '-' + name.replace(/\W+/g, '-')
  })

  const estimatedParentBorrowedText = computed(() => {
    if (!school.value ||
      useGet(school.value, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']) === 'undefined' ||
      useGet(school.value, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX']) === 'undefined' ||
      useGet(school.value, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']) === null ||
      useGet(school.value, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX']) === null
    ) {
      return null
    }

    return formatParentPlusText(
      useGet(school.value, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']),
      useGet(school.value, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX'])
    )
  })

  // Part 5: dolflag, repaymentRates, and earnings
  const dolflag = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['DOLFLAG'])
  })

  const repaymentRates = computed(() => {
    if (!school.value) return null
    let output = { ug: [], ugcomp: [] }
    let types = ['ug', 'ugcomp']
    let rr = site.value.data.repayment_rates
    let rates = useGet(school.value, fields['REPAYMENT_RATES'])
    let include = [
      "default", "deferment", "discharge", "fullypaid",
      "delinquent", "noprogress", "forbearance", "makingprogress"
    ]
    types.forEach((item, index) => {
      for (let p = 0; p < include.length; p++) {
        output[types[index]].push({
          label: rr[include[p]],
          value: rates[item][include[p]]
        })
      }
    })
    let ret = {}
    ret['ug'] = orderByWithNullsAtEnd(output['ug'], "value", true)
    ret['ugcomp'] = orderByWithNullsAtEnd(output['ugcomp'], "value", true)
    return ret
  })

  const medianEarnings = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['MEDIAN_EARNINGS'])
  })

  const federalDebt = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['AVERAGE_TOTAL_DEBT'])
  })

  // Part 6: toggle functions and fake data
  const toggleMedianEarnings = computed(() => {
    if (!school.value) return null
    return {
      0: useGet(school.value, fields['EARNINGS_MIDPOINT_PRED_DEGREE']),
      1: useGet(school.value, fields['EARNINGS_MIDPOINT_ALL'])
    }
  })

  const toggleAverageAnnualCosts = computed(() => {
    if (!school.value) return null
    return {
      0: useGet(school.value, fields['AVG_COST_MIDPOINT_PRED_DEGREE']),
      1: useGet(school.value, fields['AVG_COST_MIDPOINT_ALL'])
    }
  })

  const toggleGraduationRate = computed(() => {
    if (!school.value) return null
    return {
      0: useGet(school.value, fields['COMPLETION_MIDPOINT_PRED_DEGREE']),
      1: useGet(school.value, fields['COMPLETION_MIDPOINT_ALL'])
    }
  })

  const toggleGroupMedianEarnings = computed(() => {
    if (!schools.value) return null
    return {
      0: useGet(schools.value[0], fields['EARNINGS_MIDPOINT_PRED_DEGREE']),
      1: useGet(schools.value[0], fields['EARNINGS_MIDPOINT_ALL'])
    }
  })

  const toggleGroupAverageAnnualCosts = computed(() => {
    if (!schools.value) return null
    return {
      0: useGet(schools.value[0], fields['AVG_COST_MIDPOINT_PRED_DEGREE']),
      1: useGet(schools.value[0], fields['AVG_COST_MIDPOINT_ALL'])
    }
  })

  const toggleGroupGraduationRate = computed(() => {
    if (!schools.value) return null
    return {
      0: useGet(schools.value[0], fields['COMPLETION_MIDPOINT_PRED_DEGREE']),
      1: useGet(schools.value[0], fields['COMPLETION_MIDPOINT_ALL'])
    }
  })

  const fakeMedianEarnings = computed(() => ({
    1: { 0: 28589, 1: 38461 },
    2: { 0: 37840, 1: 38461 },
    3: { 0: 50482, 1: 38461 },
  }))

  const fakeAverageAnnualCosts = computed(() => ({
    1: { 0: 16163, 1: 16007 },
    2: { 0: 8432, 1: 16007 },
    3: { 0: 18902, 1: 16007 },
  }))

  const fakeGraduationRate = computed(() => ({
    1: { 0: 0.6804, 1: 0.5938 },
    2: { 0: 0.3158, 1: 0.5938 },
    3: { 0: 0.5789, 1: 0.5938 },
  }))

  // Part 7: standardizedTestText, standardizedTestValue, percentMoreThanHS, and schoolDegreeList
  const standardizedTestText = computed(() => {
    if (!school.value) return null

    let categoryText = ""
    let rangeText = ""
    let acceptanceText = "  "

    if (acceptanceRateActual.value == 1 && openAdmissions.value != 1) {
      acceptanceText = `${schoolName.value} has an acceptance rate of 100%, which means that all students who apply are accepted. `
    } else if (openAdmissions.value != 1 && acceptanceRateActual.value) {
      acceptanceText = `${schoolName.value} has an acceptance rate of ${Math.round(acceptanceRateActual.value * 100)}%. `
    } else if (openAdmissions.value == 1) {
      acceptanceText = `${schoolName.value} has an open admission policy, which means that all students who apply are accepted. `
    }

    switch (standardizedTestValue.value) {
      case 1:
        categoryText = `${schoolName.value} requires admission test scores (SAT/ACT) during the application process. `
        rangeText = `Students who were admitted to ${schoolName.value} and enrolled typically had admission test scores in these ranges.`
        break
      case 5:
        categoryText = `${schoolName.value} considers admission test scores (SAT/ACT) during the application process, but does not require them. `
        rangeText = `Students who were admitted to ${schoolName.value} and enrolled typically had admission test scores in these ranges.`
        break
      case 2:
        categoryText = `${schoolName.value} recommends students provide admission test scores (SAT/ACT), during the application process. `
        break
      case 3:
        categoryText = `${schoolName.value} does not require admission test scores (SAT/ACT) during the application process and does not recommend that students provide them. `
        break
      case 4:
      case null:
        categoryText = `The admission test score (SAT/ACT) policy for ${schoolName.value} is unknown. `
        break
    }
    return acceptanceText + categoryText + rangeText
  })

  const standardizedTestValue = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['TEST_REQUIREMENTS'])
  })

  const percentMoreThanHS = computed(() => {
    if (!school.value) return null
    return useGet(school.value, fields['EARNINGS_GT_HS'])
  })

  const schoolDegreeList = computed(() => {
    if (!school.value) return null
    let programs = useGet(school.value, fields.FIELD_OF_STUDY)
    if (!programs) return "no Degrees or Certificates"
  
    let programLevels = programs.map(p => p.credential.level).filter((x, i, a) => a.indexOf(x) == i)
  
    let degreeLevels = programLevels.filter(x => [2,3,5,6,7].includes(x))
    let certLevels = programLevels.filter(x => [4,8].includes(x))
    let ugCertLevels = programLevels.filter(x => [1].includes(x))
  
    let degreesList = ""
    let certList = ""
    let ugCertList = ""
  
    for (let level of degreeLevels) {
      let label = formMappings.value['fosDegrees'].find(e => e.value === level.toString())['label'].replace(" Degree", "")
      if (level == degreeLevels[degreeLevels.length - 1]) {
        degreesList += degreeLevels.length > 1 ? ` and ${label} Degrees` : `${label} Degrees`
      } else if (level == degreeLevels[degreeLevels.length - 2]) {
        degreesList += label
      } else {
        degreesList += `${label}, `
      }
    }
  
    for (let level of certLevels) {
      let label = formMappings.value['fosDegrees'].find(e => e.value === level.toString())['label'].replace(" Certificate", "")
      if (level == certLevels[certLevels.length - 1]) {
        certList += certLevels.length > 1 ? ` and ${label} Certificates` : `${label} Certificates`
      } else if (level == certLevels[certLevels.length - 2]) {
        certList += label
      } else {
        certList += `${label}, `
      }
    }
  
    for (let level of ugCertLevels) {
      let label = formMappings.value['fosDegrees'].find(e => e.value === level.toString())['label']
      ugCertList = label
    }
  
    let ret = degreesList + 
              ((degreesList && certList) ? ` as well as ${certList}` : certList) + 
              (((certList || degreesList) && ugCertList) ? `, and ${ugCertList}` : ugCertList)
  
    return ret || "no Degrees or Certificates"
  })

  // 
  // Methods
  // 

  const orderByWithNullsAtEnd = (pArray, pAttr, pReverse) => {
    const partition = usePartition(pArray, (x) => !!useGet(x, pAttr, null));
    return useConcat(
      useOrderBy(partition[0], pAttr, pReverse ? "desc" : "asc"),
      partition[1]
    );
  };

  const formatParentPlusText = (min, max) => `${min}-${max}%`;

  const cleanDebt = (fos, aidShowMedianDebtWithPrior, aidLoanSelect) => {
    let cleanDebt = fos.reduce((result, fieldOfStudy) => {
      if (fieldOfStudy.credential.level <= 3) {
        let tempObject = {
          debt: null,
          title: fieldOfStudy.title,
          credential: {
            title: fieldOfStudy.credential.title,
          },
        };

        if (aidShowMedianDebtWithPrior) {
          if (aidLoanSelect === "fed") {
            tempObject.debt = useGet(
              fieldOfStudy,
              fields["FOS_DEBT_MEDIAN_PRIOR"]
            );
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_DEBT_MONTHLY_PRIOR"]
            );
          } else {
            tempObject.debt = useGet(
              fieldOfStudy,
              fields["FOS_PP_DEBT_MEDIAN_PRIOR"]
            );
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_PP_DEBT_MONTHLY_PRIOR"]
            );
          }
        } else {
          if (aidLoanSelect === "fed") {
            tempObject.debt = useGet(fieldOfStudy, fields["FOS_DEBT_MEDIAN"]);
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_DEBT_MONTHLY"]
            );
          } else {
            tempObject.debt = useGet(fieldOfStudy, fields["FOS_PP_DEBT_MEDIAN"]);
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_PP_DEBT_MONTHLY"]
            );
          }
        }

        result.push(tempObject);
      }

      return result;
    }, []);

    return cleanDebt;
  };

  const generateDebtRange = (
    fieldsOfStudy,
    aidShowMedianDebtWithPrior,
    aidLoanSelect
  ) => {
    // let fos = this.allFieldsOfStudy;
    if (!fieldsOfStudy.length) {
      fieldsOfStudy = [fieldsOfStudy];
    }
    let cleanDebt = fieldsOfStudy.reduce((result, fieldOfStudy) => {
      if (fieldOfStudy.credential.level <= 3) {
        let tempObject = {
          debt: null,
          title: fieldOfStudy.title,
          credential: {
            title: fieldOfStudy.credential.title,
          },
        };

        if (aidShowMedianDebtWithPrior) {
          if (aidLoanSelect === "fed") {
            tempObject.debt = useGet(
              fieldOfStudy,
              fields["FOS_DEBT_MEDIAN_PRIOR"]
            );
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_DEBT_MONTHLY_PRIOR"]
            );
          } else {
            tempObject.debt = useGet(
              fieldOfStudy,
              fields["FOS_PP_DEBT_MEDIAN_PRIOR"]
            );
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_PP_DEBT_MONTHLY_PRIOR"]
            );
          }
        } else {
          if (aidLoanSelect === "fed") {
            tempObject.debt = useGet(fieldOfStudy, fields["FOS_DEBT_MEDIAN"]);
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_DEBT_MONTHLY"]
            );
          } else {
            tempObject.debt = useGet(fieldOfStudy, fields["FOS_PP_DEBT_MEDIAN"]);
            tempObject.payment = useGet(
              fieldOfStudy,
              fields["FOS_PP_DEBT_MONTHLY"]
            );
          }
        }

        result.push(tempObject);
      }

      return result;
    }, []);

    let orderedDebt = cleanDebt
      .sort((a, b) => a.debt - b.debt)
      .filter((x) => x.debt);

    if (orderedDebt[0] == null) {
      return null;
    } else {
      return {
        single:
          orderedDebt.length == 1 ||
          orderedDebt[0].debt == orderedDebt[orderedDebt.length - 1].debt,
        min: orderedDebt[0],
        max: orderedDebt[orderedDebt.length - 1],
        median: orderedDebt[Math.floor(orderedDebt.length / 2)],
      };
    }
  };

  const categorizeFieldsOfStudy = (fieldsOfStudy) => {
    // Set up return object
    let filteredArray = [
      {
        key: "certificate",
        title: "certificate",
        filterValue: 1,
        items: [],
      },
      {
        key: "associate",
        title: "associate's Degree",
        filterValue: 2,
        items: [],
      },
      {
        key: "bachelor",
        title: "bachelor's Degree",
        filterValue: 3,
        items: [],
      },
      {
        key: "postbaccalaureate",
        title: "post-baccalaureate Certificate",
        filterValue: 4,
        items: [],
      },
      {
        key: "master",
        title: "master's Degree",
        filterValue: 5,
        items: [],
      },
      {
        key: "doctor",
        title: "doctoral Degree",
        filterValue: 6,
        items: [],
      },
      {
        key: "firstprofessional",
        title: "first Professional Degree",
        filterValue: 7,
        items: [],
      },
      {
        key: "graduatecertificate",
        title: "graduate/Professional Certificate",
        filterValue: 8,
        items: [],
      },
    ];

    // Categorize field of study by credential type;
    filteredArray = filteredArray.map((filterItem) => {
      filterItem.items = fieldsOfStudy.filter((fieldOfStudy) => {
        return (
          useGet(fieldOfStudy, fields.FOS_CREDENTIAL_LEVEL) ===
          filterItem.filterValue
        );
      });

      return filterItem;
    });

    // Return only items that have counts
    return filteredArray.filter((filterItem) => {
      return filterItem.items.length > 0;
    });
  };

  const fieldOfStudyCompareFormat = (fieldOfStudyReturnObject) => {
    // Fixing small formatting issue with cred level 3 title formatting.  May be fixed in the data at some point;
    return {
      institutionName: useGet(fieldOfStudyReturnObject,'school.name'),
      credentialTitle: (Number(useGet(fieldOfStudyReturnObject,'credential.level')) === 3) ? "Bachelor's Degree" : useGet(fieldOfStudyReturnObject,'credential.title'),
      fosTitle: useGet(fieldOfStudyReturnObject,'title'),
      id: useGet(fieldOfStudyReturnObject,'unit_id'),
      code: useGet(fieldOfStudyReturnObject,'code'),
      credentialLevel: useGet(fieldOfStudyReturnObject,'credential.level'),
    };
  };
  

  // return the computed properties
  return {
    id,
    schoolName,
    city,
    state,
    zip,
    schoolUrlDisplay,
    underInvestigation,
    years,
    awardLevels,
    netPrice,
    parentPlusDebt,
    parentPlusDebtAll,
    parentPlusPayment,
    parentPlusPaymentAll,
    monthlyLoanPayment,
    monthlyLoanPaymentAll,
    undergraduates,
    publicPrivate,
    income,
    specialDesignations,
    raceEthnicity,
    retentionRate,
    completionRate,
    completionRatePell,
    completionRateFieldDefinition,
    completionRateOverall,
    programReporter,
    isProgramReporter,
    isBranch,
    schoolUrl,
    fullTimeEnrollment,
    partTimeEnrollment,
    socioEconomicDiversity,
    studentRatio,
    netPriceCalculatorUrl,
    allFieldsOfStudy,
    debtRange,
    earningsRange,
    act,
    satReading,
    satMath,
    acceptanceRate,
    acceptanceRateActual,
    openAdmissions,
    studentsReceivingLoans,
    aidFlag,
    fieldsLink,
    schoolLink,
    estimatedParentBorrowedText,
    dolflag,
    repaymentRates,
    medianEarnings,
    federalDebt,
    toggleMedianEarnings,
    toggleAverageAnnualCosts,
    toggleGraduationRate,
    toggleGroupMedianEarnings,
    toggleGroupAverageAnnualCosts,
    toggleGroupGraduationRate,
    fakeMedianEarnings,
    fakeAverageAnnualCosts,
    fakeGraduationRate,
    standardizedTestText,
    standardizedTestValue,
    percentMoreThanHS,
    schoolDegreeList,

    // Methods
    orderByWithNullsAtEnd,
    formatParentPlusText,
    cleanDebt,
    generateDebtRange,
    categorizeFieldsOfStudy,
    fieldOfStudyCompareFormat
  }
};
