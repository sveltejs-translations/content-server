---
title: TypeScript
---

Все API в SvelteKit полностью типизированы. Также можно указать SvelteKit, как типизировать объекты внутри приложения, объявив пространство имен `App`. По умолчанию новый проект будет иметь файл с именем `src/app.d.ts`, содержащий следующее:

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

### App.Locals

Интерфейс, который определяет `event.locals`, доступ к которому можно получить в [хуках](#huki) (`handle`, `handleError` и `getSession`) и [эндпоинтах](#marshruty-endpointy).

### App.Platform

Если текущий адаптер предоставляет [контекст платформы](#adaptery-podderzhivaemye-platformy-kontekst-speczifichnyj-dlya-platformy) через `event.platform`, укажите его здесь.

### App.Session

Интерфейс, который определяет объект `session`, как аргумента для функций [`load`](#zagruzka-dannyh), так и значения [хранилища session](#moduli-$app-stores).

### App.Stuff

Интерфейс, который определяет объект `stuff` во входных и выходных данных функции [`load`](#zagruzka-dannyh), а так же в значении свойства `stuff` в [хранилище page](#moduli-$app-stores).