import log from './utils/log'
import removeTestsFolders from './removeTestsFolders'
import removeExistingTarball from './removeExistingTarball'
import killAppium from './killAppium'

function exitHandler() {
  removeTestsFolders()
  removeExistingTarball()
  killAppium()
}

export default (callback = exitHandler) => {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  process.on('cleanup', callback)

  process.on('exit', () => {
    process.emit('cleanup')
  })

  // catch ctrl+c event and exit normally
  process.on('SIGINT', () => {
    log('Ctrl+C...', 'error')
    process.exit(2)
  })

  // catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (error) => {
    log('Uncaught Exception...', 'error')
    log(error.stack, 'error')
    process.exit(1)
  })

  // catch unhandled rejection, trace, then exit normally
  process.on('unhandledRejection', (error) => {
    log('Unhandled Rejection...', 'error')
    log(error.stack, 'error')
    process.exit(1)
  })
}
