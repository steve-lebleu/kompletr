/**
 * For a detailed explanation regarding each configuration property, visit: https://jestjs.io/docs/en/configuration.html
 */
export default {
  /**
   * Makes Jest run in non-browser mode. This is needed to prevent Mongoose to think it's running in a web browser
   * which causes it to use a different ObjectId implementation, causing faulty behaviour.
   */
  testEnvironment: 'jest-environment-jsdom',

  /** Only look for spec.js files in the src folder, mainly to avoid running the Cypress spec files as Jest tests. */
  testMatch: ['**/*.spec.js'],

  /**
   * Code coverage settings.
   * v8 is currently (2021-03-22) a faster but more experimental coverage instrumenter that comes with V8.
   * It also knows all the supported syntax of current Node version (unlike the default babel parser).
   * The CI pipelines require cobertura and text for it's reporting.
   * The `collectCoverageFrom` option is used to prevent the report from only considering files that were
   * loaded by the tests.
   */
  // coverageProvider: 'v8',
  collectCoverage: true,
  coverageDirectory: 'build/code-coverage',
  coverageReporters: ['cobertura', 'text'],
  collectCoverageFrom: [
    'src/**/*.js'
  ],

  injectGlobals: true,

  moduleNameMapper: {},

  /**
   * Restores the mocks e.g. `jest.spyOn()` to be undone between tests.
   * This prevents tests from seeing the mocks from a previous `it()` (which would make them order dependent and is bad).
   */
  restoreMocks: true,

  /**
   * Configures test reporters, including xUnit XML output (for Jenkins).
   */
  reporters: [
    'default', // Keep Jest default reporter
    ['jest-junit', { outputDirectory: 'build/unit-tests' }],
  ],

  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
  ],

  transform: {},

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};
