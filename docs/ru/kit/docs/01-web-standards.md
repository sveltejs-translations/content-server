---
title: Веб-стандарты
---

В этой документации вы увидите ссылки на стандартные [Web API](https://developer.mozilla.org/en-US/docs/Web/API), на основе которого SvelteKit строит. Вместо того, чтобы заново изобретать колесо, мы _используем платформу_, что означает, что ваши существующие навыки веб-разработки применимы к SvelteKit. И наоборот, время, потраченное на изучение SvelteKit, поможет вам стать лучшим веб-разработчиком в другом месте.

Эти API доступны во всех современных браузерах и во многих небраузерных средах, таких как Cloudflare Workers, Deno и Vercel Edge Functions. Во время разработки и в [адаптерах](#adaptery) для сред на основе NodeJS (включая AWS Lambda) они доступны через полифиллы, где это необходимо (пока - Node быстро добавляет поддержку большего количества веб-стандартов).

В частности, вы освоитесь со следующим:

### Fetch APIs

SvelteKit использует [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) для получения данных из сети. Он доступен в [хуках](#huki) и [эндпоинтах](#marshruty-endpointy), а также в браузере.

> Специальная версия `fetch` доступна в функциях [`load`](#zagruzka-dannyh) для вызова эндпоинтов непосредственно во время рендеринга на стороне сервера, без вызова HTTP, сохраняя при этом учетные данные. (Чтобы сделать учетные данные в коде на стороне сервера за пределами `load`, вы должны явно передать заголовки `cookie` и/или `authorization`.) Это также позволяет делать относительные запросы, но для выборки на стороне сервера обычно требуется полный URL-адрес.

Помимо самой `fetch`, [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) включает в себя следующие интерфейсы:

#### Request

Экземпляр [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) доступен в [хуках](#huki) и [эндпоинтах](#marshruty-endpointy) как `event.request`. Он содержит полезные методы, такие как `request.json()` и `request.formData()`, например, для получения данных, которые были размещены на эндпоинте.

#### Response

Экземпляр [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) возвращается из `await fetch(...) `. По сути, приложение SvelteKit - это машина для превращения `Request` в `Response`.

#### Headers

Интерфейс [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) позволяет читать входящие `request.headers` и устанавливать исходящие `response.headers`:

```js
// @errors: 2461
/// file: src/routes/what-is-my-user-agent.js
/** @type {import('@sveltejs/kit').RequestHandler} */
export function get(event) {
// log all headers
    console.log(...event.request.headers);

    return {
        body: {
            // retrieve a specific header
            userAgent: event.request.headers.get('user-agent')
        }
    };
}
```

### URL APIs

URL-адреса представлены интерфейсом [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL), который включает в себя полезные свойства, такие как `origin` и `pathname` (и, в браузере, `hash`). Этот интерфейс отображается в различных местах — `event.url` в [хуках](#huki) и [эндпоинтах](#marshruty-endpointy), [`$page.url`](#moduli-$app-stores) в [pages](#marshruty-straniczy), `from` и `to` в [`beforeNavigate` и `afterNavigate`] (#moduli-$app-navigation) и так далее.

#### URLSearchParams

Где бы вы ни столкнулись с URL-адресом, вы можете получить доступ к параметрам запроса через `url.searchParams`, который является экземпляром [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams):

```js
// @filename: ambient.d.ts
declare global {
    const url: URL;
}

export {};

// @filename: index.js
// ---cut---
const foo = url.searchParams.get('foo');
```

### Web Crypto

[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) доступен через глобальный объект "crypto". Он используется внутри для заголовков [Политика безопасности контента](#konfiguracziya-csp), но вы также можете использовать его для таких вещей, как генерация UUID:

```js
const uuid = crypto.randomUUID();
```