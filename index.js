import path from 'path'
import fs from 'fs-extra'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import consola from 'consola'
import yaml from 'js-yaml'

const dir = path.join(path.dirname(require.main.filename), '../../../admin')
const dist = path.join(path.dirname(require.main.filename), '../../../static/admin')

export const config = yaml.safeLoad(fs.readFileSync(
  path.join(dir, 'config.yml'),
  'utf-8'
))

export default function ({ title = 'Admin', lazy = false } = {}) {
  let webpackConfig

  this.extendBuild((config, { isClient }) => {
    if ((!lazy || !fs.existsSync(path.join(dist, 'index.html'))) && process.env.NODE_ENV === 'production' && isClient) {
      webpackConfig = config
    }

    config.resolve.alias.admin = path.join(__dirname, 'client')
  })

  this.nuxt.hook('build:compile', () => {
    if (!webpackConfig) return

    consola.info('Admin build')

    if (fs.existsSync(dist)) fs.removeSync(dist)

    return new Promise((resolve, reject) => {
      webpack({
        ...webpackConfig,
        entry: {
          admin: path.join(dir, 'index.js')
        },
        output: {
          filename: '[hash].js',
          path: dist
        },
        optimization: {
          ...webpackConfig.optimization,
          splitChunks: false
        },
        plugins: [
          ...webpackConfig.plugins.filter(plugin => !(
            plugin instanceof HtmlWebpackPlugin
          )),
          new HtmlWebpackPlugin({ title }),
          new CopyWebpackPlugin([{
            from: path.join(dir, 'config.yml'),
            to: path.join(dist, 'config.yml')
          }])
        ]
      }, (error) => {
        if (error) {
          consola.error(`Admin build failed: ${error}`)
          reject(error)
        } else {
          consola.success('Admin built')
          resolve()
        }
      })

      webpackConfig = null
    })
  })
}
