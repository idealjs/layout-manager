const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compiler: "ttypescript",
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack", "url-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "react/jsx-runtime": "react/jsx-runtime.js",
        },
        plugins: [new TsconfigPathsPlugin()],
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        libraryTarget: "umd",
        filename: "index.js",
    },
    externals: ["react", "events"],
    plugins: [new BundleAnalyzerPlugin({ analyzerPort: 8081 })],
};
