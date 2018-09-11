import fs from 'fs'
import path from 'path'
import commandExists from 'command-exists'
import toUpper from 'lodash/toUpper'
import config from './utils/config'
import { IS_MACOS, DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER } from './constants'
import log from './utils/log'
import run from './utils/run'
import runInBothProjects from './utils/runInBothProjects'

export default function installPods() {
  const isProjectUsingPods = config.get('usePods')
  log('', 'empty') // only for beautiful stdout
  log(`PROJECT IS USING PODS — ${toUpper(isProjectUsingPods)}`)
  if (IS_MACOS && isProjectUsingPods) {
    const isPodAvailable = commandExists.sync('pod')

    if (isPodAvailable) {
      [DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER].forEach((directory) => {
        const pathToFolder = path.resolve(directory, 'ios')
        const pathToFile = path.resolve(pathToFolder, 'Podfile')

        if (!fs.existsSync(pathToFile)) {
          log(`[!] No 'Podfile' found in ${pathToFolder}`, 'error')
          process.exit(1)
        }
      })

      runInBothProjects('pod install', 'ios')
    } else {
      log('COMMAND pod IS NOT AVAILABLE. INSTALLING IT...', 'warn')
      run('gem install cocoapods -v 1.3.1')

      log('POD REPO UPDATE', 'info')
      run('pod repo update')

      log('INSTALLING PODS', 'info')
      runInBothProjects('pod install', 'ios')
    }
  }
}
