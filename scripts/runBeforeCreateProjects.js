import path from 'path'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import config from './utils/config'
import { TMP_FOLDER, PROJECT } from './constants'
import log from './utils/log'
import run from './utils/run'

export default function runBeforeCreateProjects() {
  log('RUN ACTIONS FROM "beforeCreateProjects" section')
  config.get('beforeCreateProjects').forEach((action) => {
    if (isString(action)) {
      run(`${action} --prefix ${path.resolve(TMP_FOLDER, PROJECT)}`)
    }

    if (isFunction(action)) {
      action()
    }
  })
}
