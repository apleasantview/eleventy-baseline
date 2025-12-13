import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig, options = {}) {
	const userOptions = {
		enableVirtualTemplate: process.env.ELEVENTY_ENV !== "production",
		...options
	};

	eleventyConfig.addNunjucksGlobal("_navigator", function () { return this; });
	eleventyConfig.addNunjucksGlobal("_context", function () { return this.ctx; });

	if (userOptions.enableVirtualTemplate) {
		// Read virtual template synchronously; Nunjucks pipeline here is sync-only.
		const templatePath = path.join(__dirname, "../templates/navigator-core.html");
		const virtualTemplateContent = fs.readFileSync(templatePath, "utf-8");

		eleventyConfig.addTemplate("navigator-core.html", virtualTemplateContent, {
			permalink: "/navigator-core.html",
			title: "Navigator Core",
			description: "",
		});
	}
}
