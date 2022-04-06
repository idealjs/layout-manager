const path = require("path");

module.exports = {
    webpack: {
        configure: (webpackConfig, { paths }) => {
            const tsLoader = {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                loader: require.resolve("ts-loader"),
                options: {
                    transpileOnly: true,
                    configFile: path.resolve(__dirname, "tsconfig.json"),
                },
            };
            webpackConfig.module.rules.push(tsLoader);
            return webpackConfig;
        },
    },
};
