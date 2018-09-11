import { execSync } from 'child_process'
import fsExtra from 'fs-extra'
import castArray from 'lodash/castArray'

export default {
  rm: pathsToRemove => castArray(pathsToRemove).forEach(name => execSync(`rm -rf ${name}`)),
  mv: (source, destination) => fsExtra.moveSync(source, destination),
  cp: (source, destination) => fsExtra.copySync(source, destination),
  mkdir: pathToDir => fsExtra.mkdirsSync(pathToDir),
}
