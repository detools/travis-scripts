import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import castArray from 'lodash/castArray'
import config from './config'
import log from './log'
import run from './run'

export default function runHook(name, folders) {
  castArray(folders).forEach((folder) => {
    log(`RUN ACTIONS FROM "${name}" section in "${folder}"`)
    config.get(name).forEach((action) => {
      if (isString(action)) {
        run(`${action} --prefix ${folder}`)
      }

      if (isFunction(action)) {
        action()
      }
    })
  })
}
