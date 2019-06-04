"use strict";
import path = require("path");
import webpack = require("webpack");
import JasmineWebpackPlugin = require("jasmine-webpack-plugin");
console.log(__dirname);
const config: webpack.Configuration = {
    entry: "./scripts/with-unicode.js",
    output: {
        filename: "bundle.js",
        path : path.resolve(__dirname, "./out"),
    },
    devtool: "source-map",
    watch: true,
    resolve : {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module : {
        rules : [{
                test : /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test : /\.tsx?$/,
                use : ["ts-loader"]
            },
            {
                test : /\.(eot|woff|svg|ttf)/,
                use : "file-loader"
            },
            {
                test : /\.js$/,
                loader : "source-map-loader",
                enforce : "pre"
            }
        ]
    },
    plugins : [new JasmineWebpackPlugin()]

};
export = config;