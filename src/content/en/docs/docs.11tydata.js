export default {
	layout: "layouts/page.njk",
	random: "Random string",
	permalink: function ({title, page}) {
		// Skip if this is a data file.
		if (page.inputPath.includes('11tydata.js')) {
			return false;
		}

		// Ensure we have a title to work with.
		if (!title) {
			console.warn(`Warning: No title found for ${page.inputPath}`);
			return false;
		}

		try {
			// Create the slugified path.
			const slugifiedTitle = this.slugify(title);
			return `/docs/${slugifiedTitle}/`;
		} catch (error) {
			console.error(`Error generating permalink for ${page.inputPath}:`, error);
			return false;
		}
	},
}
