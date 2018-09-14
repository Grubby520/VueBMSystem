module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  // 'extends': [
  //   'plugin:vue/essential',
  //   // '@vue/standard'
  // ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eol-last': 0,
    'space-before-function-paren': 0,
    'eqeqeq': 0
  },
  globals: {
    '$': true
  },
  // parserOptions: {
  //   parser: 'babel-eslint'
  // }
}