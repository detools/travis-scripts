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

  const name = moduleName.replace('@', '').replace('/', '-')

  run('npm pack')
  sh.mv(`${name}-${moduleVersion}.tgz`, `${name}-latest.tgz`)
}
