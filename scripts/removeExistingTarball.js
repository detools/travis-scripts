import { CWD } from './constants'
import log from './utils/log'
import sh from './utils/sh'

export default function removeExistingTarball() {
  log('REMOVE EXISTING TARBALL', 'info')
  sh.rm(`${CWD}/*.tgz`)
}
