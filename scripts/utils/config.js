import { existsSync } from 'fs'
import get from 'lodash/get'
import { CWD, DETOOLS_CONFIG_NAME, PROJECT } from '../constants'

const detoolsRCPath = `${CWD}/${DETOOLS_CONFIG_NAME}`

// eslint-disable-next-line import/no-dynamic-require
const detoolsRC = existsSync(detoolsRCPath) ? require(detoolsRCPath).default : {}

const defaultValues = {
  // @description Just checked passed variables in process.env
  // @see checkRequiredVariables
  requiredVariables: [],

  // @description An array with npm scripts as strings or plain functions to run
  // @see runBeforeCreateProjects
  beforeCreateProjects: [],

  // @description
  // A list of files you've changed on your example app.
  // They will be copied to reproduce your example app code.
  // We need this to create a new example app through the tests and check that link works correct.
  // Different folder example_podspec need to check installation of module via "podspec"
  // Currently, this list contains minimum required files that you may change while development.
  // Handles 0.49 breaking change for index.{ios,android}.js => index.js transformation
  // @see copyNecessaryFiles
  filesToCopy: [
    '.appiumhelperrc',
    '.babelrc',
    'package.json',
    'android/build.gradle',
    'android/gradle/wrapper/gradle-wrapper.properties',
    'android/app/src/main/AndroidManifest.xml',
    `ios/${PROJECT}/AppDelegate.m`,
    `ios/${PROJECT}/Info.plist`,
    'src',
    'scripts',
    '__tests__',
    'rn-cli.config.js',
    'App.js',
    'ios/Podfile',
  ],

  // @description Indicator for project that using Pods. macOS only
  // @see installPods
  usePods: false,

  // @description Indicator for project that using Appium as a test framework
  // @see runAppium
  useAppium: true,

  // @description An array with npm scripts as strings or plain functions to run
  // @see runAfterInstall
  afterInstall: [],

  // @description Just pass additional variables to build
  // @see buildIOS, buildAndroid
  additionalVariablesToBuild: {
    ios: [],
    android: [],
    podspec: [],
  },

  // @description You can define custom build commands for iOS, Android, Podspec builds
  // @see buildIOS, buildAndroid
  build: {
    ios: '',
    android: '',
    podspec: '',
  },

  // @description Just pass additional variables to test
  // @see runTestsIOS, runTestsAndroid
  additionalVariablesToTest: {
    ios: [],
    android: [],
    podspec: [],
  },

  // @description Commands to run tests for both platforms
  // @see runTestsIOS, runTestsAndroid
  test: {
    ios: 'npm run test:ios',
    android: 'npm run test:android',
  },

  // @description If you would like to run tests in loop or to detect a problem. You're welcome!
  // @see runTests
  runTestsCount: 1,

  // @description If you run your tests in loop, but want to exit from tests on first fail
  // @see runTests
  failFast: true,

  // @description Name of Simulator/Emulator to run for tests
  // @see runAndroidEmulator
  virtualDevice: {
    ios: 'iPhone 6', // Optional
    android: 'detools-android-5.1.1-22', // Required
  }, // Required

  // @description Indicator to create sdcard for Android Emulator and put it path to emulator config
  // @see runAndroidEmulator
  androidEmulatorNeedsWritableStorage: false,
}

export default {
  get: path => get(detoolsRC, path, get(defaultValues, path)),
}
