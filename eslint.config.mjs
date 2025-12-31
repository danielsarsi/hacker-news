import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      ".cache/**",
      "public/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
