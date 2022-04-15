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

[`RequestHandler`](#sveltejs-kit-requesthandler) и [`Load`](#sveltejs-kit-load) типы оба принимают аргумент `Params`, позволяя вам ввести объект `params`. Например, этот эгдпоинт ожидает параметры `foo`, `bar` и `baz`:

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
/// file: .svelte-kit/types/src/routes/[foo]/[bar]/[baz].d.ts
/// link: false
import type { RequestHandler as GenericRequestHandler, Load as GenericLoad } from '@sveltejs/kit';

export type RequestHandler<Body = any> = GenericRequestHandler<
{ foo: string; bar: string; baz: string },
Body
>;

export type Load<
 	InputProps extends Record<string, any> = Record<string, any>,
 	OutputProps extends Record<string, any> = InputProps
> = GenericLoad<{ foo: string; bar: string; baz: string }, InputProps, OutputProps>
```

Эти файлы можно импортировать в конечные точки и страницы в качестве братьев и сестер благодаря опции [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs) в конфигурации TypeScript:

```js
/// file: src/routes/[foo]/[bar]/[baz].js
// @filename: [baz].d.ts
import type { RequestHandler as GenericRequestHandler, Load as GenericLoad } from '@sveltejs/kit';

export type RequestHandler<Body = any> = GenericRequestHandler<
{ foo: string, bar: string, baz: string },
Body
>;

// @filename: index.js
// @errors: 2355
// ---cut---
/** @type {import('./[baz]').RequestHandler} */
export async function get({ params }) {
// ...
}
```

```svelte
<script context="module">
/** @type {import('./[baz]').Load} */
export async function load({ params, fetch, session, stuff }) {
	// ...
}
</script>
```

> Чтобы это сработало, ваш собственный `tsconfig.json` или `jsconfig.json` должен расширяться от сгенерированного `.svelte-kit/tsconfig.json` (где `.svelte-kit` - ваш [`outDir`](/docs#konfiguracziya-outdir)):
>
>     { "extends": "./.svelte-kit/tsconfig.json" }
