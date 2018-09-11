import path from 'path'
import { DEFAULT_TESTS_FOLDER, PODSPEC_TESTS_FOLDER, IS_IOS, IS_MACOS } from '../constants'
import config from './config'
import run from './run'

export default function runInBothProjects(command, childDirectory) {
  const projectsToRun = [DEFAULT_TESTS_FOLDER]

  const isProjectUsingPods = config.get('usePods')
  if (IS_MACOS && IS_IOS && isProjectUsingPods) {
    projectsToRun.push(PODSPEC_TESTS_FOLDER)
  }

  projectsToRun.forEach((directory) => {
    const pathToDirectory = [directory].concat(childDirectory || [])

    run(command, path.resolve(...pathToDirectory))
  })
}
