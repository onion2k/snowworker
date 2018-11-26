var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: {
        app: ["./src/snow.js"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
        filename: "snow.js",
        crossOriginLoading: "anonymous"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ]),
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({ template: 'assets/index.html' }),
        new ExtractTextPlugin("snowfall.css"),
    ]
};

module.exports = config;