var path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
    entry: {
        app: ["./src/snow.js"]
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "."),
        publicPath: "/",
        filename: "snow.js",
        crossOriginLoading: "anonymous"
    },
    devServer: {
        contentBase: path.join(__dirname, "assets"),
        port: 3000
    },
    module: {

    },
    plugins: [
        new UglifyJSPlugin()
    ]
};

module.exports = config;
