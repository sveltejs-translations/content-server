---
title: TypeScript
---

Все API в SvelteKit полностью набраны. Кроме того, можно сказать SvelteKit, как печатать объекты внутри вашего приложения, объявив пространство имен «App». По умолчанию новый проект будет иметь файл с именем `src/app.d.ts`, содержащий следующее:

```ts
/// <reference types="@sveltejs/kit" />
declare namespace App {
 	interface Locals {}
 	interface Platform {}
 	interface Session {}
 	interface Stuff {}
}
```

Заполнив эти интерфейсы, вы получите безопасность типов при использовании `event.locals`, `event.platform`, `session` и `stuff`:

### App.Locals

Интерфейс, который определяет `event.locals`, доступ к которому можно получить в [hooks](#huki) (`handle`, `handleError` и `getSession`) и [endpoints](#marshruty-endpointy).

### App.Platform

Если ваш адаптер предоставляет [контекст, специфичный для платформы] (#adaptery-podderzhivaemye-platformy-kontekst-speczifichnyj-dlya-platformy) через `event.platform`, вы можете указать его здесь.

### App.Session

Интерфейс, который определяет `session`, как аргумент для функций [`load`](#zagruzka-dannyh), так и значение [session store](#moduli-$app-stores).

### App.Stuff

Интерфейс, который определяет `stuff`, как вход или вывод в [`load`](#zagruzka-dannyh) или как значение свойства `stuff` [page store](#moduli-$app-stores).