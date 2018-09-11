import { TMP_FOLDER, DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER } from './constants'
import log from './utils/log'
import sh from './utils/sh'

export default function removeTestsFolders() {
  log('REMOVE EXISTING PROJECT FOLDERS FOR TESTS', 'info')
  sh.rm([TMP_FOLDER, DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER])
}
