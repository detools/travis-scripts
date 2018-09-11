import os from 'os'
import path from 'path'
import isEmpty from 'lodash/isEmpty'

const {
  HOME,
  TRAVIS_OS_NAME,
  ANDROID_HOME,
  PROJECT = 'example',
  TEST_PROJECT = 'example_tmp',
  PODSPEC_PROJECT = 'example_podspec',
  OS = 'both',
} = process.env

/* CONSTANTS */
export const TMP = 'tmp'
export const REACT_NATIVE_PACKAGE_NAME = 'react-native'
export const REACT_NATIVE_CLI_PACKAGE_NAME = 'react-native-cli'
export const BREAKING_REACT_NATIVE_VERSION = 49
export const TIPSI_CONFIG_NAME = '.tipsirc.js'
export const NPMIGNORE_FILENAME = '.npmignore'
export const CWD = process.cwd()

/* PLATFORM TOOLS */
export const isPlatform = name => os.type() === name
export const IS_LINUX = isPlatform('Linux')
export const IS_MACOS = isPlatform('Darwin')
export const IS_WINDOWS = isPlatform('Windows_NT')

export const IS_BOTH = OS === 'both'
export const IS_ANDROID = IS_BOTH || OS === 'android'
export const IS_IOS = IS_BOTH || OS === 'ios'

export const generatePath = name => path.resolve(CWD, name)

/* GENERATED CONSTANTS */
export const ORIGINAL_FOLDER = generatePath(PROJECT)
export const DEFAULT_TESTS_FOLDER = generatePath(TEST_PROJECT)
export const PODSPEC_TESTS_FOLDER = generatePath(PODSPEC_PROJECT)
export const TMP_FOLDER = generatePath(TMP)

// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(`${ORIGINAL_FOLDER}/package.json`)
export const reactNativeVersion = packageJSON.dependencies[REACT_NATIVE_PACKAGE_NAME]
export const IS_RN_VERSION_BEFORE_49 = (
  Number(reactNativeVersion.split('.')[1]) < BREAKING_REACT_NATIVE_VERSION
)

// eslint-disable-next-line import/no-dynamic-require
export const { name: moduleName, version: moduleVersion } = require(`${CWD}/package.json`)

export const isTravisCI = !isEmpty(TRAVIS_OS_NAME)

export {
  HOME,
  PROJECT,
  ANDROID_HOME,
  TEST_PROJECT,
  PODSPEC_PROJECT,
  OS,
}
