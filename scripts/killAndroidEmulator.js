import { IS_MACOS } from './constants'
import run from './utils/run'

export default function killAndroidEmulator() {
  run(`pkill -9 ${IS_MACOS ? '-f' : ''} emulator || true`)
}
