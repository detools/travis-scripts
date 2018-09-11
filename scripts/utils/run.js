import { execSync } from 'child_process'
import { CWD } from '../constants'

export default function run(command, directory = CWD) {
  return execSync(command, { cwd: directory, stdio: 'inherit' })
}
