import { systemSchemaValidation } from "../../src/core/utils/validate-system-config-schema.util";

describe('synapse-engine Schema Validation', () => {
  const ENGINE_TYPE = 'synapse-engine';

  // 1. Golden Baseline Object (100% Valid)
const BASE_VALID_CONFIG = {
    [ENGINE_TYPE]: {
      acceptedSystemArtifacts: ['REQ', 'ADR', 'SPEC'],
      connectionInsertionTitleRegex: '^connections?$',
      classificationGuidelines: {
        artifactCategoryMap: {
          '📕 Architecture': ['VS', 'ADR'],
          '📓 Requirements': ['REQ'],
        },
        extensionCategoryMap: {
          code: ['.ts', '.js'],
        },
      },
    },
  };

  /**
   * Helper function to generate a fresh, cloned config with deep overrides.
   * Prevents state leakage between tests.
   */
  const buildConfig = (overrideFn) => {
    const config = structuredClone(BASE_VALID_CONFIG);
    if (overrideFn) overrideFn(config);
    return config;
  };

  // --- 2. Happy Path ---
  test('Valid configuration passes validation without throwing', () => {
    const validConfig = buildConfig();
    expect(() => systemSchemaValidation(ENGINE_TYPE, validConfig)).not.toThrow();
  });

  // --- 3. Step-by-Step Missing Field Tests (Dynamic Table) ---
  describe('Required Fields Validation', () => {
    const missingCases = [
      {
        field: 'acceptedSystemArtifacts',
        mutate: (cfg) => delete cfg[ENGINE_TYPE].acceptedSystemArtifacts,
        expectedError: 'acceptedSystemArtifacts property is required',
      },
      {
        field: 'connectionInsertionTitleRegex',
        mutate: (cfg) => delete cfg[ENGINE_TYPE].connectionInsertionTitleRegex,
        expectedError: 'connectionInsertionTitleRegex property is required',
      },
      {
        field: 'classificationGuidelines',
        mutate: (cfg) => delete cfg[ENGINE_TYPE].classificationGuidelines,
        expectedError: 'classificationGuidelines property is required',
      },
    ];

    test.each(missingCases)(
      'fails when $field is missing',
      ({ mutate, expectedError }) => {
        const invalidConfig = buildConfig(mutate);
        
        expect(() => systemSchemaValidation(ENGINE_TYPE, invalidConfig)).toThrow(
          expectedError
        );
      }
    );
  });

  // --- 4. Step-by-Step Invalid Value Tests ---
  describe('Value Constraints & Format Rules', () => {
    const invalidValueCases = [
      {
        description: 'empty acceptedSystemArtifacts array',
        mutate: (cfg) => { cfg[ENGINE_TYPE].acceptedSystemArtifacts = []; },
        expectedError: 'At least one system artifact prefix must be present',
      },
      {
        description: 'invalid regex syntax in connectionInsertionTitleRegex',
        mutate: (cfg) => { cfg[ENGINE_TYPE].connectionInsertionTitleRegex = '([a-z'; },
        expectedError: 'Must be a valid regular expression string',
      },
      {
        description: 'empty array inside artifactCategoryMap category',
        mutate: (cfg) => { cfg[ENGINE_TYPE].classificationGuidelines.artifactCategoryMap['📕 Architecture'] = []; },
        expectedError: 'Category \"📕 Architecture\" must contain at least one artifact or extension',
      },
      {
        description: 'empty string inside artifactCategoryMap category',
        mutate: (cfg) => { cfg[ENGINE_TYPE].classificationGuidelines.artifactCategoryMap['📕 Architecture'] = [""]; },
        expectedError: 'Artifact or extension must be a non-empty string',
      },
      {
        description: 'non-string inside artifactCategoryMap category',
        mutate: (cfg) => { cfg[ENGINE_TYPE].classificationGuidelines.artifactCategoryMap['📕 Architecture'] = [123]; },
        expectedError: 'classificationGuidelines.artifactCategoryMap.📕 Architecture[0] must be a `string` type, but the final value was: `123`.',
      },
    ];

    test.each(invalidValueCases)(
      'fails with $description',
      ({ mutate, expectedError }) => {
        const invalidConfig = buildConfig(mutate);

        expect(() => systemSchemaValidation(ENGINE_TYPE, invalidConfig)).toThrow(
          expectedError
        );
      }
    );
  });
});


describe('dev-workflow Schema Validation', () => {
  const ENGINE_TYPE = 'dev-workflow';

  // Baseline Object (valid)
const BASE_VALID_CONFIG = {
    [ENGINE_TYPE]: {
      projectPrefix: "TSO",
  }
};

  // Helper function to generate, cloned config with deep overrides.
 
  const buildConfig = (overrideFn) => {
    const config = structuredClone(BASE_VALID_CONFIG);
    if (overrideFn) overrideFn(config);
    return config;
  };

  // Happy Path Case
  test('Valid configuration passes validation without throwing', () => {
    const validConfig = buildConfig();
    expect(() => systemSchemaValidation(ENGINE_TYPE, validConfig)).not.toThrow();
  });

  // Step-by-Step Missing Field Tests
  describe('Required Fields Validation', () => {
    const missingCases = [
      {
        field: 'projectPrefix',
        mutate: (cfg) => delete cfg[ENGINE_TYPE].projectPrefix,
        expectedError: 'projectPrefix property is required',
      },
    ];

    test.each(missingCases)(
      'fails when $field is missing',
      ({ mutate, expectedError }) => {
        const invalidConfig = buildConfig(mutate);
        
        expect(() => systemSchemaValidation(ENGINE_TYPE, invalidConfig)).toThrow(
          expectedError
        );
      }
    );
  });

  // Step-by-Step Invalid Value Tests 
  describe('Value Constraints & Format Rules', () => {
    const invalidValueCases = [
      {
        description: 'empty projectPrefix string',
        mutate: (cfg) => { cfg[ENGINE_TYPE].projectPrefix = "" },
        expectedError: 'projectPrefix property is required',
      },
      {
        description: 'Less than 3 alphanumeric characters projectPrefix string',
        mutate: (cfg) => { cfg[ENGINE_TYPE].projectPrefix = "TS" },
        expectedError: 'Project prefix must be 3 to 5 uppercase alphanumeric characters',
      },
    ];

    test.each(invalidValueCases)(
      'fails with $description',
      ({ mutate, expectedError }) => {
        const invalidConfig = buildConfig(mutate);

        expect(() => systemSchemaValidation(ENGINE_TYPE, invalidConfig)).toThrow(
          expectedError
        );
      }
    );
  });
});