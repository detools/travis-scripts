import path from 'path'
import run from './utils/run'
import sh from './utils/sh'
import log from './utils/log'
import { IS_ANDROID, DEFAULT_TESTS_FOLDER } from './constants'
import runAndroidEmulator from './runAndroidEmulator'

export default async function buildAndroid() {
  if (IS_ANDROID) {
    await runAndroidEmulator()

    log('BUILD ANDROID')
    const androidFolder = path.resolve(DEFAULT_TESTS_FOLDER, 'android')

    log('CLEAN PROJECT', 'info')
    run('./gradlew clean', androidFolder)

    log('REMOVE RELEASE KEYSTORE', 'info')
    sh.rm(`${androidFolder}/app/release.keystore`)

    log('GENERATE RELEASE KEYSTORE', 'info')
    const keytoolArgs = [
      '-v',
      '-genkey',
      '-destkeystore app/release.keystore',
      '-deststoretype pkcs12',
      '-storepass android',
      '-alias androidreleasekey',
      '-keypass android',
      '-keysize 1024',
      '-validity 14000',
      "-dname 'CN=Android Debug,O=Android,C=US'",
    ].join(' ')

    run(`keytool ${keytoolArgs}`, androidFolder)

    log('', 'empty') // only for beautiful stdout
    log('RUN RELEASE BUILD', 'info')
    run('./gradlew assembleRelease --console=plain -S', androidFolder)
  }
}
