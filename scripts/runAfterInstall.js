import runHook from './utils/runHook'
import { DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER } from './constants'

export default function runAfterInstall() {
  runHook('afterInstall', [DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER])
}
