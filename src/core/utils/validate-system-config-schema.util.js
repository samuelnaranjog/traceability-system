import * as yup from 'yup';
import { MASTER_CONFIG_NAME } from './system-config.default';

const artifactCategoriesSchema = yup.lazy((value) => {
  // Ensure the input is a valid non-null object
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return yup.object().typeError('Must be an object of categories').required();
  }

  // Dynamically build a validation shape for every key present
  const dynamicShape = {};
  for (const key of Object.keys(value)) {
    dynamicShape[key] = yup
      .array()
      .of(yup.string().trim().required('Artifact or extension must be a non-empty string'))
      .min(1, `Category "${key}" must contain at least one artifact or extension`)
      .required();
  }

  return yup.object(dynamicShape).required('Category mapping is required');
});

/**
 * 
 * @param {string} engineType - The subproperty to check in the config
 * @param {object} systemConfigObj - The Parsed JSON of the config
 * @param {string} configName - Optional, for custom config name
 */
export function systemSchemaValidation(engineType, systemConfigObj, configName = MASTER_CONFIG_NAME) {
  const CUSTOM_FEEDBACK = ` property is required, please add it in the ${configName} file within the ${engineType} property`;

  const configSchemaSynapse = yup.object({
    acceptedSystemArtifacts: yup
      .array()
      .of(yup.string().trim().required('Artifact prefix must be a non-empty string'))
      .min(1, 'At least one system artifact prefix must be present (e.g., ["REQ", "ADR"])')
      .required('acceptedSystemArtifacts' + CUSTOM_FEEDBACK),

    connectionInsertionTitleRegex: yup
      .string()
      .trim()
      .test('is-valid-regex', 'Must be a valid regular expression string', (value) => {
        if (!value) return false;
        try {
          new RegExp(value); // Ensures it won't crash when your app compiles it
          return true;
        } catch {
          return false; // Returns validation error if syntax is invalid (e.g. unclosed parenthesis)
        }
      })
      .required('connectionInsertionTitleRegex' + CUSTOM_FEEDBACK),

    classificationGuidelines: yup.object({
      artifactCategoryMap: artifactCategoriesSchema,
      extensionCategoryMap: artifactCategoriesSchema,
    }),
  });

  const configSchemaSpawn = yup.object({
    projectPrefix: yup.string().required(`"projectPrefix"`, CUSTOM_FEEDBACK)
  })

  try{
    if(engineType == "synapse-engine"){
      configSchemaSynapse.validateSync(systemConfigObj.engineType, {
        abortEarly: false,
        strict: true })
    }

    if(engineType == "dev-workflow"){
      configSchemaSpawn.validateSync(systemConfigObj.engineType, {
        abortEarly: false,
        strict: true })
    }
  }
  catch(err){
    console.error(`${MASTER_CONFIG_NAME} validation of ${engineType} failed:`, err.errors);
  }
}

