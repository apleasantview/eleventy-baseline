// Eleventy plugins
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

// Custom plugins
import navigatorCore from "./modules/navigator-core/plugins/navigator-core.js";
import assetsCore from "./modules/assets-core/plugins/assets-core.js";
import assetsPostCSS from "./modules/assets-postcss/plugins/assets-postcss.js";
import assetsESBuild from "./modules/assets-esbuild/plugins/assets-esbuild.js";
import headCore from "./modules/head-core/plugins/head-core.js";

export default {
	EleventyHtmlBasePlugin,
	syntaxHighlight,
	navigatorCore,
	assetsCore,
	assetsPostCSS,
	assetsESBuild,
	headCore
};
