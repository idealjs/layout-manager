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
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
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
        "@idealjs/layout-manager",
        "@idealjs/portal-window",
        "@idealjs/sns-react",
        "@idealjs/dnd-react",
        "react",
        "react/jsx-runtime",
        "react-dom",
    ],
    plugins: [new BundleAnalyzerPlugin({ analyzerMode: "static" })],
};
