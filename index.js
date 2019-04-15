import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import webpack from 'webpack'
import { Builder } from 'nuxt'
import Config from './config'

export default function () {
  const {
    srcDir,
    admin: {
      dir = 'admin',
      lazy = false
    } = {}
  } = this.options

  const config = new Config(new Builder(this.nuxt).getBundleBuilder())
  const { entry, output } = config.paths

  this.options.watch.push(path.join(entry, '**/*'))

  this.addPlugin({
    src: path.resolve(__dirname, 'identity.js'),
    mode: 'client'
  })

  this.nuxt.hook('build:before', () => new Promise((resolve, reject) => {
    if (lazy && fs.existsSync(path.join(output, 'index.html'))) {
      consola.info('Skipping admin build: already done and lazy mode enabled.')
      return resolve()
    }

    if (fs.existsSync(output)) fs.removeSync(output)

    webpack(config, (errors, stats) => {
      const infos = stats.toJson()
      infos.errors = (errors ? [errors] : []).concat(infos.errors)

      if (infos.warnings.length) {
        consola.warn(infos.warnings.join('\n'))
      }

      if (infos.errors.length) {
        return reject(infos.errors.join('\n'))
      }

      resolve()
    })
  }))
}
