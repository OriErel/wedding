const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const SRC_PATH = path.join(__dirname, "..");

module.exports = {
  entry: {
    app: ["@babel/polyfill", "./src/index.js"]
  },
  context: SRC_PATH,
  output: {
    publicPath: "/",
    filename: "[name].[hash:10].bundle.js",
    path: path.resolve(SRC_PATH, "dist")
  },
  resolve: {
    extensions: [".js"]
  },
  performance: { hints: false },
  plugins: [
    new webpack.NamedModulesPlugin(),

    new HtmlWebpackPlugin({
      title: "Wedding",
      template: path.resolve(SRC_PATH, "public", "index.html"),
      favicon: path.resolve(SRC_PATH, "public", "favicon.ico")
    }),
    new WebpackPwaManifest({
      name: "Wedding",
      short_name: "WED",
      description: "Wedding App",
      background_color: "#cfcfcf",
      theme_color: "#cfcfcf",
      "theme-color": "#cfcfcf",
      display: "standalone",
      inject: true,
      fingerprints: true,
      ios: {
        "apple-mobile-web-app-title": "Wedding",
        "apple-mobile-web-app-status-bar-style": "white"
      }
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      cacheId: "wedding-app",
      swDest: "wedding-sw.js",
      clientsClaim: true,
      exclude: [/\.map$/, /manifest\.json$/],
      importWorkboxFrom: "cdn",
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /api/, as they're likely an API call
        new RegExp("^/api/"),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp("/[^/]+\\.[^/]+$")
      ]
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          chunks: "initial"
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 50000,
            mimetype: "application/font-woff",
            name: "./fonts/[name].[ext]"
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "assets/[name].[ext]"
          }
        }
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  }
};
