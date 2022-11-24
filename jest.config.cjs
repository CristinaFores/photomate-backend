/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/loadEnvironments.ts",
    "!src/database/index.ts",
    "!src/server/startServer.ts",
  ],
  resolver: "jest-ts-webcompat-resolver",
};
