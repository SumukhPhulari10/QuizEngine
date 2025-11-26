import nextConfig from "eslint-config-next"

const baseConfig = typeof nextConfig === "function" ? nextConfig() : nextConfig

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  ...baseConfig,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
]

export default config

