// @ts-check

import tseslint from "typescript-eslint";

import eslint from "@eslint/js";

export default [
	{
		ignores: ["node_modules/", "public/"]
	},
	...tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module"
		},
		rules: {
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/no-require-imports": "off"
		}
	})
];
