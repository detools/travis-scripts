import isEmpty from 'lodash/isEmpty'
import config from './utils/config'
import log from './utils/log'

export default function checkRequiredVariables() {
  log('CHECK "requiredVariables"')

  config.get('requiredVariables').forEach((variable) => {
    if (isEmpty(process.env[variable])) {
      throw new Error(`Need to set environment variable "${variable}"`)
    }
  })
}
