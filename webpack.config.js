const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.svg/,
                type: "asset/inline",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    externals: ["react", "react-dom", "@reduxjs/toolkit"],
};
