import fs from 'fs'
import { NPMIGNORE_FILENAME, moduleName, moduleVersion } from './constants'
import log from './utils/log'
import run from './utils/run'
import sh from './utils/sh'
import removeExistingTarball from './removeExistingTarball'

export default function createNewTarball() {
  removeExistingTarball()

  log('CREATE NEW TARBALL')
  if (!fs.existsSync(NPMIGNORE_FILENAME)) {
    throw new Error('You should create a .npmrc file to ignore unnecessary directories')
  }

  run('npm pack')
  sh.mv(`${moduleName}-${moduleVersion}.tgz`, `${moduleName}-latest.tgz`)
}
