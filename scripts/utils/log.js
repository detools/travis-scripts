import chalk from 'chalk'
import { isTravisCI } from '../constants'

export default function log(anything, type = 'title', needToCreateANewLine = true) {
  const colors = {
    info: chalk.green,
    warn: chalk.yellow,
    error: chalk.red.bold,
    title: chalk[isTravisCI ? 'white' : 'black'].bgCyan.bold.underline,
  }

  /* eslint-disable no-console */
  const color = colors[type]
  if (color) {
    const time = new Date().toLocaleTimeString()

    console.log(color(`${time} | ${anything}`))
    if (needToCreateANewLine) {
      console.log()
    }
  } else {
    console.log(anything)
    if (needToCreateANewLine) {
      console.log()
    }
  }
}
