---
title: Маршруты
---

Сердцем SvelteKit является _роутер основанный на файловой системе_. Это означает, что структура вашего приложения определяется структурой файлов его исходников – в частности содержимым папки `src/routes`.

> Можно указать другую директорию в файле [конфигурации проекта](#konfiguracziya).

Существует два типа маршрутов — **страницы** и **эндпоинты**.

Страницы обычно отдают HTML-код для отображения пользователю ( а также CSS и JavaScript, необходимые странице). По умолчанию они отрисовываются как на сервере, так и на клиенте, но это поведение можно настроить.

Эндпоинты запускаются только на сервере (или при сборке сайта, если используется [предварительная отрисовка](#parametry-straniczy-prerender)). Это то место, где можно выполнять запросы к базам данных или API с приватной авторизацией, а также вывести иные данные которые доступны на сервере. Страницы могут получать данные от эндпоинтов. По умолчанию эндпоинты возвращают ответ в формате JSON, но могут также возвращать данные в любых других форматах.

### Страницы

Страницы — это компоненты Svelte, описанные в файлах `.svelte`(или любой файл с расширением, указанным в [`config.extensions`](#konfiguracziya)). По умолчанию, когда пользователь впервые посещает приложение, ему будет отправлена сгенерированная на сервере версия запрошенной страницы, а также некоторый JavaScript, который выполняет 'гидратацию' страницы и инициализирует роутер на стороне клиента. С этого момента навигация на другие страницы будет полностью выполняться на стороне клиента обеспечивая очень быстрое перемещение, что типично для клиентских приложений, где некоторая часть разметки не требует перерисовки.

Имя файла определяет маршрут. Например, `src/routes/index.svelte` — корневой файл вашего сайта:


```html
/// file: src/routes/index.svelte
<svelte:head>
	<title>Добро пожаловать!</title>
</svelte:head>

<h1>Приветствую вас на моём сайте!</h1>

<a href="/about">О сайте</a>
```

Файл с именем `src/routes/about.svelte` или `src/routes/about/index.svelte` будет соответствовать маршруту `/about`:

```html
/// file: src/routes/about.svelte
<svelte:head>
	<title>О сайте</title>
</svelte:head>

<h1>Информация о сайте</h1>
<p>Это самый лучший сайт!</p>

<a href="/">Главная</a>
```

> Обратите внимание, что SvelteKit использует элементы `<a>` для навигации между маршрутами, а не компонент `<Link>`, специфичный для платформы.

Динамические параметры задаются при помощи квадратных скобок [...]. Например, можно определить страницу, отображающую статью из блога, таким образом – `src/routes/blog/[slug].svelte`. Доступ к этим параметрам можно получить с помощью функции [`load`](#zagruzka-dannyh-poluchaemye-znacheniya-params) или через хранилище [`page`](#moduli-$app-stores).

Маршрут может иметь несколько динамических параметров, например `src/routes/[category]/[item].svelte` или даже `src/routes/[category]-[item].svelte`. (Параметры "не жадные"; в неоднозначном случае, таком как `x-y-z`, `id` будет `x`, а `category` будет `y-z`.)


### Эндпоинты

Эндпоинты - это модули, записанные в файлах `.js` (или `.ts`), которые экспортируют функции [request handler](/docs/types#sveltejs-kit-requesthandler), соответствующие HTTP методам. Они могут читать и записывать данные, доступные только на сервере (например, в базе данных или в файловой системе).

```js
/// file: src/routes/items/[id].js
// @filename: ambient.d.ts
type Item = {};
declare module '$lib/database' {
	export const get: (id: string) => Promise<Item>;
}

// @filename: [id].d.ts
import type { RequestHandler as GenericRequestHandler } from '@sveltejs/kit';
export type RequestHandler<Body = any> = GenericRequestHandler<{ id: string }, Body>;

// @filename: index.js
// ---cut---
import db from '$lib/database';

/** @type {import('./[id]').RequestHandler} */
export async function get({ params }) {
	// `params.id` берётся из [id].js
 	const item = await db.get(params.id);

	if (item) {
		return {
			body: { item }
		};
	} 

	return {
 		status: 404
 	};
}
```

> Не беспокойтесь об импорте `$lib`, мы перейдем к этому [позже](#moduli-$lib).

Тип функции `get` выше взят из файла `./[id].d.ts`, сгенерированного SvelteKit (внутри вашего [`outDir`](/docs#konfiguracziya-outdir) с использованием опции [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs), который обеспечивает безопасность типа при доступе к `params`. Дополнительную информацию см. в разделе [сгенерированные типы](/docs/types#generated-types).

Цель [обработчика запроса](/docs/types#sveltejs-kit-requesthandler) – вернуть объект `{ status, headers, body }`, который будет ответом на полученный запрос, где `status` является [кодом ответа HTTP](https://httpstatusdogs.com):

- `2xx` — успешный ответ (по умолчанию `200`)
- `3xx` — перенаправление (используется совместно с заголовком `location`)
- `4xx` — ошибка от клиента
- `5xx` — ошибка на сервере

#### Эндпоинты страницы

Если эндпоинт имеет то же имя файла, что и страница (за исключением расширения), страница получает свойства от эндпоинта - через `fetch` во время навигации на стороне клиента или через прямой вызов функции во время SSR.

Например страница `src/routes/items/[id].svelte`, может получить свойства из `body` в конечной точке выше:

```svelte
/// file: src/routes/items/[id].svelte
<script>
	// свойство будет задано ответом от эндпоинта
	export let item;
</script>

<h1>{item.title}</h1>
```

Поскольку страница и маршрут имеют один и тот же URL-адрес, вам нужно будет включить заголовок `accept: application/json`, чтобы получить JSON из конечной точки, а не HTML со страницы. Вы также можете получить необработанные данные, добавив `/__data.json` к URL-адресу, например `/items/[id]/__data.json`.

#### Автономные эндпоинты

Как мы видели ранее, чаще всего эндпоинты связаны со страницей, для которой передают данные. Однако они могут существовать и отдельно от страниц. Автономные эндпоинты имеют большую гибкость в отношении типа поля `body` — кроме объекта, они также могут вернуть строку или `Uint8Array`.

> Поддержка потоковых запросов и ответов [на подходе](https://github.com/sveltejs/kit/issues/3419).

Автономные эндпоинты доступны с расширением файла или без него:

| filename                      | endpoint   |
| ----------------------------- | ---------- |
| src/routes/data/index.json.js | /data.json |
| src/routes/data.json.js       | /data.json |
| src/routes/data/index.js      | /data      |
| src/routes/data.js            | /data      |

 #### POST, PUT, PATCH, DELETE

Эндпоинты могут обрабатывать любой HTTP-метод, не только GET, путём экспорта соответствующей функции:

```js
// @noErrors
export function post(event) {...}
export function put(event) {...}
export function patch(event) {...}
export function del(event) {...} // `delete` - зарезервированное слово
```

Как и `get`, все эти функции могут возвращать объект `body`, который будет передан странице в качестве значений её свойств. Ответы со статусом 4xx/5xx на GET-запросы приведут к отображению страницы с ошибкой. Аналогичные ответы на запросы других HTTP-методов этого не сделают, что позволяет, например, передать и отрисовать ошибки валидации формы.

```js
/// file: src/routes/items.js
// @filename: ambient.d.ts
type Item = {
	id: string;
};
type ValidationError = {};

declare module '$lib/database' {
	export const list: () => Promise<Item[]>;
	export const create: (request: Request) => Promise<[Record<string, ValidationError>, Item]>;
}

// @filename: items.d.ts
import type { RequestHandler as GenericRequestHandler } from '@sveltejs/kit';
export type RequestHandler<Body = any> = GenericRequestHandler<{}, Body>;


// @filename: index.js
// ---cut---
import * as db from '$lib/database'; 

/** @type {import('./items').RequestHandler} */
export async function get() {
 	const items = await db.list();
	return {
		body: { items }
	};
}

/** @type {import('./items').RequestHandler} */
export async function post({ request }) {
	const [errors, item] = await db.create(request);

	if (errors) {
		// возвращаем ошибки валидации
		return {
			status: 400,
			body: { errors }
		};
	}
	// перенаправляем на страницу новой штуки
	return {
		status: 303,
		headers: {
			location: `/items/${item.id}`
		}
	};
}
```

```svelte
/// file: src/routes/items.svelte
<script>
	// У страницы всегда есть доступ к свойствам из `get`...
	export let items;

	// ...также добавляются свойства из `post`, если страница  
	// отрисовывается по POST-запросу, например после
	// формы ниже
	export let errors;
</script>

{#each items as item}
	<Preview item={item}/>
{/each}

<form method="post">
	<input name="title">

	{#if errors?.title}
		<p class="error">{errors.title}</p>
	{/if}

	<button type="submit">Создать штуку</button>
</form>
```

#### Получение данных запроса

Объект `request` является экземпляром стандартного класса [Request](https://developer.mozilla.org/ru-RU/docs/Web/API/Request), поэтому получить данные из тела запроса не составит труда:

```js
// @filename: ambient.d.ts
declare global {
	const create: (data: any) => any;
}

export {};

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	const data = await request.formData(); // или .json(), или .text()
	
	await create(data);
 	return { status: 201 };
}
```

#### Установка Cookie

Эндпоинты могут устанавливать Cookie, возвращая объект заголовков с `set-cookie`. Чтобы установить несколько Cookie одновременно, верните массив:

```js
// @filename: ambient.d.ts
const cookie1: string;
const cookie2: string;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').RequestHandler} */
export function get() {
	return {
		headers: {
			'set-cookie': [cookie1, cookie2]
		}
	};
}
```

#### Переназначение HTTP методов

HTML-формы поддерживают только методы `GET` и `POST`. Вы можете указать другие допустимые методы, например `PUT` и `DELETE`, указав их в файле [конфигурации](#konfiguracziya-methodoverride), а затем добавлять параметр `_method=МЕТОД` (укажите нужный метод) в аттрибуте формы `action`:

```js
/// file: svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE']
		}
	}
};

export default config;
```

```html
<form method="post" action="/todos/{id}?_method=PUT">
	<!-- элементы формы -->
</form>
```

> Использование нативного поведения `<form>` гарантирует, что ваше приложение продолжит работать при сбое или отключении JavaScript.


### Приватные модули 

Файлы и каталоги, чьи имена начинаются с `_` или `.` (кроме [`.well-known`](https://en.wikipedia.org/wiki/Well-known_URI)) по умолчанию являются приватными, т.е. они не создают маршруты (но могут быть импортированы файлами, которые это делают). В конфигурации проекта  с помощью опции [`routes`](#konfiguracziya-routes) можно указать, какие модули считать приватными, а какие будут создавать маршруты.


### Расширенная маршрутизация

#### Rest-параметры

Если количество сегментов маршрута неизвестно, вы можете использовать синтаксис rest - например, вы можете реализовать средство просмотра файлов GitHub таким образом...

```bash
/[org]/[repo]/tree/[branch]/[...file]
```

И в данном случае запрос для маршрута `/sveltejs/kit/tree/master/documentation/docs/01-routing.md` будет преобразован в следующие параметры, доступные на этой странице:

```js
// @noErrors
{
	org: 'sveltejs',
	repo: 'kit',
	branch: 'master',
	file: 'documentation/docs/01-routing.md'
}
```

> `src/routes/a/[...rest]/z.svelte` будет соответствовать `/a/z` (т.е. параметра вообще нет), а также `/a/b/z` и `/a/b/c/z` и так далее. Убедитесь, что значение параметра rest является допустимым, например, с помощью [сопоставления](#marshruty-rasshirennaya-marshrutizacziya-sopostavlenie).

#### Сопоставление

Маршрут, такой как `src/routes/archive/[page]`, будет соответствовать `/archive/3`, но он также будет соответствовать `/archive/potato`. Мы этого не хотим. Вы можете убедиться, что параметры маршрута правильно сформированы, добавив _matcher_, который принимает строку параметров (`"3"` или `"potato"`) и возвращает `true`, если он действителен - в каталог [`params`](#konfiguracziya-files)...

```js
/// file: src/params/integer.js
/** @type {import('@sveltejs/kit').ParamMatcher} */
export function validate(param) {
	return /^\d+$/.match(param);
}
```

...и расширение ваших маршрутов:

```diff
-src/routes/archive/[page]
+src/routes/archive/[page=integer]
```

Если путь не совпадает, SvelteKit попытается соответствовать другим маршрутам (используя порядок сортировки, указанный ниже), прежде чем в конечном итоге вернуть 404.

#### Сортировка

Это нужно, чтобы несколько маршрутов соответствовали данному пути. Например, каждый из этих маршрутов будет соответствовать `/foo-abc`:

```bash
src/routes/[...catchall].svelte
src/routes/[a].js
src/routes/[b].svelte
src/routes/foo-[c].svelte
```

SvelteKit должен знать, какой маршрут запрашивается. Для этого он сортирует их по следующим правилам...

- Более конкретные маршруты имеют более высокий приоритет
- Автономные эндпоинты имеют более высокий приоритет, чем страницы с той же спецификой
- Параметры в [сопоставлении маршрутов](#marshruty-rasshirennaya-marshrutizacziya-sopostavlenie) с (`[name=type]`) имеют более высокий приоритет, чем параметры без (`[name]`)
- Rest parameters имеют наименьшее приоритет
- Ties разрешаются в алфавитном порядке

...Результат этого порядка – `/foo-abc` вызовет `src/routes/foo-[bar].svelte`, а не менее конкретный маршрут:

```bash
src/routes/foo-[c].svelte
src/routes/[a].js
src/routes/[b].svelte
src/routes/[...catchall].svelte
```

<!-- #### Перебор маршрутов

В редких случаях приведенный выше порядок может быть не тем, который нужен для данного пути. Например, возможно, `/foo-abc` должен разрешиться в `src/routes/foo-[bar].svelte`, но `/foo-def` должен разрешаться в `src/routes/[b].svelte`.

Маршруты с более высоким приоритетом могут попасть на маршруты с более низким приоритетом, вернув `{ fallthrough: true }`, либо из `load` (для страниц), либо из обработчика запросов (для эндпоинтов):

```svelte
/// file: src/routes/foo-[bar].svelte
<script context="module">
	export function load({ params }) {
		if (params.bar === 'def') {
			return { fallthrough: true };
		}

	// ...
}
</script>
```

```js
/// file: src/routes/[a].js

// @filename: [a].d.ts
import type { RequestHandler as GenericRequestHandler } from '@sveltejs/kit';
export type RequestHandler<Body = any> = GenericRequestHandler<{ a: string }, Body>;

// @filename: index.js
// @errors: 2366
// ---cut---
/** @type {import('./[a]').RequestHandler} */
export function get({ params }) {
	if (params.a === 'foo-def') {
		return { fallthrough: true };
	}

	// ...
}
``` -->