---
title: Types
---

### @sveltejs/kit

Все API в Sveltekit полностью типизированны. Следующие типы могут быть импортированы из `@sveltejs/kit`

**TYPES**

### `App` namespace

Можно сказать Sveltekit, как тизировать объекты внутри вашего приложения, объявив пространство имен `App`. По умолчанию новый проект будет иметь файл под названием `src/app.d.ts`, содержащий следующее:

```ts
/// <reference types="@sveltejs/kit" />
declare namespace App {
 	interface Locals {}
 	interface Platform {}
 	interface Session {}
 	interface Stuff {}
}
```

После заполнения этих интерфейсов, вы получите безопасное использование типов в `event.locals`, `event.platform`, `session` и `stuff`:

#### App.Locals

Интерфейс, который определяет `event.locals`, доступ к которому можно получить в [хуках](#huki) (`handle`, `handleError` и `getSession`) и [эндпоинтах](#marshruty-endpointy).

#### App.Platform

Если текущий адаптер предоставляет [контекст платформы](#adaptery-podderzhivaemye-platformy-kontekst-speczifichnyj-dlya-platformy) через `event.platform`, укажите его здесь.

#### App.Session

Интерфейс, который определяет объект `session`, как аргумента для функций [`load`](#zagruzka-dannyh), так и значения [хранилища session](#moduli-$app-stores).

#### App.Stuff

Интерфейс, который определяет объект `stuff` во входных и выходных данных функции [`load`](#zagruzka-dannyh), а так же в значении свойства `stuff` в [хранилище page](#moduli-$app-stores).

### Сгенерированные типы

Типы `RequestHandler` и `Load` принимают аргумент `Params`, позволяя вам ввести объект `params`. Например, этот эндпоинт ожидает параметры `foo`, `bar` и `baz`:

```js
/// file: src/routes/[foo]/[bar]/[baz].js
// @errors: 2355
/** @type {import('@sveltejs/kit').RequestHandler<{
 *   foo: string;
 *   bar: string;
 *   baz: string
 * }>} */
export async function get({ params }) {
// ...
}
```

Излишне говорить, что это громоздко записывать и менее портативно (если бы вы переименовали каталог `[foo]` в `[qux]`, тип больше не отражал бы реальность).

Чтобы решить эту проблему, SvelteKit генерирует файлы `.d.ts` для каждой из ваших конечных точек и страниц:

```ts
/// file: .svelte-kit/types/src/routes/[foo]/[bar]/__types/[baz].d.ts
/// link: false
import type { RequestHandler as GenericRequestHandler, Load as GenericLoad } from '@sveltejs/kit';

export type RequestHandler<Body = any> = GenericRequestHandler<
{ foo: string; bar: string; baz: string },
Body
>;

export type Load<
 	InputProps extends Record<string, any> = Record<string, any>,
 	OutputProps extends Record<string, any> = InputProps
> = GenericLoad<{ foo: string; bar: string; baz: string }, InputProps, OutputProps>;
```

Эти файлы можно импортировать в конечные точки и страницы в качестве братьев и сестер благодаря опции [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs) в конфигурации TypeScript:

```js
/// file: src/routes/[foo]/[bar]/[baz].js
// @filename: __types/[baz].d.ts
import type { RequestHandler as GenericRequestHandler, Load as GenericLoad } from '@sveltejs/kit';

export type RequestHandler<Body = any> = GenericRequestHandler<
{ foo: string, bar: string, baz: string },
Body
>;

// @filename: index.js
// @errors: 2355
// ---cut---
/** @type {import('./__types/[baz]').RequestHandler} */
export async function get({ params }) {
// ...
}
```

```svelte
<script context="module">
/** @type {import('./__types/[baz]').Load} */
export async function load({ params, fetch, session, stuff }) {
	// ...
}
</script>
```

> Чтобы это сработало, ваш собственный `tsconfig.json` или `jsconfig.json` должен расширяться от сгенерированного `.svelte-kit/tsconfig.json` (где `.svelte-kit` - ваш [`outDir`](/docs#konfiguracziya-outdir)):
>
>     { "extends": "./.svelte-kit/tsconfig.json" }


#### tsconfig.json

Сгенерированный файл `.svelte-kit/tsconfig.json` содержит смесь опций. Некоторые из них генерируются программно на основе конфигурации вашего проекта и, как правило, не должны быть переопределены без уважительной причины:

```json
// file: .svelte-kit/tsconfig.json
{
 	"compilerOptions": {
 		"baseUrl": "..",
 		"paths": {
 			"$lib": "src/lib",
 			"$lib/*": "src/lib/*"
 		},
 		"rootDirs": ["..", "./types"]
 	},
 	"include": ["../src/**/*.js", "../src/**/*.ts", "../src/**/*.svelte"],
 	"exclude": ["../node_modules/**", "./**"]
}
```

Другие необходимы для правильной работы SvelteKit, а также должны оставаться нетронутыми, если вы не знаете, что делаете:

```json
// file: .svelte-kit/tsconfig.json
{
	"compilerOptions": {
		// это гарантирует, что типы явно
		// импортируется с `import type`, который
		// необходимо, так как svelte-preprocess не может
		// в противном случае правильно компилируйте компоненты
		"importsNotUsedAsValues": "error",

		// Vite компилирует один модуль TypeScript
		// за раз, а не компилировать
		// весь график модуля
		"isolatedModules": true,

		// TypeScript не может "видеть", когда вы
		// используйте импортированное значение в вашем
		// разметка, поэтому нам это нужно
		"preserveValueImports": true,

		// Настройки для праивильной работы
 		// `svelte-kit build` и `svelte-kit package`
 		"lib": ["esnext", "DOM"],
 		"moduleResolution": "node",
 		"module": "esnext",
 		"target": "esnext"
	}
}
```