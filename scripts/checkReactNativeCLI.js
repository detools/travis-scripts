import commandExists from 'command-exists'
import { REACT_NATIVE_CLI_PACKAGE_NAME } from './constants'
import log from './utils/log'
import run from './utils/run'

export default function checkReactNativeCLI() {
  log('CHECK REACT-NATIVE-CLI')
  const isReactNativeCLIExists = commandExists.sync('react-native')
  if (!isReactNativeCLIExists) {
    run(`npm install -g ${REACT_NATIVE_CLI_PACKAGE_NAME}`)
  }
}
