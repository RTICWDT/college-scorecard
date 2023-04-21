import {fields as piccFields, formMappings} from '../constants.js';

const fields = piccFields;

const alias = {
  name:                 fields.NAME,
  state:                fields.STATE,
  under_investigation:  fields.UNDER_INVESTIGATION,
  // cip4:                 fields.FIELD_OF_STUDY_CODE,
  search:               fields.SEARCH, // Name + Alias

  // slider ranges
  avg_net_price:        fields.NET_PRICE + '__range',
  completion_rate:      fields.COMPLETION_RATE + '__range',
  median_earnings:      fields.MEDIAN_EARNINGS + '__range',
  monthly_payments:     fields.MONTHLY_LOAN_PAYMENT + '__range',
  act:                  fields.ACT_MIDPOINT + '__range',
  sat_math:             fields.SAT_MATH_MIDPOINT + '__range',
  sat_read:             fields.SAT_READING_MIDPOINT + '__range',
  acceptance:           fields.ACCEPTANCE_RATE_CONSUMER + '__range',
  lat:                  fields.LATITUDE + '__range',
  long:                 fields.LONGITUDE + '__range',
  religious:            fields.RELIGIOUS,
  fos_salary:           fields.FIELD_OF_STUDY_EARNINGS + '__range',
  fos_debt:             fields.FIELD_OF_STUDY_DEBT + '__range',
  dolflag:              fields.DOLFLAG,

  // below allows you to just pluck one school 
  // if coming from a selected name search
  id: function(query, value, key){
    if(value)
    {
        query[fields.ID] = value;
    }
    else
    {
        // exclude perfect-only children per ED
        query[fields.ID + '__range'] = '..999999';f
    }
  },
  // special designations: women/men only, minority groups
  serving: function(query, value, key) {
    var field = [fields.MINORITY_SERVING, value].join('.');
    switch (value) {
      case 'men_only':
        field = fields.MEN_ONLY;
        break;
      case 'women_only':
        field = fields.WOMEN_ONLY;
        break;
    }
    query[field] = 1;
    delete query[key];
  },

  zip: function(query, value, key) {
    // if there is no distance query, use the fully-qualified zip codef
    // field to match schools in that zip:
    // ?zip=XXXXXX&distance=0 will always return zero results because it
    // does a distance calculation; whereas
    // ?school.zip=XXXXXX will return all schools with that zip code value
    // instead of doing a distance calculation
    if (! +query.distance) {
      query[fields.ZIP_CODE] = value; // query['school.zip'] = ...
      delete query[key]; // delete query.zip
      delete query.distance;
    }
    // (the default will submit `zip=x&distance=y`,
    // which is what the API expects)
  },

  control: function(query, value, key) {
    //Array Translation
    if(typeof value === 'string'){
      value = value.split();
    }
    
    value = mapControl(value);
    query[fields.OWNERSHIP] = value.join(',');
    // picc.data.rangify(query, fields.OWNERSHIP, value);
    delete query[key];
  },

  region: function(query, value, key) {
    // picc.data.rangify(query, fields.REGION_ID, value);
    query[fields.REGION_ID] = value.join(',');
    delete query[key];
  },

  sort: function(query, value, key) {
    var bits = String(value).split(':');
    value = bits[0];
    bits[0] = formMappings.sort[value];
    if (!bits[0]) {
      console.warn('unmapped sort value:', value);
      bits[0] = value;
    }
    query[key] = bits.join(':');
  },

  major: function(query, value, key) {
    var subfield = 'degree';
    // XXX query.degree *may* have been mapped with mapDegree(),
    // so we switch on either the input values or the output values
    switch (query.degree) {
      case 'a':
      case '2':
        subfield = 'assoc';
        break;
      case 'b':
      case '3':
        subfield = 'bachelors';
        break;
      case 'c':
      case '1':
        subfield = 'certificate'

    }
    var k = [fields.PROGRAM_OFFERED, subfield, value].join('.');
    query[k + '__range'] = '1..';
    delete query[key];
  },

  size: function(query, value, key) {
    value = mapSize(value);
    query[fields.SIZE + '__range'] = Array.isArray(value)
      ? value.join(',')
      : value;
    delete query[key];
  },

  cip4: function(query, value, key){

    // If there is an array, format value list for API
    if(typeof value === 'object'){
      if(value.length > 0){
        query[fields.FIELD_OF_STUDY_CODE] = value.join(',');
      }else{
        query[fields.FIELD_OF_STUDY_CODE] = value[0];
      }
    }else{
      query[fields.FIELD_OF_STUDY_CODE] = value;
      query[fields.FIELD_OF_STUDY_CODE] = value;
    }

    delete query[key];
  },
  // fieldOfStudySalary: function(query, value, key){
  //   console.log("YAAY");
  //   query[fields.FIELD_OF_STUDY_EARNINGS + '__range'] = value.join('...');
  //   console.log(query);
  //   delete query[key];
  // },

  // TODO - Remove old function.
  // degree: function(query, value, key) {
  //   if (value === 'a') {
  //     query[fields.DEGREE_OFFERED + '.assoc'] = true;
  //   } else if (value === 'b') {
  //     query[fields.DEGREE_OFFERED + '.bachelors'] = true;
  //   } else if (value === 'c') {
  //     query[fields.DEGREE_OFFERED + '.certificate'] = true;
  //   }
  //   delete query[key];
  // },

  // TODO - Remove/Alter to leverage new datafields. (USE: PREDOMINANT_DEGREE).  Hiding for now.
  // Note - This method will only return items that have ALL of the selected.  Not some of the selected degrees.
  // degree: function(query, value, key){
  //   for(var i in value){
  //     if (value[i] === 'a') {
  //       query[fields.DEGREE_OFFERED + '.assoc'] = true;
  //     } else if (value[i] === 'b') {
  //       query[fields.DEGREE_OFFERED + '.bachelors'] = true;
  //     } else if (value[i] === 'c') {
  //       query[fields.DEGREE_OFFERED + '.certificate'] = true;
  //     }
  //   }
  //   delete query[key];
  // },

  // XXX: this is only used for testing

  cip4_degree: function(query, value, key){
    var fosArray = [];
    for (var i in value) {
      fosArray.push(value[i])
    }
    query[fields.FIELD_OF_STUDY_LENGTH] = fosArray.join(",");
    delete query[key];
  },

  locale: function(query, value, key){
    //Array Translation
    if(typeof value === 'string'){
      value = value.split();
    }
    var localeArray = [];

    for(var i in value){
      switch (value[i].toLowerCase()){
        case 'city':
          localeArray.push('11','12','13');
          break;
        case 'suburban':
          localeArray.push('21','22','23');
          break;
        case 'town':
          localeArray.push('31','32','33');
          break;
        case 'rural':
          localeArray.push('41','42','43');
          break;
        default:
          return;
      }
    }

    query[fields.LOCALE] = localeArray.join(",");
    delete query[key];
  }
}

