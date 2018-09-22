const path = require('path')
const { execSync } = require('child_process')
const packageJSON = require('../../package.json')

const rootDirectory = path.join(__dirname, '../..')

// 1. Remove all *.tgz before install
execSync('rm -rf *.tgz', { cwd: rootDirectory })

// 2. Do npm pack
execSync('npm pack', { cwd: rootDirectory })

const name = packageJSON.name.replace('@', '').replace('/', '-')

// 3. Rename .tgz to tipsi-router-latest.tgz
execSync(`mv ${name}-${packageJSON.version}.tgz ${name}-latest.tgz`, { cwd: rootDirectory })
