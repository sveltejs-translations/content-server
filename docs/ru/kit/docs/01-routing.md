---
title: Маршруты
---

Сердцем SvelteKit является _роутер основанный на файловой системе_. Это означает, что структура вашего приложения определяется структурой файлов его исходников – в частности содержимым папки `src/routes`.

> Можно указать другую директорию в файле [конфигурации проекта](#konfiguracziya).

Существует два типа маршрутов — **страницы** и **эндпоинты**.

Страницы обычно отдают HTML-код для отображения пользователю ( а также CSS и JavaScript, необходимые странице). По умолчанию они отрисовываются как на сервере, так и на клиенте, но это поведение можно настроить.

Эндпоинты запускаются только на сервере (или при сборке сайта, если используется [предварительная отрисовка](#parametry-straniczy-prerender)). Это то место, где можно выполнять запросы к базам данных или API с приватной авторизацией, а также вывести иные данные которые доступны на сервере. Страницы могут получать данные от эндпоинтов. По умолчанию эндпоинты возвращают ответ в формате JSON, но могут также возвращать данные в любых других форматах.

### Страницы

Страницы — это компоненты Svelte, описанные в файлах `.svelte`(или любой файл с расширением, указанным в [`config.extensions`](#konfiguracziya)). По умолчанию, когда пользователь впервые посещает приложение, ему будет отправлена сгенерированная на сервере версия запрошенной страницы, а также некоторый JavaScript, который выполняет 'гидрацию' страницы и инициализирует роутер на стороне клиента. С этого момента навигация на другие страницы будет полностью выполняться на стороне клиента обеспечивая очень быстрое перемещение, что типично для клиентских приложений, где некоторая часть разметки не требует перерисовки.

Имя файла определяет маршрут. Например, `src/routes/index.svelte` — корневой файл вашего сайта:


```html
/// file: src/routes/index.svelte
<svelte:head>
	<title>Добро пожаловать!</title>
</svelte:head>

<h1>Приветствую вас на моём сайте!</h1>
```

Файл с именем `src/routes/about.svelte` или `src/routes/about/index.svelte` будет соответствовать маршруту `/about`:

```html
/// file: src/routes/about.svelte
<svelte:head>
	<title>О сайте</title>
</svelte:head>

<h1>Информация о сайте</h1>
<p>Это самый лучший сайт!</p>
```

Динамические параметры задаются при помощи квадратных скобок [...]. Например, можно определить страницу, отображающую статью из блога, таким образом – `src/routes/blog/[slug].svelte`. Доступ к этим параметрам можно получить с помощью функции [`load`](#zagruzka-dannyh-poluchaemye-znacheniya-params) или через хранилище [`page`](#moduli-$app-stores).

Файл или каталог может иметь несколько динамических частей, например `[id]-[category].svelte`. Параметры "не жадные", т.е. в неоднозначном случае, вроде `x-y-z`, `id` будет равно `x`, а в `category` попадёт `y-z`.


### Эндпоинты

Эндпоинты — это модули, написанные в файлах `.js` (или `.ts`), которые экспортируют функции, соответствующие HTTP методам. Их назначение заключается в предоставлении страницам возможности читать и записывать данные, которые доступны только на сервере (например, в базе данных или в файловой системе).

Если эндпоинт имеет то же имя файла, что и страница (за исключением расширения), страница получит свои реквизиты из эндпоинта. Таким образом, такая страница, как `src/routes/items/[id].svelte`, может получить свой реквизит из этого файла:

```js
/// file: src/routes/items/[id].js
// @filename: ambient.d.ts
type Item = {};
declare module '$lib/database' {
	export const get: (id: string) => Promise<Item>;
}

// @filename: index.js
// ---cut---
import db from '$lib/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
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

> Весь код на стороне сервера, включая эндпоинты, имеет доступ кметоду `fetch` на случай, если вам нужно запросить данные из внешних API. Пока не обращайте внимания на импорт `$lib`, мы вернемся к этому [позже](#moduli-$lib).

Цель данной функции – вернуть объект `{ status, headers, body }`, который будет ответом на полученный запрос, где `status` является [кодом ответа HTTP](https://httpstatusdogs.com):

- `2xx` — успешный ответ (по умолчанию `200`)
- `3xx` — перенаправление (используется совместно с заголовком `location`)
- `4xx` — ошибка от клиента
- `5xx` — ошибка на сервере

> Если вернуть `{fallthrough: true}`, SvelteKit будет [перебирать маршруты](#marshruty-rasshirennaya-marshrutizacziya-perebor-marshrutov) пока один из них что-то не вернёт, или вернёт ответ с кодом 404.

Возвращаемый объект `body` соответствует свойствам страницы:

```svelte
/// file: src/routes/items/[id].svelte
<script>
	// свойство будет задано ответом от эндпоинта
	export let item;
</script>

<h1>{item.title}</h1>
```

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

// @filename: index.js
// ---cut---
import * as db from '$lib/database'; 

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
 	const items = await db.list();
	return {
		body: { items }
	};
}

/** @type {import('@sveltejs/kit').RequestHandler} */
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

Если вы запросите маршрут с заголовком `accept: application/json`, SvelteKit отобразит данные эндпоинта в формате JSON, а не страницу в формате HTML.


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

### Отдельные эндпоинты

Как мы видели ранее, чаще всего эндпоинты связаны со страницей, для которой передают данные. Однако они могут существовать и отдельно от страниц. Отдельные эндпоинты имеют большую гибкость в отношении типа поля `body` — кроме объекта, они также могут вернуть строку или `Uint8Array`.

> Поддержка потоковых запросов и ответов [на подходе](https://github.com/sveltejs/kit/issues/3419).

### Приватные модули 

Файлы и каталоги, чьи имена начинаются с `_` или `.` (кроме [`.well-known`](https://en.wikipedia.org/wiki/Well-known_URI)) по умолчанию являются приватными, т.е. они не создают маршруты (но могут быть импортированы файлами, которые это делают). В конфигурации проекта  с помощью опции [`routes`](#konfiguracziya-routes) можно указать, какие модули считать приватными, а какие будут создавать маршруты.


### Расширенная маршрутизация

#### Rest-параметры

Маршрут может иметь несколько динамических параметров, например `src/routes/[category]/[item].svelte`, или даже `src/routes/[category]-[item].svelte`. Параметры "не жадные", т.е. в неоднозначном случае, вроде `x-y-z`, `category` будет равно `x`, а в `item` попадёт `y-z`. Если количество частей маршрута заранее неизвестно, можно воспользоваться rest-синтаксисом – например, реализация просмотра файлов на GitHub будет выглядеть так:

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

> `src/routes/a/[...rest]/z.svelte` будет соответствовать `/a/z` также как `/a/b/z` и `/a/b/c/z` и так далее. Убедитесь, что вы проверили правильность значения rest-параметров.


#### Сортировка

Это нужно, чтобы несколько маршрутов соответствовали данному пути. Например, каждый из этих маршрутов будет соответствовать `/foo-abc`:

```bash
src/routes/[a].js
src/routes/[b].svelte
src/routes/[c].svelte
src/routes/[...catchall].svelte
src/routes/foo-[bar].svelte
```

SvelteKit должен знать, какой маршрут запрашивается. Для этого он сортирует их по следующим правилам...

- Более конкретные маршруты имеют более высокий приоритет
- Автономные эндпоинты имеют более высокий приоритет, чем страницы с той же спецификой
- Rest parameters имеют наименьшее приоритет
- Ties разрешаются в алфавитном порядке

...Результат этого порядка – `/foo-abc` вызовет `src/routes/foo-[bar].svelte`, а не менее конкретный маршрут:

```bash
src/routes/foo-[bar].svelte
src/routes/[a].js
src/routes/[b].svelte
src/routes/[c].svelte
src/routes/[...catchall].svelte
```

#### Перебор маршрутов

В редких случаях приведенный выше порядок может быть не тем, что нужно для данного пути. Например, возможно, `/foo-abc` должен разрешиться в `src/routes/foo-[bar].svelte`, но `/foo-def` должен разрешаться в `src/routes/[b].svelte`.

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
// @errors: 2366
/** @type {import('@sveltejs/kit').RequestHandler} */
// ---cut---
export function get({ params }) {
	if (params.a === 'foo-def') {
		return { fallthrough: true };
	}

	// ...
}
```