import { existsSync } from 'fs'
import get from 'lodash/get'
import { CWD, TIPSI_CONFIG_NAME, PROJECT } from '../constants'

const tipsiRCPath = `${CWD}/${TIPSI_CONFIG_NAME}`

// eslint-disable-next-line import/no-dynamic-require
const tipsiRC = existsSync(tipsiRCPath) ? require(tipsiRCPath).default : {}

const defaultValues = {
  requiredVariables: [],
  beforeCreateProjects: [],
  filesToCopy: [
    '.appiumhelperrc',
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
  usePods: false, // (Valid only for MacOS)
  useAppium: true,
  afterInstall: [],
  additionalVariablesToBuild: {}, // Default value — { ios: [], android: [], podspec: [] }
  build: {}, // Default value — { ios: '', android: '', podspec: '' }
  additionalVariablesToTest: {}, // Default value — { ios: [], android: [], podspec: [] }
  test: {
    android: 'npm run test:android',
    ios: 'npm run test:ios',
  },
  runTestsCount: 1,
  failFast: true,
  virtualDevice: {
    ios: 'iPhone 6',
    android: 'tipsi-android-5.1.1-22',
  },
  androidEmulatorNeedsWritableStorage: false,
}

export default {
  get: path => get(tipsiRC, path, get(defaultValues, path)),
}
