const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/whatsapp-exec-bot'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [{ input: './src/assets', glob: '**/*', output: './assets' }],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
