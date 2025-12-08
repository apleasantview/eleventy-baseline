import headElements from "../lib/posthtml-head-elements.js";
import { getVerbose, logIfVerbose } from "../../../helpers.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function headCore(eleventyConfig, options = {}) {
	const headElementsTag = options.headElementsTag || "posthtml-head-elements";
	const verbose = getVerbose(eleventyConfig) || options.verbose || false;
	const eol = options.EOL || "\n";

	let contentMap = null;
	eleventyConfig.on("eleventy.contentMap", ({ inputPathToUrl }) => {
		contentMap = inputPathToUrl;
	});

	eleventyConfig.addGlobalData("eleventyComputed.page.head", () => {
		// if addGlobalData receives a function it will execute it immediately,
		// so we return a nested function for computed data
		return (data) => {
			const site = data.site || {};
			const page = data.page || {};
			return {
				title: data.title || site.title || "",
				description: data.description || site.tagline,
				canonical: data.canonical || page.url,
				noindex: data.noindex ?? site.noindex,
				// add og/twitter derived fields here if you want
			};
		};
	});


	const buildHeadSpec = (context) => {
		const page = context.page || {};
		const data = context.data || {};
		const site = data.site || {};
		const fromComputed = page.head || data.head || {};

		const resolveCanonical = () => {
			const explicit = fromComputed.canonical || data.canonical;
			if (explicit) return explicit;

			const url = page.url || (page.inputPath && contentMap?.[page.inputPath]?.[0]);
			if (!url) return undefined;

			if (site?.baseURL && /^https?:\/\//i.test(site.baseURL)) {
				try {
					return new URL(url, site.baseURL).toString();
				} catch {
					return url;
				}
			}
			return url;
		};

		const title = fromComputed.title ?? data.title ?? site.title ?? "";
		const description = fromComputed.description ?? data.description ?? site.tagline;
		const noindex = fromComputed.noindex ?? data.noindex ?? site.noindex;
		const canonical = resolveCanonical();

		const meta = [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
		];

		if (description) {
			meta.push({ name: "description", content: description });
		}
		if (noindex) {
			meta.push({ name: "robots", content: "noindex, nofollow" });
		}
		if (title) {
			meta.push({ property: "og:title", content: title });
			meta.push({ name: "twitter:title", content: title });
		}
		if (description) {
			meta.push({ property: "og:description", content: description });
			meta.push({ name: "twitter:description", content: description });
		}
		if (canonical) {
			meta.push({ property: "og:url", content: canonical });
			meta.push({ name: "twitter:url", content: canonical });
		}

		const link = [];
		if (canonical) {
			link.push({ rel: "canonical", href: canonical });
		}

		return {
			title,
			meta,
			link,
		};
	};

	eleventyConfig.htmlTransformer.addPosthtmlPlugin("html", function (context) {
		const headElementsSpec = buildHeadSpec(context);

		logIfVerbose(verbose, "head-core: injecting head elements for", context?.page?.inputPath || context?.outputPath);

		const plugin = headElements({
			headElements: headElementsSpec,
			headElementsTag,
			EOL: eol,
		});

		return async function asyncHead(tree) {
			return plugin(tree);
		};
	});
}

