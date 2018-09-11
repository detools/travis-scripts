import fs from 'fs'
import path from 'path'
import last from 'lodash/last'
import { spawn } from 'child_process'
import { CWD, DEFAULT_TESTS_FOLDER } from '../constants'
import run from './run'

export default function detachedRun(command, args = [], directory = CWD) {
  const commandName = last(command.split('/'))

  const [out, error] = ['out', 'error'].map((name) => {
    const pathToFile = path.resolve(DEFAULT_TESTS_FOLDER, '..', `${commandName}_${name}.log`)
    run(`touch ${pathToFile}`)

    return fs.openSync(pathToFile, 'a')
  })

  const options = {
    cwd: directory,
    stdio: ['ignore', out, error],
    detached: true,
  }

  spawn(command, args, options).unref()
}
