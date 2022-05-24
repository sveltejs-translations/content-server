---
title: Переход с Sapper
rank: 1
---

SvelteKit является преемником Sapper и разделяет многие элементы своего дизайна.

Если у вас есть существующее приложение Sapper, которое вы планируете перенести на SvelteKit, вам нужно будет внести ряд изменений. Возможно, вам будет полезно просмотреть [некоторые примеры](/docs#dopolnitelnye-resursy-primery) во время миграции.

### package.json

#### type: "module"

Добавьте `"type": "module"` в свой `package.json`. Вы можете сделать этот шаг отдельно от остальных в рамках инкрементной миграции, если вы используете Sapper 0.29.3
Или новее.

#### dependencies

Удалите `polka` или `express`, если вы используете один из них, и любое промежуточное программное обеспечение, такое как `sirv` или `compression`.

#### devDependencies

Удалите `sapper` из вашего `devDependencies` и замените его на `@sveltejs/kit` и любой [адаптер](/docs#adaptery), который вы планируете использовать (см. [следующий раздел](/docs#perehod-s-sapper-fajly-proekta-konfiguracziya)).

#### scripts

Любые скрипты, которые ссылаются на `sapper`, должны быть обновлены:

- `sapper build` должен стать [`svelte-kit build`](- `sapper export` должен стать [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) с помощью статического [адаптера](/docs#adaptery)
) с помощью узла [адаптер](/docs#adaptery)
- `sapper export` должен стать [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) с помощью статического [адаптера](/docs#adaptery)
- `sapper dev` должен стать [`svelte-kit dev`](/docs#svelte-kit-cli-svelte-kit-dev)
- `node __sapper__/build` должен стать `node build`

### Файлы проекта

Основная часть вашего приложения в `src/routes` может быть оставлена там, где оно находится, но несколько файлов проекта необходимо будет переместить или обновить.

#### Конфигурация

Ваш `webpack.config.js` или `rollup.config.js` следует заменить на `svelte.config.js`, как описано [здесь](/docs#konfiguracziya). Параметры препроцессора Svelte следует переместить в `config.preprocess`.

Вам нужно будет добавить [адаптер](/docs#adaptery). `sapper build` примерно эквивалентен [adapter-node](https://github.com/sveltejs/kit/tree/master/packages/adapter-node), в то время как `sapper export` примерно эквивалентен [adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static), хотя вы можете предпочесть использовать адаптер, предназначенный для платформы, на которую развертываете.

Если вы использовали плагины для типов файлов, которые не обрабатываются автоматически [Vite](https://vitejs.dev), вам нужно будет найти эквиваленты Vite и добавить их в [Vite config](/docs#konfiguracziya-vite).

#### src/client.js

Этот файл не имеет эквивалента в SvelteKit. Любая пользовательская логика (помимо `sapper.start(...)`) должна быть выражена в файле `__layout.svelte` внутри обратного вызова `onMount`.

#### src/server.js

При использовании `adapter-node` эквивалентом является [пользовательский сервер](https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server). В противном случае этот файл не имеет прямого эквивалента, так как приложения SvelteKit могут работать в бессерверных средах. Тем не менее, вы можете использовать [хуки](/docs#huki) для реализации логики сеанса.

#### src/service-worker.js

Большинство импортов из `@sapper/service-worker` имеют эквиваленты в [`$service-worker`](/docs#moduli-$service-worker):

- `файлы` не изменились
- `routes` был удален
- `shell` теперь `build`
- `timestamp` теперь `version`

#### src/template.html

Файл `src/template.html` должен быть переименован в `src/app.html`.

Удалите `%sapper.base%`, `%sapper.scripts%` и `%sapper.styles%`. Замените `%sapper.head%` на `%sveltekit.head%` и `%sapper.html%` на `%sveltekit.body%`. `<div id="sapper">` больше не нужен.

#### src/node_modules

Распространенным шаблоном в приложениях Sapper является размещение внутренней библиотеки в каталоге внутри `src/node_modules`. Это не работает с Vite, поэтому вместо этого мы используем [`src/lib`](/docs#moduli-$lib).

### Страницы и макеты

#### Переименованные файлы

Ваш пользовательский компонент страницы ошибок должен быть переименован с `_error.svelte` в `__error.svelte`. Любые файлы `_layout.svelte` также должны быть переименованы в `__layout.svelte`. Префикс двойного подчеркивания зарезервирован для SvelteKit; ваши собственные [приватные модули](/docs#marshruty-privatnye-moduli) по-прежнему обозначаются одним префиксом `_` (настраивается через конфигурацию [`routes`](/docs#konfiguracziya-routes)).

#### Импорты

Импорт `goto`, `prefetch` и `prefetchRoutes` из `@sapper/app` должен быть заменен идентичным импортом из [`$app/navigation`](/docs#moduli-$app-navigation).

Импорт `stores` из `@sapper/app` должен быть заменен — см. раздел [Хранилища](/docs#perehod-s-sapper-straniczy-i-makety-hranilishha) ниже.

Любые файлы, которые вы ранее импортировали из каталогов в `src/node_modules`, необходимо будет заменить импортом [`$lib`](/docs#moduli-$lib).

#### Предзагрузка

Как и раньше, страницы и макеты могут экспортировать функцию, которая позволяет загружать данные до начала рендеринга.

Эта функция была переименована с `preload` в [`load`](/docs#zagruzka-dannyh), и ее API изменился. Вместо двух аргументов — «page» и «session» — есть один аргумент, который включает в себя оба, а также `fetch` (который заменяет `this.fetch`), так и новый объект `stuff`.

Больше нет объекта `this`, и, следовательно, нет `this.fetch`, `this.error` или `this.redirect`. Вместо того, чтобы возвращать реквизит напрямую, `load` теперь возвращает объект, который _содержит_ `props`, наряду с различными другими вещами.

Наконец, если на вашей странице есть метод «load», обязательно верните что-то, иначе вы получите «Не найдено».

#### Хранилища

В Sapper вы получите ссылки на предоставленные магазины следующим образом:

```js
// @filename: ambient.d.ts
declare module '@sapper/app';

// @filename: index.js
// ---cut---
import { stores } from '@sapper/app';
const { preloading, page, session } = stores();
```

Хранилища `page` и `session` все еще существуют; `preloading` было заменено хранилищем `navigating`, которое содержит свойства `from` и `to`. `page` теперь имеет свойства `url` и `params`, но не имеет `path` или `query`.

Вы получаете к ним доступ по-разному в SvelteKit. `stores` теперь `getStores`, но в большинстве случаев это не нужно, так как вы можете импортировать `navigating`, `page` и `session` непосредственно из [`$app/stores`](/docs#moduli-$app-stores).

#### Маршрутизация

Маршруты Regex больше не поддерживаются. Вместо этого используйте [сопоставление маршрутов](#marshruty-rasshirennaya-marshrutizacziya-sopostavlenie).

#### Сегменты

Ранее компоненты макета получал свойство `segment`, указывающее на дочерний сегмент. Это было удалено; теперь можно использовать более гибкое значение `$page.url.pathname`, чтобы получить сегмент.

#### URLs

В Sapper все относительные URL-адреса разрешались по базовому URL-адресу — обычно `/`, если не использовалась опция `basepath`, а не по отношению к текущей странице.

Это вызвало проблемы и в SvelteKit относительные URL-адреса разрешаются для текущей страницы (или целевой страницы для URL-адресов `fetch` в функциях `load`). В большинстве случаев проще использовать URL-адреса относительно корня (т.е. начинается с `/`), так как их значение не зависит от контекста.

#### Атрибуты ссылок

- `sapper:prefetch` теперь `sveltekit:prefetch`
- `sapper:noscroll` теперь `sveltekit:noscroll`

### Эндпоинты

В Sapper «маршруты сервера», теперь называемые [эндпоинтами](/docs#marshruty-endpointy), получили объекты `req` и `res`, предоставляемые модулем Node `http` (или дополненными версиями, предоставляемыми такими фреймворками, как Polka и Express).

SvelteKit разработан так, чтобы быть независимым в отношении того, где работает приложение - оно может работать на сервере Node, но в равной степени может работать на бессерверной платформе или в Cloudflare Worker. По этой причине вы больше не взаимодействуете напрямую с `req` и `res`. Ваши конечные точки должны быть обновлены в соответствии с новой подписью.

Для поддержки этого поведения, независимого от среды, `fetch` теперь доступен в глобальном контексте, поэтому вам не нужно импортировать `node-fetch`, `cross-fetch` или аналогичные реализации выборки на стороне сервера, чтобы использовать его.

### Интеграции

Подробную информацию об интеграциях см. в разделе [FAQ](/faq#integrations).

#### HTML minifier

Sapper по умолчанию включает `html-minifier`. SvelteKit не включает это, но его можно добавить в качестве [хука](/docs#huki-handle):

```js
// @filename: ambient.d.ts
/// <reference types="@sveltejs/kit" />
declare module 'html-minifier';

// @filename: index.js
// ---cut---
import { minify } from 'html-minifier';
import { prerendering } from '$app/env';

const minification_options = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	html5: true,
	ignoreCustomComments: [/^#/],
	minifyCSS: true,
	minifyJS: false,
	removeAttributeQuotes: true,
	removeComments: true,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true
};

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);

	if (prerendering && response.headers.get('content-type') === 'text/html') {
		return new Response(minify(await response.text(), minification_options), {
			status: response.status,
			headers: response.headers
		});
	}

	return response;
}
```

Обратите внимание, что `prerendering` имеет значение `false` при использовании `svelte-kit preview` для тестирования производственной сборки сайта, поэтому для проверки результатов минимизирования вам нужно будет напрямую проверить собранные HTML-файлы.
