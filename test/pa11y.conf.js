const config = {
  // test against WCAG 2.0 AA
  'standard': 'WCAG2AA',
  // only fail on errors
  'level': 'error'
};

/**
 * Validations that we can safely ignore:
 */
const IGNORE_MESSAGES = [
  // Warning: If this element contains a navigation section, it is
  // recommended that it be marked up as a list.
  'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48',

  // Warning: Semantic markup should be used to mark emphasised or special
  // text so that it can be programmatically determined.
  'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.I',

  // Warning: If this selection list contains groups of related options, they
  // should be grouped with optgroup.
  'WCAG2AA.Principle1.Guideline1_3.1_3_1.H85.2',

  // Warning: This element is absolutely positioned and the background color
  // can not be determined. Ensure the contrast ratio between the text and
  // all covered parts of the background are at least 4.5:1.
  'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Abs',

  // Warning: Anchor element found with link content, but no href, ID or name
  // attribute has been supplied.
  'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.Placeholder',

  // Error: Duplicate id attribute value "xxx" found on the web page.
  // XXX: these appear to be false positives in HTML_Code_Sniffer
  'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77'
];

// ignore all of the above, plus all notices
config.ignore = [
  'notice'
].concat(IGNORE_MESSAGES);

module.exports = config;
