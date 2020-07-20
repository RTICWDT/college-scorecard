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