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
<!-- src/routes/index.svelte -->
<svelte:head>
	<title>Добро пожаловать!</title>
</svelte:head>

<h1>Приветствую вас на моём сайте!</h1>
```

Файл с именем `src/routes/about.svelte` или `src/routes/about/index.svelte` будет соответствовать маршруту `/about`:

```html
<!-- src/routes/about.svelte -->
<svelte:head>
	<title>О сайте</title>
</svelte:head>

<h1>Информация о сайте</h1>
<p>Это самый лучший сайт!</p>
```

Динамические параметры задаются при помощи квадратных скобок [...]. Например, можно определить страницу, отображающую статью из блога, таким образом – `src/routes/blog/[slug].svelte`.

Динамические параметры кодируются с помощью `[brackets]`. Например, сообщение в блоге может быть определено `src/routes/blog/[slug].svelte`.

Файл или каталог может иметь несколько динамических частей, например `[id]-[category].svelte`. (Параметры «не жадные»; и в неоднозначном случае, типа `x-y-z`, `id` будет `x`, а `category` будет `y-z`.)


### Эндпоинты

Эндпоинты — это модули, написанные в файлах `.js` (или `.ts`), которые экспортируют функции, соответствующие HTTP методам. Их задача — разрешить страницам читать и записывать данные, которые доступны только на сервере (например, в базе данных или в файловой системе).

```ts
// Type declarations for endpoints (declarations marked with
// an `export` keyword can be imported from `@sveltejs/kit`)

export interface RequestHandler<Output = Record<string, any>> {
	(event: RequestEvent): MaybePromise<
		Either<Output extends Response ? Response : EndpointOutput<Output>, Fallthrough>
	>;
}

export interface RequestEvent {
 	request: Request;
 	url: URL;
 	params: Record<string, string>;
 	locals: App.Locals;
	platform: App.Platform;
}

export interface EndpointOutput<Output = Record<string, any>> {
 	status?: number;
 	headers?: Headers | Partial<ResponseHeaders>;
 	body?: Record<string, any>;
 }

type MaybePromise<T> = T | Promise<T>;

