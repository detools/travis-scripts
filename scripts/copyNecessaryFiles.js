import fs from 'fs'
import path from 'path'
import { PROJECT, IS_RN_VERSION_BEFORE_49, ORIGINAL_FOLDER, TMP_FOLDER } from './constants'
import config from './utils/config'
import log from './utils/log'
import sh from './utils/sh'

export default function copyNecessaryFiles() {
  log(`COPY NECESSARY FILES FROM ${PROJECT} PROJECT TO tmp/${PROJECT}`, 'info')
  const FILES_TO_COPY = config.get('filesToCopy')
    .concat(IS_RN_VERSION_BEFORE_49
      ? ['index.ios.js', 'index.android.js']
      : ['index.js']
    )

  FILES_TO_COPY.forEach((fileName) => {
    const fromPath = path.resolve(ORIGINAL_FOLDER, fileName)
    const toPath = path.resolve(TMP_FOLDER, PROJECT, fileName)

    if (fs.existsSync(fromPath)) {
      sh.cp(fromPath, toPath)
    } else {
      log(`FILE ${fromPath} DOES NOT EXIST`, 'warn')
    }
  })
}
