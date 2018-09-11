import isEmpty from 'lodash/isEmpty'
import config from './utils/config'
import { IS_ANDROID, DEFAULT_TESTS_FOLDER } from './constants'
import log from './utils/log'
import run from './utils/run'

export default function runTestsAndroid(count) {
  if (IS_ANDROID) {
    const command = config.get('test.android')
    if (isEmpty(command)) {
      throw new Error('Need to set a npm script to run tests for android in .tipsirc.js')
    }

    log('', 'empty') // only for beautiful stdout
    log(`${count}. RUN ANDROID TESTS`)
    run(`${command} --prefix ${DEFAULT_TESTS_FOLDER}`)

    return 1
  }

  return 0
}
