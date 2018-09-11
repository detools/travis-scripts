import checkRequiredVariables from './utils/checkRequiredVariables'
import cleanup from './cleanup'
import checkReactNativeCLI from './checkReactNativeCLI'
import createNewTarball from './createNewTarball'
import createNewProject from './createNewProject'
import copyNecessaryFiles from './copyNecessaryFiles'
import runBeforeCreateProjects from './runBeforeCreateProjects'
import removeTestsFolders from './removeTestsFolders'
import generateTestsFolders from './generateTestsFolders'
import runAppium from './runAppium'
import buildAndroid from './buildAndroid'
import installPods from './installPods'
import buildIOS from './buildIOS'
import runTests from './runTests'

(async () => {
  cleanup()

  removeTestsFolders()
  checkRequiredVariables()
  checkReactNativeCLI()
  createNewTarball()

  createNewProject()
  copyNecessaryFiles()
  runBeforeCreateProjects()
  generateTestsFolders()
  installPods()

  runAppium()

  await buildAndroid()
  buildIOS()

  runTests()
})()
