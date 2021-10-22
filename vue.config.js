/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    devServer: {
      disableHostCheck: true,
      compress: true,
    },
    plugins: [
      new webpack.ProvidePlugin({
        axios: 'axios',
      }),
    ],
  },
};
