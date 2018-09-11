import range from 'lodash/range'
import { Duration } from 'luxon'
import config from './utils/config'
import log from './utils/log'
import { IS_BOTH, IS_IOS, IS_ANDROID, reactNativeVersion } from './constants'
import runTestsAndroid from './runTestsAndroid'
import runTestsIOS from './runTestsIOS'

export default function runTests() {
  let successIOS = 0
  let successAndroid = 0
  let lastError = null

  const runTestsCount = config.get('runTestsCount')
  const failFast = config.get('failFast')

  const testsStart = Date.now()
  for (const count of range(1, runTestsCount + 1)) {
    try {
      successIOS += runTestsIOS(count)
      successAndroid += runTestsAndroid(count)
    } catch (error) {
      lastError = error

      if (failFast) {
        break
      }
    }
  }
  const testsEnd = Date.now()
  const duration = Duration.fromMillis(testsEnd - testsStart).toFormat('mm:ss')

  const logLines = [
    `API 21, RN ${reactNativeVersion}:`,
    [
      'Successful',
      IS_IOS ? `iOS: ${successIOS}` : (IS_BOTH && ' |') || '',
      IS_ANDROID ? `Android: ${successAndroid}` : '',
      `of ${runTestsCount} times.`,
    ].filter(x => x).join(' '),
    `Tests Duration: ${duration}`,
  ].join(' ')

  log(logLines, 'warn')

  if (lastError) {
    throw lastError
  }
}
