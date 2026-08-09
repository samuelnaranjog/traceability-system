/**@trace SREQ-020D @ */
import * as yup from 'yup';
import { MASTER_CONFIG_NAME } from './system-config.default.util.js';

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
 * @returns {object} successfully validated data from the config engineType property 
 */
export function systemSchemaValidation(engineType, systemConfigObj, configName = MASTER_CONFIG_NAME) {
  const CUSTOM_FEEDBACK = ` property is required, please add it in the ${configName} file within the ${engineType} property`;

  const configSchemaSynapse = yup.object({
    excludeList: yup.array().of(yup.string().trim().required('Exclude file must be a non-empty string')),
    acceptedSystemArtifacts: yup
      .array()
      .compact()
      .of(yup.string().trim().required('Artifact prefix must be a non-empty string'))
      .min(1, 'At least one system artifact prefix must be present (e.g., ["REQ", "ADR"])')
      .required('acceptedSystemArtifacts' + CUSTOM_FEEDBACK),

    connectionInsertionTitleRegex: yup
    .mixed()
    .required(`connectionInsertionTitleRegex ${CUSTOM_FEEDBACK}`)
    .test('is-valid-regex', 'Must be a valid string or regex pattern', (value) => {
      if (!value) return false;
      try {
        new RegExp(value);
        return true; // Validates string syntax safety
      } catch {
        return false; // Blocks invalid regex strings like "("
      }
    })
    .transform((value) => {
      if (typeof value !== 'string' || !value.trim()) return value;

      const trimmed = value.trim();

      // Case 1: User typed full slash-and-flag syntax -> "/^heading?$/i"
      const slashMatch = trimmed.match(/^\/(.*)\/([gimsuy]*)$/);
      if (slashMatch) {
        return new RegExp(slashMatch[1], slashMatch[2]);
      }

      // Case 2: User typed a plain word ("connections") or pattern ("connections?")
      // Automatically anchor with ^ and $ if not already present, and set case-insensitive flag ('i')
      const pattern = `${trimmed.startsWith('^') ? '' : '^'}${trimmed}${trimmed.endsWith('$') ? '' : '$'}`;

      return new RegExp(pattern, 'i');
    }),


    classificationGuidelines: yup.object({
      artifactCategoryMap: artifactCategoriesSchema,
      extensionCategoryMap: artifactCategoriesSchema,
    }).required('classificationGuidelines' + CUSTOM_FEEDBACK),
});

  const configSchemaSpawn = yup.object({
    projectPrefix: yup
  .string()
  .trim() 
  //.transform((value) => value?.toUpperCase())
  .matches(/^[a-zA-Z0-9]{3,9}$/, 'Project prefix must be 3 to 5 uppercase alphanumeric characters')
  .required('projectPrefix' + CUSTOM_FEEDBACK)
  })

  try{
    if(engineType == "synapse-engine"){
      //console.log('Try to validate using schema  ✔️')// to debug uncoment
      const validatedSynapseConfig = configSchemaSynapse.validateSync(systemConfigObj[engineType], {
        abortEarly: false,
        stripUnknown: true
      })

      if(!validatedSynapseConfig) throw new Error("[Synapse] Couldn't get a valid value from the validation schema")

      //console.log('DEBUG: Data to return within systemSchemaValidation is :', validatedSynapseConfig)
      return validatedSynapseConfig;
    }

    if(engineType == "dev-workflow"){
       const validatedSpawnConfig = configSchemaSpawn.validateSync(systemConfigObj[engineType], {
        abortEarly: false,
        stripUnknown: true})

        if(!validatedSpawnConfig) throw new Error("[Spawn] Couldn't get a valid value form the validation schema")

        systemConfigObj[engineType] = validatedSpawnConfig;

        return systemConfigObj;
    }
  }
  catch(err){
    
    const errorMessage = Array.isArray(err.errors) 
      ? err.errors.join('; ') 
      : err.message;

    console.error(`${MASTER_CONFIG_NAME} validation of ${engineType} failed:`, errorMessage);
    
    throw new Error(`Config validation failed for [${engineType}], please ensure the config file has no JSON errors and the data is valid: ${errorMessage}`);
  }
}

