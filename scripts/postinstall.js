import fs from 'fs'
import path from 'path'

// Point to project root
const getFilepath = filename => path.resolve(process.cwd(), '..', '..', filename)
const detools = {
  path: getFilepath('.detoolsrc.js'),
  content: [
    'export default {',
    "  // Default value — { ios: '', android: '' }",
    '  test: {',
    "    ios: 'npm run test:ios',",
    "    android: 'npm run test:android',",
    '  },',
    '}',
  ].join('\n'),
}
const travis = {
  path: getFilepath('.travis.yml'),
  content: fs.readFileSync(path.resolve(process.cwd(), '.travis.yml')),
}

const files = [detools, travis]

files.forEach((file) => {
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content)
  }
})
