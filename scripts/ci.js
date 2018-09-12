import cleanup from './cleanup'
import removeTestsFolders from './removeTestsFolders'
import checkRequiredVariables from './checkRequiredVariables'
import checkReactNativeCLI from './checkReactNativeCLI'
import createNewTarball from './createNewTarball'
import createNewProject from './createNewProject'
import copyNecessaryFiles from './copyNecessaryFiles'
import runBeforeCreateProjects from './runBeforeCreateProjects'
import generateTestsFolders from './generateTestsFolders'
import runAfterInstall from './runAfterInstall'
import installPods from './installPods'
import runAppium from './runAppium'
import buildAndroid from './buildAndroid'
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
  runAfterInstall()
  installPods()

  runAppium()

  await buildAndroid()
  buildIOS()

  runTests()
})()