// map a size or array of sizes to API-friendly range values
function mapSize(value) {
  if (Array.isArray(value)) {
    return value.map(mapSize);
  }
  return formMappings.size[value];
}
      
// map a degree string ('', 'a' or 'b' or 'c') or array of strings to an
// API-friendly "predominant degree" range value
function mapDegree(value) {
  if (Array.isArray(value)) {
    return value.map(mapDegree);
  }
  return formMappings.degree[value];
}
      
function mapControl(value) {
  if (Array.isArray(value)) {
    return value.map(mapControl);
  }
  return formMappings.control[value];
}
      
// returns true if a value is an empty string, null, undefined, or an array
// with an empty 0 index value
function empty(value) {
  return value === ''
      || value === null
      || value === undefined
      || (Array.isArray(value) && empty(value[0]));
}

// TODO - Remove, Are we just copying objects?
function dataExtend(obj, a, b) {
  for (var i = 1, len = arguments.length; i < len; i++) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      for (var key in arg) obj[key] = arg[key];
    }
  }
  return obj;
};

export default {
  methods:{
    prepareParams(params) {
      let query = Object.assign({}, params);

      // only get open schools
      query[fields.OPERATING] = 1;
      //query[fields.OPEID + '__not'] = 'null';
      
      // ignore distance if no zip is provided
      if (query.distance && !query.zip) {
        console.warn('distance provided without zip; ignoring', query);
        delete query.distance;
      }
      
      // by default, filter out schools for which school.size is null
      // with a numeric range query
      if (!query.size) {
        query[fields.SIZE + '__range'] = '1..';
      }
      
      /*
      // if "online" is truthy, then we should *include* online schools,
      // which means not filtering on that field
      if (query.online) {
      } else {
        // otherwise (if query.online is falsy), filter by fields.ONLINE_ONLY=0
        query[fields.ONLINE_ONLY] = 0;
      }
      delete query.online;
      */
      
      if (!query.degree) {
        //query[fields.DEGREE_OFFERED + '.assoc_or_bachelors_or_certificate'] = true;
      }

      for (var key in query) {
        var v = query[key];
  
        // delete empty keys
        if (empty(v)) {
          delete query[key];
          continue;
        }
  
        var k = alias[key];
        switch (typeof k) {
          case 'function':
            k(query, v, key);
            break;
  
          case 'string':
            query[k] = v;
            delete query[key];
            break;
        }
      }
      
      for (var key in query) {
        if (query[key] === null || query[key] === undefined) {
          delete query[key];
        }
      }

      // set the predominant degree to range '1..3' because ED expert guidance
      query[fields.PREDOMINANT_DEGREE + '__range'] = '1..3';
      
      if(query[fields.NAME != '']){
        delete query[fields.NAME];
      }
      
      return query;
    }
  }
}