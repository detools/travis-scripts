import path from 'path'
import range from 'lodash/range'
import isString from 'lodash/isString'
import { readFileSync, writeFileSync } from 'fs'
import { TMP_FOLDER, PROJECT } from './constants'

const originialConfig = {
  signingConfigs: {
    release: {
      storeFile: 'file("release.keystore")',
      storePassword: '"android"',
      keyAlias: '"androidreleasekey"',
      keyPassword: '"android"',
    },
  },
}

const linkToSigninConfig = 'signingConfig signingConfigs.release'
const proguardFilesLine = (
  'proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"'
)

function generateConfig(object, spacing = 4, firstLine) {
  const spaces = range(spacing).map(() => ' ').join('')
  const content = Object.entries(object).map(([key, value]) => {
    const keyIsString = isString(value)

    let nestedConfig

    if (!keyIsString) {
      nestedConfig = generateConfig(value, spacing + 4)
    }

    const leftSpaces = !firstLine ? spaces : ''

    return `${leftSpaces}${key} ${keyIsString ? value : `{\n${nestedConfig}\n${spaces}}`}`
  }).join('\n')

  return content
}


export default function updateBuildGradle() {
  const buildGradle = path.resolve(TMP_FOLDER, PROJECT, 'android', 'app', 'build.gradle')
  const spaces = count => range(count).map(() => ' ').join('')

  const signinConfigMarker = 'buildTypes {'
  const content = readFileSync(buildGradle, { encoding: 'utf-8' })
  const signinConfig = generateConfig(originialConfig, 4, true)

  const nextConfig = content
    .replace(signinConfigMarker, `${signinConfig}\n${spaces(4)}${signinConfigMarker}`)
    .replace(proguardFilesLine, `${proguardFilesLine}\n${spaces(12)}${linkToSigninConfig}`)

  writeFileSync(buildGradle, nextConfig)
}
