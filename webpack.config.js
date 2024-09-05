const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: '/src/js/main.js', // Pfad zur Haupt-JS-Datei, // Erste JS-Datei
  secondary: '/src/js/adressAPI.js', // Zweite JS-Datei
  output: {
    path: path.resolve(__dirname, 'public'), // Gebaute Dateien werden in den public Ordner kopiert
    filename: 'bundle.js', // Der Name der gebauten JS-Datei
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Falls du CSS importierst
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // Für Bilder
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '/public/index.html', // Deine index.html Datei
    }),
  ],
  mode: 'production', // oder 'development' für die Entwicklungsumgebung
};
