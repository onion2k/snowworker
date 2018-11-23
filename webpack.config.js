var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SriPlugin = require ('webpack-subresource-integrity');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: {
        app: ["./src/snow.js"]
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
        filename: "snow.js",
        crossOriginLoading: "anonymous"
    },
    devServer: {
        contentBase: path.join(__dirname, "assets"),
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.(glsl|frag|vert|html)$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ]),
        // new UglifyJSPlugin(),
        new HtmlWebpackPlugin({ template: 'assets/index.html' }),
        new ExtractTextPlugin("snowfall.css"),
    ]
};

if (process.env.NODE_ENV === 'build' || process.env.NODE_ENV === 'release') {
    config.plugins.push(
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
            enabled: true
        })
    );
}

if (process.env.NODE_ENV === 'release') {
    config.plugins.push(
        new CopyWebpackPlugin([
            { from: './build/snowjs', to: '../dist/snow.js' }
        ])
    )
}

module.exports = config;
