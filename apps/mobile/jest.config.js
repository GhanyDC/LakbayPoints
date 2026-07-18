module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: ["<rootDir>/.expo/", "<rootDir>/dist/"],
  moduleNameMapper: {
    "^lucide-react-native$": "<rootDir>/__mocks__/lucide-react-native.js",
  },
};
