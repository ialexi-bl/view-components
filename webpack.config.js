module.exports = {
  entry: './src/index.js',
  output: {
    filename: './index.js',
    libraryTarget: 'commonjs2'
  },
  mode: 'production',
  externals: {
    react: {
      amd: 'react',
      commonjs: 'react',
      root: 'React',
      commonjs2: 'react'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
