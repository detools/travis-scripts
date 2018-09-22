import path from 'path'
import commandExists from 'command-exists'
import {
  PODSPEC_TESTS_FOLDER,
  TMP_FOLDER,
  PROJECT,
  DEFAULT_TESTS_FOLDER,
  moduleName,
  IS_IOS,
  IS_MACOS,
} from './constants'
import config from './utils/config'
import log from './utils/log'
import sh from './utils/sh'
import runInBothProjects from './utils/runInBothProjects'
import runInTestFolder from './utils/runInTestFolder'

export default function generateTestsFolders() {
  const isProjectUsingPods = config.get('usePods')

  if (IS_MACOS && IS_IOS && isProjectUsingPods) {
    log(`COPY NEW PROJECT FROM tmp TO ${PODSPEC_TESTS_FOLDER}`, 'info')
    sh.cp(path.resolve(TMP_FOLDER, PROJECT), PODSPEC_TESTS_FOLDER)
  }

  log(`MOVE NEW PROJECT FROM tmp TO ${DEFAULT_TESTS_FOLDER}`, 'info')
  sh.mv(path.resolve(TMP_FOLDER, PROJECT), DEFAULT_TESTS_FOLDER)

  log('REMOVE tmp', 'info')
  sh.rm(TMP_FOLDER)

  log('INSTALLING NODE_MODULES')
  runInBothProjects('rm -rf node_modules; npm install')

  log('', 'empty') // only for beautiful stdout
  log('LINK PROJECT')
  runInTestFolder(`react-native unlink ${moduleName}`)
  runInTestFolder('react-native link')

  if (IS_MACOS && IS_IOS) {
    log('GENERATE .xcodeproj VIA XCODEGEN')
    if (!commandExists.sync('xcodegen')) {
      if (!commandExists.sync('brew')) {
        // eslint-disable-next-line
        runInTestFolder('/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"')
      }

      runInTestFolder('brew update')
      runInTestFolder('brew install xcodegen')
    }

    runInBothProjects('xcodegen --spec ios/example.yml')
  }
}
