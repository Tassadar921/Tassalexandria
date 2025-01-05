import { defineConfig } from '@adonisjs/static';
import { AssetsConfig } from '@adonisjs/static/types';

/**
 * Configuration options to tweak the static files middleware.
 * The complete set of options are documented on the
 * official documentation website.
 *
 * https://docs.adonisjs.com/guides/static-assets
 */
const staticServerConfig: AssetsConfig = defineConfig({
    enabled: false,
    etag: true,
    lastModified: true,
    dotFiles: 'ignore',
});

export default staticServerConfig;
