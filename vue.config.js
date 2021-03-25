module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'VideApp_corr'
        return args
      })
  },

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
