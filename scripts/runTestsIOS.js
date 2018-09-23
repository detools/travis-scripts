import isEmpty from 'lodash/isEmpty'
import config from './utils/config'
import {
  IS_MACOS,
  IS_IOS,
  DEFAULT_TESTS_FOLDER,
  PODSPEC_TESTS_FOLDER,
} from './constants'
import log from './utils/log'
import run from './utils/run'

export default function runTestsIOS(count) {
  const isProjectUsingPods = config.get('usePods')
  if (IS_MACOS && IS_IOS) {
    const command = config.get('test.ios')
    if (isEmpty(command)) {
      throw new Error('Need to set a npm script to run tests for ios in .detoolsrc.js')
    }

    log(`${count}. RUN IOS DEFAULT TESTS`)
    run(`${command} --prefix ${DEFAULT_TESTS_FOLDER}`)

    if (isProjectUsingPods) {
      log(`${count}. RUN IOS PODSPEC TESTS`)
      run(`${command} --prefix ${PODSPEC_TESTS_FOLDER}`)
    }

    return 1
  }

  return 0
}