interface Fallthrough {
 	fallthrough: true;
}
```

> См. раздел [TypeScript](#typescript) для получения информации о `App.Locals` и `App.Platform`.

Такая страница, как `src/routes/items/[id].svelte`, может получать данные из `src/routes/items/[id].js`:

```js
import db from '$lib/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
	// `params.id` comes from [id].js
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
<!-- > Если из функции ничего не возвращается, это вызовет ответ с кодом ошибки 404. -->
> Весь код на стороне сервера, включая конечные точки, имеет доступ к `fetch` на случай, если вам нужно запросить данные из внешних API. Не беспокойтесь об импорте `$lib`, мы вернемся к этому [позже](#moduli-$lib).

Цель данной функции – вернуть объект `{ status, headers, body }`, который является ответом на запрос, где `status` является [кодом ответа HTTP](https://httpstatusdogs.com):

- `2xx` — успешный ответ (по умолчанию `200`)
- `3xx` — перенаправление (используется совместно с заголовком `location`)
- `4xx` — ошибка от клиента
- `5xx` — ошибка на сервере

> Если возвращается `{fallthrough: true}`, SvelteKit будет [перебирать маршруты](#marshruty-dopolnitelno-perebor-marshrutov) пока один из них что-то не вернёт, или вернёт ответ с кодом 404.

Возвращаемое `body` соответствует свойствам страницы:

```html
<script>
	// populated with data from the endpoint
	export let item;
</script>

<h1>{item.title}</h1>
```

 #### POST, PUT, PATCH, DELETE

Эндпоинты могут обрабатывать любой метод HTTP — не только GET — путем экспорта соответствующей функции:

```js
export function post(event) {...}
export function put(event) {...}
export function patch(event) {...}
export function del(event) {...} // `delete` is a reserved word
```

Эти функции могут, как и `get`, возвращать `body`, которое будет передано на страницу в качестве реквизита. В то время как ответы 4xx/5xx от `get` приведут к отображению страницы с ошибкой, аналогичные ответы на запросы без GET этого не сделают, что позволяет вам делать такие вещи, как ошибки проверки формы рендеринга:

```js
 // src/routes/items.js
import * as db from '$lib/database'; 

export async function get() {
 	const items = await db.list();
	return {
		body: { items }
	};
}
export async function post({ request }) {
	const [errors, item] = await db.create(request);

	if (errors) {
		// return validation errors
		return {
			status: 400,
			body: { errors }
		};
	}
	// redirect to the newly created item
	return {
		status: 303,
		headers: {
			location: `/items/${item.id}`
		}
	};
}
```

```svelte
<!-- src/routes/items.svelte -->
<script>
	// The page always has access to props from `get`...
	export let items;

	// ...plus props from `post` when the page is rendered
	// in response to a POST request, for example after
	// submitting the form below
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

	<button type="submit">Create item</button>
</form>
```

Если вы запросите маршрут с заголовком `accept: application/json`, SvelteKit отобразит данные эндпоинта в формате JSON, а не страницу в формате HTML.

#### Body парсинг

Объект `request` является экземпляром стандартного класса [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request). Таким образом, получить доступ к телу запроса легко:

```js
export async function post({ request }) {
	const data = await request.formData(); // or .json(), or .text(), etc
}
```

#### Setting cookies

Эндпоинты могут устанавливать файлы cookie, возвращая объект заголовков с `set-cookie`.Чтобы установить несколько файлов cookie одновременно, верните массив:

```js
return {
	headers: {
		'set-cookie': [cookie1, cookie2]
	}
};
```

#### HTTP методы

Элементы HTML `<form>` изначально поддерживают только методы `GET` и `POST`. Вы можете разрешить другие методы, такие как `PUT` и `DELETE`, указав их в вашем [configuration](#konfiguracziya-methodoverride) и добавив параметр `_method=VERB` (вы можете настроить имя) в `action` формы:

```js
// svelte.config.js
export default {
	kit: {
		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE']
		}
	}
};
```

```html
<form method="post" action="/todos/{id}?_method=PUT">
	<!-- form elements -->
</form>
```

> Использование собственного поведения `<form>` гарантирует, что ваше приложение продолжит работать при сбое или отключении JavaScript.

### Standalone endpoints

Чаще всего эндпоинты существуют для предоставления данных странице, с которой они связаны. Однако они могут существовать отдельно от страниц. Автономные эндпоинты имеют немного большую гибкость по сравнению с возвращаемым типом `body` — в дополнение к объектам они могут возвращать строку или `Uint8Array`.

> Support for streaming request and response bodies is [coming soon](https://github.com/sveltejs/kit/issues/3419).

### Приватные модули 

Файлы и каталоги начинающаяся с `_` или `.` (кроме [`.well-known`](https://en.wikipedia.org/wiki/Well-known_URI)) по умолчанию являются частными, что означает, что они не создают маршруты (но могут быть импортированы файлами, которые это делают). Вы можете настроить, какие модули считаются общедоступными или частными, с помощью конфигурации [`routes`](#konfiguracziya-routes).


### Расширенная маршрутизация

#### Rest-параметры

Маршрут может иметь несколько динамических параметров, например `src/routes/[category]/[item].svelte`, или даже `src/routes/[category]-[item].svelte`. (Параметры не жадные; в неоднозначном случае, таком как `/x-y-z`, `category` будет `x`, а `item` будет `y-z`.) Если количество частей маршрута заранее неизвестно, можно воспользоваться rest-синтаксисом – например, реализация просмотра файлов на GitHub будет выглядеть так...

```bash
/[org]/[repo]/tree/[branch]/[...file]
```

...и в данном случае запрос для маршрута `/sveltejs/kit/tree/master/documentation/docs/01-routing.md` будет преобразован в следующие параметры, доступные на этой странице:

```js
{
	org: 'sveltejs',
	repo: 'kit',
	branch: 'master',
	file: 'documentation/docs/01-routing.md'
}
```

> `src/routes/a/[...rest]/z.svelte` будет соответствовать `/a/z` также как `/a/b/z` и `/a/b/c/z` и так далее. Убедитесь, что вы проверили правильность значения rest-параметров.


#### Перебор маршрутов

В случае, когда в приложении существует несколько маршрутов, которые подходят под заданный URL, SvelteKit будет пробовать загрузить каждый из них, пока кто-то из них не ответит. Например у вас есть такие маршруты... 

```bash
src/routes/[baz].js
src/routes/[baz].svelte
src/routes/[qux].svelte
src/routes/foo-[bar].svelte
```

... и вы переходите в `/foo-xyz`. SvelteKit сначала попробует `foo-[bar].svelte`, потому что это лучшее совпадение. Если это не даст ответа, SvelteKit попробует другие менее конкретные, но все еще действительные совпадения для `/foo-xyz`. Поскольку конечные точки имеют более высокий приоритет, чем страницы, следующей попыткой будет `[baz].js`. Затем алфавитный порядок имеет приоритет и `[baz].svelte` будет опробован перед `[qux].svelte`. Первый маршрут, который отвечает - страница, которая возвращает что-то из [`load`](#zagruzka-dannyh) или не имеет функции `load`, или эндпоинт, который что-то возвращает - обработает запрос.

Если ни одна страница или эндпоинт не ответит на запрос, SvelteKit вернёт ответ с кодом 404.