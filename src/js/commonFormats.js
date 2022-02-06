import "~/js/filters.js"
// Helper methods to generate and decode common formats;

export const generateFieldOfStudyUUID = (institutionUnitId,fieldOfStudyCode,FieldOfStudyCredentialLevel) => {
  return [
    institutionUnitId,
    fieldOfStudyCode,
    FieldOfStudyCredentialLevel
  ].join('.');
};

export const decodeFieldOfStudyUUID = (urlParameterString) => {
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
export const fieldOfStudyCompareFormat = (fieldOfStudyReturnObject) => {
  // Fixing small formatting issue with cred level 3 title formatting.  May be fixed in the data at some point;
  return {
    institutionName: fieldOfStudyReturnObject['school.name'],
    credentialTitle: this.$options.filters.formatFieldOfStudyCredentialTitle(fieldOfStudyReturnObject['credential.title']),
    //credentialTitle: fieldOfStudyReturnObject['credential.title'],
    fosTitle: fieldOfStudyReturnObject['title'],
    id: fieldOfStudyReturnObject['unit_id'],
    code: fieldOfStudyReturnObject['code'],
    credentialLevel: fieldOfStudyReturnObject['credential.level'],
  };
};