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