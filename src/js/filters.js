import Vue from "vue";
import _ from "lodash";

Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('formatUrl', function(url){
    if (!url) return null;
    else if (String(url).indexOf('http') !== 0) {
      return 'http://' + url;
    } else {
      return url;
    }
})

Vue.filter('formatUrlText', function(value){
    return value
        .replace(/^https?:\/\//i, "") // remove protocol
        .split('/') // explode the url
        .shift() // grab first segment (the domain)
        .replace(/^www\./, ''); // remove www.
})



Vue.filter('formatYearsLabel', function(value){
    if(value>1) return 'Year';
    else if(value==1)return "Certificate";
    else return false;
});

Vue.filter('yearsClass', function(value){
    switch(+value){
        case 2: return 'icon-two';
        case 3: return 'icon-four';
      }
      return 'icon-certificate';
});

Vue.filter('yearsText', function(value){
    switch(+value){
        case 1: return 'Certificate'
        case 2: return '2-yr';
        case 3: return '4-yr';
      }
      return '4-yr';
});

Vue.filter('control', function(id){
    let lookup = {
        '-1': 'Unknown',
        '1': 'Public',
        '2': 'Private Nonprofit',
        '3': 'Private For-Profit'
    }
    return lookup[id];
});

Vue.filter('controlClass', function(id){
    let lookup = {
        '1': 'icon-public',
        '2': 'icon-private',
        '3': 'icon-profit'
    }
    return lookup[id]
});

Vue.filter('sizeCategory', function(size){
    let text = 'size unknown';
    if(_.inRange(size, 0, 2000)) text = 'Small';
    else if(_.inRange(size, 2000, 15000)) text = 'Medium';
    else if(_.inRange(15000, Infinity)) text = 'Large';
    return text;
})

Vue.filter('sizeCategoryClass', function(size){
    let text = 'size unknown';
    if(_.inRange(size, 0, 2000)) text = 'icon-small';
    else if(_.inRange(size, 2000, 15000)) text = 'icon-medium';
    else if(_.inRange(15000, Infinity)) text = 'icon-large';
    return text;
})

Vue.filter('locale', function(id){
    let lookup = {
        '-1': "Locale Unknown",
    // '11': 'City: Large',
    // '12': 'City: Midsize',
    // '13': 'City: Small',
    // '21': 'Suburb: Large',
    // '22': 'Suburb: Midsize',
    // '23': 'Suburb: Small',
    // '31': 'Town: Fringe',
    // '32': 'Town: Distant',
    // '33': 'Town: Remote',
    // '41': 'Rural: Fringe',
    // '42': 'Rural: Distant',
    // '43': 'Rural: Remote'
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
    return lookup[id];
});


Vue.filter('localeClass', function(id){
    let lookup = {
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
    return lookup[id];
});

Vue.filter('formatFieldOfStudyTitle', function (value) {
    if (!value) return value;

    // Check if the last character is a .
    // Remove, send back.
    value = value.toString()
    // If last character is a period
    if(value.slice(-1) === '.'){
        // Remove it
        return value.slice(0,-1);
    }else{
        return value;
    }
});

Vue.filter('formatCip2Title', function(value){
    if (!value) return value;

    // Check if the last character is a .
    value = value.toString()
    let returnString = "";
    // If last character is a period
    if(value.slice(-1) === '.'){
        // Remove it
        returnString = value.slice(0,-1);
    }else{
        returnString =  value;
    }

    return _.startCase(returnString.toLocaleLowerCase());
})

Vue.filter('formatFieldOfStudyCredentialTitle', function(value){
    // Only for "Bachelors Degree". Issue with data source.

    switch (value){
        case "Bachelors Degree":
            return "Bachelor's Degree";
        case "Undergraduate Certificate or Diploma":
            return "Certificate";
        default:
            return value;
    }
});


