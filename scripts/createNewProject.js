import path from 'path'
import { TMP, PROJECT, TMP_FOLDER, reactNativeVersion } from './constants'
import log from './utils/log'
import sh from './utils/sh'
import run from './utils/run'
import updateBuildGradle from './updateBuildGradle'

export default function createNewProject() {
  log('', 'empty') // only for beautiful stdout
  log('CREATING NEW EXAMPLE PROJECT')

  log('CREATE tmp FOLDER', 'info')
  sh.mkdir(TMP)

  log('INIT NEW REACT-NATIVE PROJECT INSIDE tmp', 'info')
  run(`react-native init ${PROJECT} --version ${reactNativeVersion}`, TMP_FOLDER)

  log('', 'empty') // only for beautiful stdout
  log('REMOVE __tests__ FOLDER TO AVOID CONFLICTS', 'info')
  sh.rm(path.resolve(TMP_FOLDER, PROJECT, '__tests__'))

  log('ADD RELEASE SIGNING CONFIG', 'info')
  updateBuildGradle()
}
