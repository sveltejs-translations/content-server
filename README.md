# Unoffocial Svelte's Sites Content Server

All translated content for Svelte's sites is here. This is a copy of official Svelte's API server, but it supports multilangual output.

Root of API server is `https://api.svelte.cf`. You can replace `https://api.svelte.dev` by `https://api.svelte.cf/en` in your copy of official site to get content data from this API server instead official one. Also you can request any other existing locale like `https://api.svelte.cf/ru`.

## Contributing

You can add new language in this repo or fix existing translations.

Documentation is stored under `docs/{locale}/{project}` directory. 

Currently we support two projects:
* `svelte` - main svelte site [svelte.dev](https://svelte.dev)
* `kit` - SvelteKit site [kit.svelte.dev](https://kit.svelte.dev)

### Add new translation

1. Create directory for your new locale (if not exists) under `docs` directory.
2. Create directory for project (if not exists) under `docs/{locale}` directory.
3. Copy english files from their repos, respect directories hierarchy! Also you can copy original files from `__TMP/sources/{project}` which will be creted once you run `npm run dev` or `npm run start`.
4. Make the Pull Request into this repo, and after review it will be deployed.

### Development mode

You can launch API server locally by running `npm run dev`. You will be asked for needed locale and project. The API server will update its content whenever you change files in corresponding documentation directory.

You may test API output by pointing your browser on `http://localhost:3030/{choosen_locale}/docs/{choosen_project}/docs`.

To view translation result, run Svelte or SvelteKit site in dev mode beside the API server.  Clone it from [official repo](https://github.com/sveltejs/sites) and run locally the site of choosen project. Be sure you set right API URL in `svelte.config.js` file:

```js
process.env.VITE_API_BASE = process.env.DOCS_PREVIEW
	? 'http://localhost:3030/ru'
	: 'https://api.svelte.cf/ru';

```

To test russian locale the best choice is to clone repo of localized sites from [sveltejs-translations/russian-sites](https://github.com/sveltejs-translations/russian-sites) repo. The API URL is preconfigured, so just run `npm run dev:svelte` or `npm run dev:kit` to see result.