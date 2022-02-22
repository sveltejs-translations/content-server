---
title: Хуки
---

Необязательный файл `src/hooks.js` (или `src/hooks.ts`, или `src/hooks/index.js`) может экспортировать четыре функции, которые будут запускаться на сервере — `handle`, `handleError`, `getSession` и `externalFetch`.

> Расположение этого файла может быть [настроено](#konfiguracziya-files) в опции `config.kit.files.hooks`

### handle

Эта функция запускается каждый раз, когда SvelteKit получает запрос и формирует ответ. Это может происходить во время работы приложения или во время [предварительной отрисовки](#parametry-straniczy-prerender). Она получает объект `event`, представляющий запрос, и функцию `resolve`, которая вызывает маршрутизатор SvelteKit и генерирует ответ (отображает страницу или вызывает эндпоинт). Это позволяет изменять заголовки или тело ответов или полностью обойти SvelteKit (например, для программной реализации эндпоинтов).

```js
/// file: src/hooks.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event.request.url.startsWith('/custom')) {
		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
}
```

> Запросы статический ресурсов, включая предварительно отрисованные страницы, _не_ обрабатываются SvelteKit.

Если не реализовано, по умолчанию используется `({ event, resolve }) => resolve(event)`. Чтобы добавить пользовательские данные к запросу, который передается конечным точкам, заполните объект `event.locals`, как показано ниже.

```js
/// file: src/hooks.js
// @filename: ambient.d.ts
type User = {
	name: string;
}

declare namespace App {
 	interface Locals {
 		user: User;
 	}
 	interface Platform {}
 	interface Session {}
 	interface Stuff {}
}

const getUserInformation: (cookie: string | null) => Promise<User>;

// declare global {
// 	const getUserInformation: (cookie: string) => Promise<User>;
// }

// @filename: index.js
 // ---cut---
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
 	event.locals.user = await getUserInformation(event.request.headers.get('cookie'));

	const response = await resolve(event);
	response.headers.set('x-custom-header', 'potato');

	return response;
}
```

Можно добавить вызов нескольких функций `handle` используя [хелпер `sequence`](#moduli-sveltejs-kit-hooks).

В `resolve` можно передать второй необязательный параметр, который даёт больше контроля над тем, как будет отображаться ответ. Этот параметр является объектом, который может иметь следующие поля:

- `ssr: boolean` (default `true`) - если `false`, отображает пустую страницу 'shell' вместо рендеринга на стороне сервера
- `transformPage(opts: { html: string }): string` — применяет пользовательские преобразования к HTML

```js
/// file: src/hooks.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
 	const response = await resolve(event, {
 		ssr: !event.url.pathname.startsWith('/admin'),
 		transformPage: ({ html }) => html.replace('old', 'new')
 	});

 	return response;
}
 ```

> Отключение [отрисовки на стороне сервера](#prilozhenie-ssr) фактически превращает приложение SvelteKit в [**одностраничное приложение** или SPA](#prilozhenie-csr-and-spa). В большинстве ситуаций это не рекомендуется ([см. термин SSR](#prilozhenie-ssr)). Решите, действительно ли уместно его полностью отключать или сделайте это выборочно, а не для всех запросов.

### handleError

Если ошибка возникает во время рендеринга, эта функция будет вызвана с параметрами `error` и `event`. Это позволяет отправлять данные в сервис отслеживания ошибок или форматировать сообщение для вывода в консоли.

Если, в режиме разработки, возникает синтаксическая ошибка в коде Svelte, будет добавлен параметр `frame`, указывающий на местоположение ошибки.

Если данный хук не задан, SvelteKit отобразит ошибку с форматированием по умолчанию.

```js
/// file: src/hooks.js
// @filename: ambient.d.ts
const Sentry: any;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').HandleError} */
export async function handleError({ error, event }) {
	// пример интеграции с https://sentry.io/
	Sentry.captureException(error, { event });
}
```

> `handleError` вызывается только в случае, если ошибка не была поймана ранее в коде. Также хук не вызывается, когда страницы и эндпоинты явно отвечают кодами состояния 4xx и 5xx.


### getSession

Эта функция принимает объект `event` и возвращает объект `session`, который [доступен на клиенте](#moduli-$app-stores) и, следовательно, должен быть безопасным для предоставления пользователям. Он запускается всякий раз, когда SvelteKit выполняет рендеринг страницы на сервере.

Если функция не задана, объект сессии будет равен `{}`.

```js
/// file: src/hooks.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user: {
			name: string;
			email: string;
			avatar: string;
			token: string;
		}
	}
	interface Session {
		user?: {
			name: string;
			email: string;
			avatar: string;
		}
	}
}

type MaybePromise<T> = T | Promise<T>;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
 	return event.locals.user
 		? {
			user: {
				// передайте только поля нужные на клиенте —
				// исключите любые другие поля объекта user
				// вроде токенов, паролей и т.п.
				name: event.locals.user.name,
				email: event.locals.user.email,
				avatar: event.locals.user.avatar
			}
 		  }
 		: {};
}
```

> Объект `session` должен быть сериализуемым, то есть не должен содержать вещей вроде функций или классов, только встроенные в JavaScript типы данных.


### externalFetch

Эта функция позволяет изменять (или заменять) запрос `fetch` для **внешнего ресурса** внутри функции `load`, которая выполняется на сервере (или во время предварительной отрисовки).

Например, когда есть страница с функцией `load`, которая на клиенте делает запрос на публичный URL-адрес(например `https://api.yourapp.com`) какого-либо внутреннего сервиса, то во время отрисовки на сервере имеет смысл выполнить запрос к сервису локально, минуя прокси-серверы и балансировщики.

```js
/** @type {import('@sveltejs/kit').ExternalFetch} */
export async function externalFetch(request) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
	// копируем исходный запрос, но заменяем URL-адрес
	request = new Request(
		request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
		request
	);
}
	return fetch(request);
}
```