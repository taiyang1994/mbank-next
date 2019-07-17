var path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@': path.join(__dirname, 'src'),
        '@cube-ui': path.join(__dirname, 'src/components/cube-ui/src/modules'),
        '@mand-mobile': path.join(__dirname, 'src/components/mand-mobile/modules')
      }
    }
  }
};
