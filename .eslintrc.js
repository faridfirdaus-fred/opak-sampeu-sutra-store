module.exports = {
  extends: ["next/core-web-vitals"],
  ignorePatterns: ["lib/generated/**/*"],
  rules: {
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-require-imports": "off",
  },
};
