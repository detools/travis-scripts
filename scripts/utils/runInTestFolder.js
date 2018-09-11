import run from './run'
import { DEFAULT_TESTS_FOLDER } from '../constants'

export default function runInTestFolder(command) {
  run(command, DEFAULT_TESTS_FOLDER)
}
