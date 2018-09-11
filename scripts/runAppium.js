import toUpper from 'lodash/toUpper'
import config from './utils/config'
import { DEFAULT_TESTS_FOLDER } from './constants'
import log from './utils/log'
import detachedRun from './utils/detachedRun'
import killAppium from './killAppium'

export default function runAppium() {
  const isProjectUsingAppium = config.get('useAppium')
  log(`PROJECT IS USING APPIUM — ${toUpper(isProjectUsingAppium)}`)
  if (isProjectUsingAppium) {
    killAppium()

    log('RUN NEW APPIUM PROCESS', 'info')
    detachedRun(`${DEFAULT_TESTS_FOLDER}/node_modules/.bin/appium`)
  }
}
