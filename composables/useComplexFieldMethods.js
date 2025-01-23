export function useComplexFieldMethods() {
  const { site, RELIGIOUS_AFFILIATIONS_BY_NUMBER } = useSiteData();
  const { fields, formMappings } = useConstants();

  const id = (school) => {
    if (!school) return null
    return useGet(school, fields['ID'])
  }

  const schoolName = (school) => {
    if (!school) return null
    return useGet(school, fields['NAME'], 'N/A')
  }

  const city = (school) => {
    if (!school) return null
    return useGet(school, fields['CITY'], 'N/A')
  }

  const state = (school) => {
    if (!school) return null
    return useGet(school, fields['STATE'], 'N/A')
  }

  const zip = (school) => {
    if (!school) return null
    return useGet(school, fields['ZIP_CODE'], 'N/A')
  }

  const schoolUrlDisplay = (school) => {
    if (!school) return null
    return useGet(school, fields['SCHOOL_URL'], 'ed.gov')
  }

  const underInvestigation = (school) => {
    if (!school) return null
    return useGet(school, fields['UNDER_INVESTIGATION'])
  }

  const years = (school) => {
    if (!school) return null
    return useGet(school, fields["PREDOMINANT_DEGREE"])
  }

  const groupName = (school) => {
    if (!school) return null
    return useGet(school, fields["PREDOMINANT_DEGREE"])
  }

  const awardLevels = (school) => {
    if (!school) return null
    const yearsValue = years(school)
    switch (yearsValue) {
      case 1:
        return useGet(school, fields.DEGREE_OFFERED + ".assoc_or_bachelors") ? "certificate" : false
      case 2:
        return useGet(school, fields.DEGREE_OFFERED + ".certificate") || 
              useGet(school, fields.DEGREE_OFFERED + ".bachelors") ? "2-year" : false
      case 3:
        return useGet(school, fields.DEGREE_OFFERED + ".certificate") || 
              useGet(school, fields.DEGREE_OFFERED + ".assoc") ? "4-year" : false
    }
    return false
  }

  const netPrice = (school) => {
    if (!school) return null
    return useGet(school, fields['NET_PRICE'])
  }

  const parentPlusDebt = (school) => {
    if (!school) return null
    return useGet(school, fields['PARENT_PLUS_TOTAL_DEBT'])
  }

  const parentPlusDebtAll = (school) => {
    if (!school) return null
    return useGet(school, fields['PARENT_PLUS_TOTAL_DEBT_ALL'])
  }

  const parentPlusPayment = (school) => {
    if (!school) return null
    return useGet(school, fields['PARENT_PLUS_LOAN_PAYMENT'])
  }

  const parentPlusPaymentAll = (school) => {
    if (!school) return null
    return useGet(school, fields['PARENT_PLUS_LOAN_PAYMENT_ALL'])
  }

  const monthlyLoanPayment = (school) => {
    if (!school) return null
    return useGet(school, fields['MONTHLY_LOAN_PAYMENT'])
  }

  const monthlyLoanPaymentAll = (school) => {
    if (!school) return null
    return useGet(school, fields['MONTHLY_LOAN_PAYMENT'])
  }

  const undergraduates = (school) => {
    if (!school) return null
    return useGet(school, fields['SIZE'])
  }

  const publicPrivate = (school) => {
    if (!school) return null
    var ownership = useGet(school, fields["OWNERSHIP"])
    switch (+ownership) {
      case 1: return "public"
      case 2:
      case 3: return "private"
    }
    return null
  }

  const income = (school) => {
    if (!school) return null
    let income = useGet(school, fields["NET_PRICE_BY_INCOME"])
    return income[publicPrivate(school)]["by_income_level"]
  }

  const specialDesignations = (school) => {
    if (!school) return null
    const designations = []
    const SPECIAL_DESIGNATIONS = site.value.data.special_designations || {}
  
    if (+useGet(school, fields.WOMEN_ONLY)) {
      designations.push(SPECIAL_DESIGNATIONS.women_only)
    } else if (+useGet(school, fields.MEN_ONLY)) {
      designations.push(SPECIAL_DESIGNATIONS.men_only)
    }
  
    const religious = useGet(school, fields.RELIGIOUS)
    if (religious in RELIGIOUS_AFFILIATIONS_BY_NUMBER.value) {
      designations.push(RELIGIOUS_AFFILIATIONS_BY_NUMBER.value[religious])
    }
  
    const minorityServing = useGet(school, fields.MINORITY_SERVING)
    if (minorityServing) {
      for (const key in SPECIAL_DESIGNATIONS) {
        if (+minorityServing[key]) {
          designations.push(SPECIAL_DESIGNATIONS[key])
        }
      }
    }

    return designations
  }
  
  const raceEthnicity = (school) => {
    if (!school) return null
    const output = []
    const re = useGet(school, fields["RACE_ETHNICITY"])
    const re_staff = useGet(school, fields["RACE_ETHNICITY_STAFF"])
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
  }
  
  const retentionRate = (school) => {
    if (!school) return null
    let retention = useGet(school, fields.RETENTION_RATE)
    if (retention) {
      const fourYear = retention.four_year.full_time_pooled
      return fourYear || fourYear === 0 ? fourYear : retention.lt_four_year.full_time_pooled
    }
    retention = useGet(school, fields.RETENTION_RATE + ".four_year.full_time_pooled")
    return retention || retention === 0 ? retention :
      useGet(school, fields.RETENTION_RATE + ".lt_four_year.full_time_pooled")
  }
  
  const completionRate = (school) => {
    if (!school) return null
    const OM = useGet(school, fields.COMPLETION_OM)
    const G150_4 = useGet(school, fields.COMPLETION_150_4)
    const G150_LT4 = useGet(school, fields.COMPLETION_150_LT4)
    if (!OM && !G150_4 && !G150_LT4) return false
    if (OM) return OM
    return years(school) == 3 ? G150_4 : G150_LT4
  }
  
  const completionRatePell = (school) => {
    if (!school) return null
    const OM = useGet(school, fields.COMPLETION_OM_PELL)
    const G150_4 = useGet(school, fields.COMPLETION_150_4_PELL)
    const G150_LT4 = useGet(school, fields.COMPLETION_150_LT4_PELL)
    if (!OM && !G150_4 && !G150_LT4) return false
    if (OM) return OM
    return years(school) == 3 ? G150_4 : G150_LT4
  }
  
  const completionRateFieldDefinition = (school) => {
    if (!school) return null
    const OM = useGet(school, fields.COMPLETION_OM)
    return OM ? 'default' : 'gr150'
  }
  
  const completionRateOverall = (school) => {
    if (!school) return null
    return useGet(school, fields.COMPLETION_RATE)
  }
  
  const programReporter = (school) => {
    if (!school) return null
    const reporterData = []
    const programs = useGet(school, fields.PROGRAM_REPORTER_PROGRAM)
    const cost = useGet(school, fields.PROGRAM_REPORTER_COST)
    for (let q = 1; q <= 6; q++) {
      if (programs[`program_${q}`].cip_6_digit.code) {
        reporterData.push({
          ...programs[`program_${q}`].cip_6_digit,
          ...cost[`program_${q}`].cip_6_digit
        })
      }
    }
    return reporterData
  }
  
  const isProgramReporter = (school) => {
    if (!school) return null
    return useGet(school, fields.PROGRAM_REPORTER_OFFERED) > 0
  }
  
  const isBranch = (school) => {
    if (!school) return null
    return useGet(school, fields["MAIN"]) === 0
  }
  
  const schoolUrl = (school) => {
    if (!school) return null
    const url = useGet(school, fields['SCHOOL_URL'], '#')
    if (url === '#') return false
    return url.match(/^http/) ? url : 'http://' + url
  }
  
  const fullTimeEnrollment = (school) => {
    if (!school) return null
    const fte = useGet(school, fields['PART_TIME_SHARE'])
    if (fte == null) return null
    return (1 - fte).toFixed(2)
  }
  
  const partTimeEnrollment = (school) => {
    if (!school) return null
    const pte = useGet(school, fields['PART_TIME_SHARE'])
    if (pte == null) return null
    return pte.toFixed(2)
  }
  
  const socioEconomicDiversity = (school) => {
    if (!school) return null
    return useGet(school, fields['PELL_PERCENTAGE'])
  }
  
  const studentRatio = (school) => {
    if (!school) return null
    return useGet(school, fields['STUDENT_RATIO'])
  }
  
  const netPriceCalculatorUrl = (school) => {
    if (!school) return null
    return useGet(school, fields['NET_PRICE_CALC_URL'], '#')
  }

  const allFieldsOfStudy = (school) => {
    if (!school) return null
    let fos = useGet(school, fields['FIELD_OF_STUDY'])
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
  }

  const debtRange = (school) => {
    const fosValue = allFieldsOfStudy(school)
    if (!fosValue) return null
    return generateDebtRange(fosValue, aidShowMedianDebtWithPrior.value, aidLoanSelect.value)
  }

  const earningsRange = (school) => {
    const fosValue = allFieldsOfStudy(school)
    if (!fosValue) return null
    let fos = fosValue
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
  }

  const act = (school) => {
    if (!school) return null
    return {
      available: useGet(school, fields['ACT_MIDPOINT']) != null,
      lower: useGet(school, fields['ACT_25TH_PCTILE']),
      upper: useGet(school, fields['ACT_75TH_PCTILE']),
      min: 0,
      max: 36
    }
  }

  const satReading = (school) => {
    if (!school) return null
    return {
      available: useGet(school, fields['SAT_READING_MIDPOINT']) != null,
      lower: useGet(school, fields['SAT_READING_25TH_PCTILE']),
      upper: useGet(school, fields['SAT_READING_75TH_PCTILE']),
      min: 0,
      max: 800
    }
  }

  const satMath = (school) => {
    if (!school) return null
    return {
      available: useGet(school, fields['SAT_MATH_MIDPOINT']) != null,
      lower: useGet(school, fields['SAT_MATH_25TH_PCTILE']),
      upper: useGet(school, fields['SAT_MATH_75TH_PCTILE']),
      min: 0,
      max: 800
    }
  }

  const acceptanceRate = (school) => {
    if (!school) return null
    return useGet(school, fields['ACCEPTANCE_RATE_CONSUMER'])
  }

  const acceptanceRateActual = (school) => {
    if (!school) return null
    return useGet(school, fields['ACCEPTANCE_RATE'])
  }

  const openAdmissions = (school) => {
    if (!school) return null
    return useGet(school, fields['OPEN_ADMISSIONS'])
  }

  const studentsReceivingLoans = (school) => {
    if (!school) return null
    return useGet(school, fields['AID_PERCENTAGE'])
  }

  const aidFlag = (school) => {
    if (!school) return null
    return useGet(school, fields['AID_ELIGIBILITY'])
  }

  const fieldsLink = (school) => {
    if (!school) return null
    let id = useGet(school, fields["ID"])
    let name = useGet(school, fields["NAME"], "(unknown)")
    return "/school/fields/?" + id + "-" + name.replace(/\W+/g, "-")
  }

  const schoolLink = (school) => {
    if (!school) return null
    let id = useGet(school, fields['ID'])
    let name = useGet(school, fields['NAME'], '(unknown)')
    return '/school/?' + id + '-' + name.replace(/\W+/g, '-')
  }

  const estimatedParentBorrowedText = (school) => {
    if (!school ||
      useGet(school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']) === 'undefined' ||
      useGet(school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX']) === 'undefined' ||
      useGet(school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']) === null ||
      useGet(school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX']) === null
    ) {
      return null
    }

    return formatParentPlusText(
      useGet(school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']),
      useGet(school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX'])
    )
  }

  const dolflag = (school) => {
    if (!school) return null
    return useGet(school, fields['DOLFLAG'])
  }

  const repaymentRates = (school) => {
    if (!school) return null
    let output = { ug: [], ugcomp: [] }
    let types = ['ug', 'ugcomp']
    let rr = site.value.data.repayment_rates
    let rates = useGet(school, fields['REPAYMENT_RATES'])
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
  }

  const medianEarnings = (school) => {
    if (!school) return null
    return useGet(school, fields['MEDIAN_EARNINGS'])
  }

  const federalDebt = (school) => {
    if (!school) return null
    return useGet(school, fields['AVERAGE_TOTAL_DEBT'])
  }

  const toggleMedianEarnings = (school) => {
    if (!school) return null
    return {
      0: useGet(school, fields['EARNINGS_MIDPOINT_PRED_DEGREE']),
      1: useGet(school, fields['EARNINGS_MIDPOINT_ALL'])
    }
  }

  const toggleAverageAnnualCosts = (school) => {
    if (!school) return null
    return {
      0: useGet(school, fields['AVG_COST_MIDPOINT_PRED_DEGREE']),
      1: useGet(school, fields['AVG_COST_MIDPOINT_ALL'])
    }
  }

  const toggleGraduationRate = (school) => {
    if (!school) return null
    return {
      0: useGet(school, fields['COMPLETION_MIDPOINT_PRED_DEGREE']),
      1: useGet(school, fields['COMPLETION_MIDPOINT_ALL'])
    }
  }

  const toggleGroupMedianEarnings = (schools) => {
    if (!schools || schools.length === 0) return null
    return {
      0: useGet(schools[0], fields['EARNINGS_MIDPOINT_PRED_DEGREE']),
      1: useGet(schools[0], fields['EARNINGS_MIDPOINT_ALL'])
    }
  }

  const toggleGroupAverageAnnualCosts = (schools) => {
    if (!schools || schools.length === 0) return null
    return {
      0: useGet(schools[0], fields['AVG_COST_MIDPOINT_PRED_DEGREE']),
      1: useGet(schools[0], fields['AVG_COST_MIDPOINT_ALL'])
    }
  }

  const toggleGroupGraduationRate = (schools) => {
    if (!schools || schools.length === 0) return null
    return {
      0: useGet(schools[0], fields['COMPLETION_MIDPOINT_PRED_DEGREE']),
      1: useGet(schools[0], fields['COMPLETION_MIDPOINT_ALL'])
    }
  }

  const fakeMedianEarnings = () => ({
    1: { 0: 28589, 1: 38461 },
    2: { 0: 37840, 1: 38461 },
    3: { 0: 50482, 1: 38461 },
  })

  const fakeAverageAnnualCosts = () => ({
    1: { 0: 16163, 1: 16007 },
    2: { 0: 8432, 1: 16007 },
    3: { 0: 18902, 1: 16007 },
  })

  const fakeGraduationRate = () => ({
    1: { 0: 0.6804, 1: 0.5938 },
    2: { 0: 0.3158, 1: 0.5938 },
    3: { 0: 0.5789, 1: 0.5938 },
  })

  const standardizedTestText = (school) => {
    if (!school) return null

    const schoolName = useGet(school, fields['NAME'], 'N/A')
    const acceptanceRateActual = useGet(school, fields['ACCEPTANCE_RATE'])
    const openAdmissions = useGet(school, fields['OPEN_ADMISSIONS'])
    const standardizedTestValue = useGet(school, fields['TEST_REQUIREMENTS'])

    let categoryText = ""
    let rangeText = ""
    let acceptanceText = "  "

    if (acceptanceRateActual == 1 && openAdmissions != 1) {
      acceptanceText = `${schoolName} has an acceptance rate of 100%, which means that all students who apply are accepted. `
    } else if (openAdmissions != 1 && acceptanceRateActual) {
      acceptanceText = `${schoolName} has an acceptance rate of ${Math.round(acceptanceRateActual * 100)}%. `
    } else if (openAdmissions == 1) {
      acceptanceText = `${schoolName} has an open admission policy, which means that all students who apply are accepted. `
    }

    switch (standardizedTestValue) {
      case 1:
        categoryText = `${schoolName} requires admission test scores (SAT/ACT) during the application process. `
        rangeText = `Students who were admitted to ${schoolName} and enrolled typically had admission test scores in these ranges.`
        break
      case 5:
        categoryText = `${schoolName} considers admission test scores (SAT/ACT) during the application process, but does not require them. `
        rangeText = `Students who were admitted to ${schoolName} and enrolled typically had admission test scores in these ranges.`
        break
      case 2:
        categoryText = `${schoolName} recommends students provide admission test scores (SAT/ACT), during the application process. `
        break
      case 3:
        categoryText = `${schoolName} does not require admission test scores (SAT/ACT) during the application process and does not recommend that students provide them. `
        break
      case 4:
      case null:
        categoryText = `The admission test score (SAT/ACT) policy for ${schoolName} is unknown. `
        break
    }
    return acceptanceText + categoryText + rangeText
  }

  const standardizedTestValue = (school) => {
    if (!school) return null
    return useGet(school, fields['TEST_REQUIREMENTS'])
  }

  const percentMoreThanHS = (school) => {
    if (!school) return null
    return useGet(school, fields['EARNINGS_GT_HS'])
  }

  const schoolDegreeList = (school) => {
    if (!school) return null
    let programs = useGet(school, fields.FIELD_OF_STUDY)
    if (!programs) return "no Degrees or Certificates"
  
    let programLevels = programs.map(p => p.credential.level).filter((x, i, a) => a.indexOf(x) == i)
  
    let degreeLevels = programLevels.filter(x => [2,3,5,6,7].includes(x))
    let certLevels = programLevels.filter(x => [4,8].includes(x))
    let ugCertLevels = programLevels.filter(x => [1].includes(x))
  
    let degreesList = ""
    let certList = ""
    let ugCertList = ""
  
    for (let level of degreeLevels) {
      let label = formMappings['fosDegrees'].find(e => e.value === level.toString())['label'].replace(" Degree", "")
      if (level == degreeLevels[degreeLevels.length - 1]) {
        degreesList += degreeLevels.length > 1 ? ` and ${label} Degrees` : `${label} Degrees`
      } else if (level == degreeLevels[degreeLevels.length - 2]) {
        degreesList += label
      } else {
        degreesList += `${label}, `
      }
    }
  
    for (let level of certLevels) {
      let label = formMappings['fosDegrees'].find(e => e.value === level.toString())['label'].replace(" Certificate", "")
      if (level == certLevels[certLevels.length - 1]) {
        certList += certLevels.length > 1 ? ` and ${label} Certificates` : `${label} Certificates`
      } else if (level == certLevels[certLevels.length - 2]) {
        certList += label
      } else {
        certList += `${label}, `
      }
    }
  
    for (let level of ugCertLevels) {
      let label = formMappings['fosDegrees'].find(e => e.value === level.toString())['label']
      ugCertList = label
    }
  
    let ret = degreesList + 
              ((degreesList && certList) ? ` as well as ${certList}` : certList) + 
              (((certList || degreesList) && ugCertList) ? `, and ${ugCertList}` : ugCertList)
  
    return ret || "no Degrees or Certificates"
  }

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
    if (!fieldsOfStudy.length) {
      fieldsOfStudy = [fieldsOfStudy];
    }
    let cleanDebt = cleanDebt(fieldsOfStudy, aidShowMedianDebtWithPrior, aidLoanSelect);

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
    const categories = [
      { key: "certificate", title: "certificate", filterValue: 1 },
      { key: "associate", title: "associate's Degree", filterValue: 2 },
      { key: "bachelor", title: "bachelor's Degree", filterValue: 3 },
      { key: "postbaccalaureate", title: "post-baccalaureate Certificate", filterValue: 4 },
      { key: "master", title: "master's Degree", filterValue: 5 },
      { key: "doctor", title: "doctoral Degree", filterValue: 6 },
      { key: "firstprofessional", title: "first Professional Degree", filterValue: 7 },
      { key: "graduatecertificate", title: "graduate/Professional Certificate", filterValue: 8 },
    ];

    const categorized = categories.map(category => ({
      ...category,
      items: fieldsOfStudy.filter(fieldOfStudy => 
        useGet(fieldOfStudy, fields.FOS_CREDENTIAL_LEVEL) === category.filterValue
      )
    }));

    return categorized.filter(category => category.items.length > 0);
  };

  const fieldOfStudyCompareFormat = (fieldOfStudyReturnObject) => {
    return {
      institutionName: useGet(fieldOfStudyReturnObject, 'school.name'),
      credentialTitle: (Number(useGet(fieldOfStudyReturnObject, 'credential.level')) === 3) ? "Bachelor's Degree" : useGet(fieldOfStudyReturnObject, 'credential.title'),
      fosTitle: useGet(fieldOfStudyReturnObject, 'title'),
      id: useGet(fieldOfStudyReturnObject, 'unit_id'),
      code: useGet(fieldOfStudyReturnObject, 'code'),
      credentialLevel: useGet(fieldOfStudyReturnObject, 'credential.level'),
    };
  };
  
  return {
    id,
    schoolName,
    city,
    state,
    zip,
    schoolUrlDisplay,
    underInvestigation,
    years,
    groupName,
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

    orderByWithNullsAtEnd,
    formatParentPlusText,
    cleanDebt,
    generateDebtRange,
    categorizeFieldsOfStudy,
    fieldOfStudyCompareFormat
  }
}