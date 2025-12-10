/* Site config */
import "dotenv/config";

import baseline from "./_baseline/eleventy.config.js";
import { config as _config } from "./_baseline/eleventy.config.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	// Import baseline
	eleventyConfig.addPlugin(baseline({
		verbose: false,
		Bob: "My number one guy."
	}));

	eleventyConfig.addCollection("docs", function (collectionApi) {
		const docs = collectionApi.getFilteredByGlob("src/content/en/docs/**/*.md");
		return docs.sort(function (a, b) {
			return a.inputPath.localeCompare(b.inputPath);
		});
	});
};

export const config = _config;
