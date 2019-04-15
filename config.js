import path from 'path'
import HtmlPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import WebpackBaseConfig from './vendor/@nuxt/webpack/src/config/base'

export default class Config extends WebpackBaseConfig {
  constructor(...args) {
    super(...args)
    this.name = 'admin'
    this.isServer = false
    this.isModern = false
  }

  get colors() {
    return {
      ...super.colors,
      admin: 'cyan'
    }
  }

  get dev() {
    return false
  }

  get paths() {
    const {
      srcDir,
      admin: { dir = 'admin' } = {}
    } = this.buildContext.options

    return {
      entry: path.resolve(srcDir, dir),
      output: path.resolve(srcDir, 'static/admin')
    }
  }

  env() {
    return Object.assign(super.env(), {
      'process.env.VUE_ENV': JSON.stringify('client'),
      'process.browser': true,
      'process.client': true,
      'process.server': false,
      'process.modern': false,
      'process.admin': true
    })
  }

  output() {
    return {
      ...super.output(),
      path: this.paths.output,
      filename: '[hash].js',
      publicPath: '/admin'
    }
  }

  alias() {
    return {
      ...super.alias(),
      admin: path.join(__dirname, 'admin.js')
    }
  }

  plugins() {
    const { entry, output } = this.paths
    const {
      admin: { title = 'Admin' } = {}
    } = this.buildContext.options

    return [
      ...super.plugins(),
      new HtmlPlugin({ title }),
      new CopyPlugin([{
        from: path.join(entry, 'config.yml'),
        to: path.join(output, 'config.yml')
      }])
    ]
  }

  extendConfig(config) {
    config = super.extendConfig(config)

    const {
      admin: { extend = null } = {}
    } = this.buildContext.options

    if (typeof extend === 'function') {
      const extendedConfig = extend.call(
        this.builder, config, { loaders: this.loaders }
      )
      // Only overwrite config when something is returned for backwards compatibility
      if (extendedConfig !== undefined) {
        return extendedConfig
      }
    }

    return config
  }

  config(plugins = []) {
    return {
      ...super.config(),
      entry: [
        ...plugins,
        path.join(this.paths.entry, 'index.js')
      ],
      performance: {
        hints: false
      }
    }
  }
}
