import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const tsRecommendedRules = tseslint.configs?.recommended?.rules ?? {};
const reactRecommendedRules =
  react.configs?.flat?.recommended?.rules ??
  react.configs?.recommended?.rules ??
  {};
const reactHooksRecommendedRules = reactHooks.configs?.recommended?.rules ?? {};

export default [
  {
    ignores: [
      ".expo/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "src/shared/api/*.generated.ts",
      "scripts/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}", "*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...tsRecommendedRules,
      ...reactRecommendedRules,
      ...reactHooksRecommendedRules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
    },
  },
  // Allow React Navigation global namespace augmentation
  {
    files: ["src/app/navigation/types.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  // Allow `require()` in test mocks and asset index files
  {
    files: [
      "**/*.test.{ts,tsx}",
      "src/mocks/**",
      "src/shared/assets/images/index.ts",
      "src/**/*.polyfills.ts",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Allow `any` in catch clauses across the codebase (common for error handling)
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
    },
  },
  // Allow `any` in test files, mocks, and polyfills (must come after catch-all)
  {
    files: ["**/*.test.{ts,tsx}", "src/mocks/**", "src/**/*.polyfills.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // FSD import boundaries — entities may only import shared/, entities/, app/
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@features/**",
                "@widgets/**",
                "@pages/**",
                "@store/api/**",
              ],
              message:
                "entities/ may only import from shared/, entities/, and app/",
            },
          ],
        },
      ],
    },
  },
  // FSD import boundaries — features may only import shared/, entities/, app/, features/
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@widgets/**", "@pages/**", "@store/api/**"],
              message:
                "features/ may only import from shared/, entities/, app/, and other features/",
            },
          ],
        },
      ],
    },
  },
  // FSD import boundaries — widgets may import shared/, entities/, app/, widgets/, features/
  // (widgets sometimes compose features; e.g. BookSwipeStack builds on swipe-book feature)
  {
    files: ["src/widgets/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@pages/**", "@store/api/**"],
              message:
                "widgets/ may only import from shared/, entities/, app/, widgets/, and features/",
            },
          ],
        },
      ],
    },
  },
  // FSD import boundaries — pages may only import shared/, entities/, widgets/, features/, app/
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@pages/**"],
              message: "pages/ must not import from other pages/",
            },
            {
              group: ["@store/api/**"],
              message: "pages/ must not import from store/api/",
            },
          ],
        },
      ],
    },
  },
  // FSD import boundaries — shared may only import shared/ and app/
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@entities/**",
                "@features/**",
                "@widgets/**",
                "@pages/**",
                "@store/api/**",
              ],
              message: "shared/ may only import from shared/ and app/",
            },
          ],
        },
      ],
    },
  },
  // Allow store config and tests to import without FSD restrictions
  {
    files: ["src/store/**/*.ts", "tests/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];
