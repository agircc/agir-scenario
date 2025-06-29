import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Limit file length to 300 lines
      "max-lines": ["error", {
        max: 300,
        skipBlankLines: true,
        skipComments: true
      }]
    }
  }
];

export default eslintConfig;
