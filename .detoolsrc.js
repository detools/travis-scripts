export default {
  // Default value — []
  requiredVariables: [],

  // Default value — []
  beforeCreateProjects: [
    // It can be a npm script as a String
    // Or it can be a Function
    // 'npm run before-install-create-projects',
    // () => 1 + 2,
  ],

  // Default value — Array<String>. See in "scripts/utils/config.js"
  filesToCopy: undefined,

  // Default value — false (Valid only for MacOS)
  usePods: false,

  // Default value — true
  useAppium: true,

  // Default value — []
  afterInstall: [],

  // Default value — { ios: [], android: [], podspec: [] }
  additionalVariablesToBuild: {},

  // Default value — { ios: '', android: '', podspec: '' }
  build: {},

  // Default value — { ios: [], android: [], podspec: [] }
  additionalVariablesToTest: {},

  // Default value — { ios: 'npm run test:ios', android: 'npm run test:android' }
  test: {
    ios: 'npm run test:ios',
    android: 'npm run test:android',
  },

  // Default value — 1
  runTestsCount: 30,

  // Default value — true
  failFast: false,

  // Default value — { ios: 'iPhone 6', android: 'detools-android-5.1.1-22' }
  virtualDevice: {
    ios: 'iPhone 6',
    android: 'zzz_nexus_6p_api_21',
  },

  // Default value — false
  androidEmulatorNeedsWritableStorage: false,
}
