const path = require('path')
const fs = require('fs-extra')
const { exec } = require('child_process')

const remote = 'git@github.com:nuxt/nuxt.js.git'
const branch = 'dev'
const commit = 'abf7db1fd3e634f759bcb1426ba4ce316f932f17'

const root = path.resolve(__dirname, '..')
const tmp = path.join(root, 'tmp')
const vendor = path.join(root, 'vendor/@nuxt')

fs.existsSync(tmp) && fs.removeSync(tmp)

if (!fs.existsSync(path.join(vendor, 'webpack'))) {
  fs.existsSync(vendor) && fs.removeSync(vendor)
  fs.mkdirpSync(tmp)
  fs.mkdirpSync(vendor)

  console.log('Downloading vendor dependencies...')

  exec(`
    git clone ${JSON.stringify(remote)} ${JSON.stringify(tmp)};
    cd ${JSON.stringify(tmp)};
    git checkout ${JSON.stringify(branch)};
    git checkout ${JSON.stringify(commit)};
  `, (error, stdout, stderr) => {
    process.stdout.write(stdout)
    if (error) return process.stderr.write(stderr)


    fs.copySync(
      path.join(tmp, 'packages/webpack'),
      path.join(vendor, 'webpack')
    )

    fs.copySync(
      path.join(tmp, 'LICENSE'),
      path.join(vendor, 'webpack/LICENSE')
    )

    fs.removeSync(tmp)
  })
}
