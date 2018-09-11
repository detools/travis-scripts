import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import toUpper from 'lodash/toUpper'
import range from 'lodash/range'
import { ANDROID_HOME, isTravisCI, HOME } from './constants'
import config from './utils/config'
import log from './utils/log'
import run from './utils/run'
import detachedRun from './utils/detachedRun'
import killAndroidEmulator from './killAndroidEmulator'
import cleanup from './cleanup'

export default async function runAndroidEmulator() {
  cleanup(killAndroidEmulator)

  const optionsOnRead = { encoding: 'utf8', stdout: 'ignore', stderr: 'ignore' }

  log('KILL ANDROID EMULATOR')
  killAndroidEmulator()

  const selectedDevice = config.get('virtualDevice.android')
  if (!selectedDevice) {
    throw new Error('You have not selected any Android device')
  }

  if (isTravisCI) {
    log('CREATE NEW ANDROID EMULATOR', 'info')
    const android = path.resolve(ANDROID_HOME, 'tools', 'android')

    run([
      `echo no | ${android} create avd`,
      '--force',
      `--name ${selectedDevice}`,
      '--target android-21',
      '--abi armeabi-v7a',
      '--skin WVGA800',
    ].join(' '))
  }

  const emulator = path.resolve(ANDROID_HOME, isTravisCI ? 'tools' : 'emulator', 'emulator')
  const androidDevices = execSync(`${emulator} -list-avds`, optionsOnRead)
    .split('\n')
    .filter(x => x)

  if (!androidDevices.length) {
    throw new Error('There is no available Android emulators')
  }

  if (config.get('androidEmulatorNeedsWritableStorage')) {
    log('ADD TO ANDROID EMULATOR WRITABLE STORAGE', 'info')

    const pathToEmulatorConfig = path.resolve(
      HOME,
      '.android',
      'avd',
      `${selectedDevice}.avd`,
      'config.ini'
    )

    const emulatorConfig = fs.readFileSync(pathToEmulatorConfig, { encoding: 'utf8' })

    let nextConfig = emulatorConfig

    const sdCard = 'hw.sdcard'
    const sDCardPath = `${HOME}/.android/avd/${selectedDevice}.avd/sdcard.img`
    const sdCardSize = 200

    if (!fs.existsSync(sDCardPath)) {
      log('SDCARD FOR ANDROID EMULATOR DOES NOT EXIST', 'warn')

      log('', 'empty') // only for beautiful stdout
      log('CREATE SDCARD FOR ANDROID EMULATOR', 'info')

      const mksdcard = path.resolve(ANDROID_HOME, isTravisCI ? 'tools' : 'emulator', 'mksdcard')

      run(`${mksdcard} -l sdcard ${sdCardSize}M ${sDCardPath}`)
    }

    const requiredProps = [
      { key: sdCard, value: 'yes' },
      { key: 'sdcard.path', value: sDCardPath },
      { key: 'sdcard.size', value: `${sdCardSize} MB` },
      // { key: 'disk.dataPartition.size', value: '800M' },
    ]

    requiredProps.forEach(({ key, value }) => {
      if (!emulatorConfig.includes(key)) {
        nextConfig = [nextConfig, `${key}=${value}`].join('\n')
      }
    })

    const sdCardNo = `${sdCard}=no`
    const sdCardYes = sdCardNo.replace('no', 'yes')
    if (emulatorConfig.includes(sdCardNo)) {
      nextConfig = nextConfig.replace(sdCardNo, sdCardYes)
    }

    if (nextConfig !== emulatorConfig) {
      fs.writeFileSync(pathToEmulatorConfig, nextConfig)
    }
  }

  log('RUN ANDROID EMULATOR')

  log(`Available Android Devices:\n${androidDevices.join('\n')}`, 'info')

  const emulatorId = androidDevices.find(item => item === selectedDevice)
  if (!emulatorId) {
    throw new Error('Selected emulator does not exist on your machine')
  }

  log(`You have selected: ${selectedDevice}`, 'info')

  const travisAvdArguments = [
    '-scale', '96dpi',
    '-dpi-device', '160',
    '-no-audio',
    '-no-window',
  ]
  detachedRun(emulator, ['-avd', emulatorId].concat(isTravisCI ? travisAvdArguments : []))

  const adb = path.resolve(ANDROID_HOME, 'platform-tools', 'adb')
  let emulatorBooted = false
  let emulatorBootError = null
  const timeout = range(1, 360)

  async function checkAndroidEmulatorStatus() {
    const pause = () => new Promise(resolve => setTimeout(resolve, 1000))

    for (const count of timeout) {
      log(`Waiting for emulator to start (${count})`, 'warn', false)
      await pause()

      try {
        const emulatorBootStatus = execSync(
          `${adb} -e shell getprop sys.boot_completed 2>&1`,
          optionsOnRead
        )

        if (emulatorBootStatus.trim() === '1') {
          emulatorBooted = true
          break
        }
      } catch (error) {
        const stringError = JSON.stringify(error, null, 2)
        const parsedError = JSON.parse(stringError)

        emulatorBootError = toUpper(parsedError.stdout.replace('\n', ''))
      }
    }
  }

  await checkAndroidEmulatorStatus()

  if (emulatorBooted) {
    log('EMULATOR IS READY', 'info')
  } else if (emulatorBootError) {
    log(emulatorBootError, 'error')
    process.exit(1)
  }
}
