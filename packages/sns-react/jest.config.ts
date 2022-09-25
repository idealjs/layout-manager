import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {},
};

export default config;
