const path = require("path");

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
    mode: "production",
    entry: "./index.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: path.resolve(
                            __dirname,
                            "tsconfig.build.json"
                        ),
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack", "file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "react/jsx-runtime": "react/jsx-runtime.js",
        },
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
        filename: "index.js",
    },
    externals: [
        "@idealjs/drag-drop",
        "@idealjs/sns",
        "@idealjs/entity",
        "events",
        "nanoid",
        "react",
        "react/jsx-runtime",
    ],
    plugins: [new BundleAnalyzerPlugin({ analyzerMode: "static" })],
};
