export function useFilters() {
  const capitalize = (value) => {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  
  const formatUrl = (url) => {
    if (!url) return null
    else if (String(url).indexOf('http') !== 0) {
      return 'http://' + url
    } else {
      return url
    }
  }
  
  const formatUrlText = (value) => {
    return value
      .replace(/^https?:\/\//i, "")
      .split('/')
      .shift()
      .replace(/^www\./, '')
  }
  
  const formatYearsLabel = (value) => {
    if (value > 1) return 'Year'
    else if (value == 1) return "Certificate"
    else return false
  }
  
  const yearsClass = (value) => {
    switch (+value) {
      case 2: return 'icon-two'
      case 3: return 'icon-four'
    }
    return 'icon-certificate'
  }
  
  const yearsText = (value) => {
    switch (+value) {
      case 1: return 'Certificate'
      case 2: return '2-yr'
      case 3: return '4-yr'
    }
    return '4-yr'
  }
  
  const control = (id) => {
    const lookup = {
      '-1': 'Unknown',
      '1': 'Public',
      '2': 'Private Nonprofit',
      '3': 'Private For-Profit'
    }
    return lookup[id]
  }
  
  const controlClass = (id) => {
    const lookup = {
      '1': 'icon-public',
      '2': 'icon-private',
      '3': 'icon-profit'
    }
    return lookup[id]
  }
  
  const sizeCategory = (size) => {
    let text = 'size unknown'
    if (useInRange(size, 0, 2000)) text = 'Small'
    else if (useInRange(size, 2000, 15000)) text = 'Medium'
    else if (useInRange(15000, Infinity)) text = 'Large'
    return text
  }
  
  const sizeCategoryClass = (size) => {
    let text = 'size unknown'
    if (useInRange(size, 0, 2000)) text = 'icon-small'
    else if (useInRange(size, 2000, 15000)) text = 'icon-medium'
    else if (useInRange(15000, Infinity)) text = 'icon-large'
    return text
  }
  
  const locale = (id) => {
    const lookup = {
      '-1': "Locale Unknown",
      '11': 'City',
      '12': 'City',
      '13': 'City',
      '21': 'Suburban',
      '22': 'Suburban',
      '23': 'Suburban',
      '31': 'Town',
      '32': 'Town',
      '33': 'Town',
      '41': 'Rural',
      '42': 'Rural',
      '43': 'Rural'
    }
    return lookup[id]
  }
  
  const localeClass = (id) => {
    const lookup = {
      '-1': "unknown",
      '11': 'icon-city',
      '12': 'icon-city',
      '13': 'icon-city',
      '21': 'icon-suburban',
      '22': 'icon-suburban',
      '23': 'icon-suburban',
      '31': 'icon-town',
      '32': 'icon-town',
      '33': 'icon-town',
      '41': 'icon-rural',
      '42': 'icon-rural',
      '43': 'icon-rural'
    }
    return lookup[id]
  }
  
  const formatFieldOfStudyTitle = (value) => {
    if (!value) return value
    value = value.toString()
    return value.slice(-1) === '.' ? value.slice(0, -1) : value
  }
  
  const formatCip2Title = (value) => {
    if (!value) return value
    value = value.toString()
    let returnString = value.slice(-1) === '.' ? value.slice(0, -1) : value
    return useStartCase(returnString.toLowerCase())
  }
  
  const formatFieldOfStudyCredentialTitle = (value) => {
    switch (value) {
      case "Bachelors Degree":
        return "Bachelor's Degree"
      case "Undergraduate Certificate or Diploma":
        return "Certificate"
      default:
        return value
    }
  }
  
  const unflattenObject = (obj) => {
    const result = {};
    
    for (const key in obj) {
      const keys = key.split('.');
      let current = result;
      
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          current[keys[i]] = obj[key];
        } else {
          current[keys[i]] = current[keys[i]] || {};
          current = current[keys[i]];
        }
      }
    }
    
    return result;
  }


  const generateFieldOfStudyUUID = (institutionUnitId,fieldOfStudyCode,FieldOfStudyCredentialLevel) => {
    return [
      institutionUnitId,
      fieldOfStudyCode,
      FieldOfStudyCredentialLevel
    ].join('.');
  };
  
  const decodeFieldOfStudyUUID = (urlParameterString) => {
    let decodedArray = urlParameterString.split('.');
  
    return {
      id: decodedArray[0],
      code: decodedArray[1],
      credential:{
        level: decodedArray[2]
      }
    };
  };
  
  // Take pure field of study return and format for compare drawer.
  const fieldOfStudyCompareFormat = (fieldOfStudyReturnObject) => {
    // Fixing small formatting issue with cred level 3 title formatting.  May be fixed in the data at some point;
    return {
      institutionName: fieldOfStudyReturnObject['school.name'],
      credentialTitle: formatFieldOfStudyCredentialTitle(fieldOfStudyReturnObject['credential.title']),
      //credentialTitle: fieldOfStudyReturnObject['credential.title'],
      fosTitle: fieldOfStudyReturnObject['title'],
      id: fieldOfStudyReturnObject['unit_id'],
      code: fieldOfStudyReturnObject['code'],
      credentialLevel: fieldOfStudyReturnObject['credential.level'],
    };
  };

  return {
    capitalize,
    formatUrl,
    formatUrlText,
    formatYearsLabel,
    yearsClass,
    yearsText,
    control,
    controlClass,
    sizeCategory,
    sizeCategoryClass,
    locale,
    localeClass,
    formatFieldOfStudyTitle,
    formatCip2Title,
    formatFieldOfStudyCredentialTitle,
    unflattenObject,

    generateFieldOfStudyUUID,
    decodeFieldOfStudyUUID,
    fieldOfStudyCompareFormat
  }
}