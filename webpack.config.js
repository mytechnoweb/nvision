const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point - where React app starts
  entry: './frontend/src/index.js',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'frontend/dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  
  // Module rules for different file types
  module: {
    rules: [
      {
        // Handle JavaScript and JSX files
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        // Handle CSS files
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // Handle image files
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  
  // Resolve file extensions
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  
  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './frontend/public/index.html',
      filename: 'index.html'
    })
  ],
  
  // Development server configuration
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/register': 'http://localhost:8080'
    }
  },
  
  // Mode (will be overridden by --mode in package.json)
  mode: 'development'
};