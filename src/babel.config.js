module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '16'
      },
      modules: false // Keep ES6 modules for tree shaking
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current'
          }
        }]
      ]
    },
    gas: {
      // Custom preset for Google Apps Script
      plugins: [
        './babel-plugin-es6-to-definemodule.js'
      ]
    }
  }
};
