import { IS_MACOS } from './constants'
import log from './utils/log'
import run from './utils/run'

export default function killAppium() {
  log('KILL EXISTING APPIUM PROCESS', 'info')
  run(`pkill -9 ${IS_MACOS ? '-f' : ''} appium || true`)
}
