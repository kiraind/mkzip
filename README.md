# mkzip

CLI util for making zip-archives from NodeJS packages

## CLI usage

Execute in your package folder:

```sh
npx mkzip
```

This will put archive of your package at `./zips/<version>.zip` and add `./zips/latest.zip`
symlink pointing to the latest archive.

Exclude files from archive by listing them in `.zipignore`. `zips` and `.zipignore` are excluded by default.

Can also be used programmatically:

```js
const mkzip = require('mkzip')

// rootPath — path to your project, default: process.cwd()
// targetPath — path to folder with zips, default: ${process.cwd()}/zips
mkzip({ rootPath, targetPath })
```
