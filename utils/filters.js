import { inRange, startCase } from 'lodash-es';

export const capitalize = (value) => {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatUrl = (url) => {
  if (!url) return null;
  else if (String(url).indexOf("http") !== 0) {
    return "http://" + url;
  } else {
    return url;
  }
};

export const formatUrlText = (value) => {
  return value
    .replace(/^https?:\/\//i, "") // remove protocol
    .split("/") // explode the url
    .shift() // grab first segment (the domain)
    .replace(/^www\./, ""); // remove www.
};

export const formatYearsLabel = (value) => {
  if (value > 1) return "Year";
  else if (value == 1) return "Certificate";
  else return false;
};

export const yearsClass = (value) => {
  switch (+value) {
    case 2:
      return "icon-two";
    case 3:
      return "icon-four";
  }
  return "icon-certificate";
};

export const yearsText = (value) => {
  switch (+value) {
    case 1:
      return "Certificate";
    case 2:
      return "2-yr";
    case 3:
      return "4-yr";
  }
  return "4-yr";
};

export const control = (id) => {
  const lookup = {
    "-1": "Unknown",
    1: "Public",
    2: "Private Nonprofit",
    3: "Private For-Profit",
  };
  return lookup[id] || "Unknown";
};

export const controlClass = (id) => {
  const lookup = {
    1: "icon-public",
    2: "icon-private",
    3: "icon-profit",
  };
  return lookup[id] || "";
};

export const sizeCategory = (size) => {
  if (inRange(size, 0, 2000)) return "Small";
  if (inRange(size, 2000, 15000)) return "Medium";
  if (inRange(size, 15000, Infinity)) return "Large";
  return "Size unknown";
};

export const sizeCategoryClass = (size) => {
  if (inRange(size, 0, 2000)) return "icon-small";
  if (inRange(size, 2000, 15000)) return "icon-medium";
  if (inRange(size, 15000, Infinity)) return "icon-large";
  return "";
};

const LOCALE_LOOKUP = {
  "-1": "Locale Unknown",
  11: "City",
  12: "City",
  13: "City",
  21: "Suburban",
  22: "Suburban",
  23: "Suburban",
  31: "Town",
  32: "Town",
  33: "Town",
  41: "Rural",
  42: "Rural",
  43: "Rural",
};

const LOCALE_CLASS_LOOKUP = {
  "-1": "unknown",
  11: "icon-city",
  12: "icon-city",
  13: "icon-city",
  21: "icon-suburban",
  22: "icon-suburban",
  23: "icon-suburban",
  31: "icon-town",
  32: "icon-town",
  33: "icon-town",
  41: "icon-rural",
  42: "icon-rural",
  43: "icon-rural",
};

export const locale = (id) => {
  return LOCALE_LOOKUP[id] || "Locale Unknown";
};

export const localeClass = (id) => {
  return LOCALE_CLASS_LOOKUP[id] || "unknown";
};

export const formatFieldOfStudyTitle = (value) => {
  if (!value) return value;

  value = value.toString();
  // If last character is a period, remove it
  return value.slice(-1) === "." ? value.slice(0, -1) : value;
};

export const formatCip2Title = (value) => {
  if (!value) return value;

  value = value.toString();
  let returnString = value.slice(-1) === "." ? value.slice(0, -1) : value;
  return startCase(returnString.toLowerCase());
};

export const formatFieldOfStudyCredentialTitle = (value) => {
  switch (value) {
    case "Bachelors Degree":
      return "Bachelor's Degree";
    case "Undergraduate Certificate or Diploma":
      return "Certificate";
    default:
      return value;
  }
};
