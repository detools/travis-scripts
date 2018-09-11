import path from 'path'
import commandExists from 'command-exists'
import {
  IS_MACOS,
  IS_IOS,
  DEFAULT_TESTS_FOLDER,
  PODSPEC_TESTS_FOLDER,
} from './constants'
import config from './utils/config'
import run from './utils/run'
import log from './utils/log'

const isProjectUsingPods = config.get('usePods')

function buildIOSProject(projectPath) {
  const iosFolder = path.resolve(projectPath, 'ios')
  const whatToBuild = isProjectUsingPods
    ? '-workspace example.xcworkspace'
    : '-project example.xcodeproj'

  log('RUN RELEASE BUILD', 'info')
  const xcodebuildArguments = [
    'build',
    whatToBuild,
    '-scheme example',
    '-configuration Release',
    '-sdk iphonesimulator',
    "-destination 'platform=iOS Simulator,name=iPhone 6'",
    '-derivedDataPath build',
    'ONLY_ACTIVE_ARCH=NO',
    "OTHER_LDFLAGS='$(inherited) -ObjC -lc++'",
  ].join(' ')

  const formatter = commandExists.sync('xcpretty') ? '| xcpretty' : ''
  run(`xcodebuild ${xcodebuildArguments} ${formatter}`, iosFolder)
}

export default function buildIOS() {
  if (IS_MACOS && IS_IOS) {
    log('', 'empty') // only for beautiful stdout
    log('BUILD IOS DEFAULT')
    buildIOSProject(DEFAULT_TESTS_FOLDER)

    if (isProjectUsingPods) {
      log('', 'empty') // only for beautiful stdout
      log('BUILD IOS PODSPEC')
      buildIOSProject(PODSPEC_TESTS_FOLDER)
    }

    log('', 'empty') // only for beautiful stdout
  }
}
