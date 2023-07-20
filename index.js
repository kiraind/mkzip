const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const zipper = require('zip-local')

module.exports = function({ rootPath, targetPath } = {}) {
  const packageJsonPath = path.join(rootPath ?? process.cwd(), 'package.json')
  const zipignorePath = path.join(rootPath ?? process.cwd(), '.zipignore')
  const zipsPath = targetPath ?? path.join(process.cwd(), 'zips')
  
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found')
  }
  
  const { version } = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  )
  
  const ignoredPaths = [
    ...(
      fs.existsSync(zipignorePath)
        ? fs.readFileSync(zipignorePath, 'utf-8')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line !== '')
          .filter(line => !line.startsWith('#'))
        : []
    ),
    'zips',
    '.zipignore'
  ]
  
  const tmpDir = tmp.dirSync().name
  fs.cpSync('.', tmpDir, { recursive: true })
  
  ignoredPaths.forEach(ignoredPath => {
    const deletedPath = path.join(tmpDir, ignoredPath)
  
    if (fs.existsSync(deletedPath)) {
      fs.rmSync(deletedPath, { recursive: true })
    }
  })
  
  const zipPath = path.join(zipsPath, `${version}.zip`)
  const latestZipPath = path.join(zipsPath, 'latest.zip')
  
  fs.mkdirSync(zipsPath, { recursive: true })
  zipper.sync.zip(tmpDir).compress().save(zipPath)
  
  if (fs.existsSync(latestZipPath)) {
    fs.unlinkSync(latestZipPath)
  }
  fs.symlinkSync(zipPath, latestZipPath)    
}
