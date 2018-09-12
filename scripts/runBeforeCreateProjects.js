import path from 'path'
import runHook from './utils/runHook'
import { TMP_FOLDER, PROJECT } from './constants'

export default function runBeforeCreateProjects() {
  runHook('beforeCreateProjects', path.resolve(TMP_FOLDER, PROJECT))
}
