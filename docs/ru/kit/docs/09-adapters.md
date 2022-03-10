---
title: Адаптеры
---

Прежде чем развернуть готовое приложение SvelteKit на сервере или сервисе, его необходимо адаптировать под то окружение, в котором оно будет работать. Адаптеры - это небольшие плагины, которые на вход принимают созданное приложение и на выходе генерируют приложение, подготовленное для развертывания в определенном окружении. 

По умолчанию проекты настроены на использование `@sveltejs/adapter-auto`, который сам определяет окружение и выбирает соответствующий адаптер, где это возможно. Если же требуемая платформа пока не поддерживается, можно подключить один из [адаптеров от сообщества](#adaptery-ustanovka-polzovatelskih-adapterov) или [написать свой](#adaptery-napisanie-polzovatelskih-adapterov).

> См. [adapter-auto README](https://github.com/sveltejs/kit/tree/master/packages/adapter-auto) для получения информации о добавлении поддержки новых окружений.

### Поддерживаемые платформы

SvelteKit предлагает ряд официально поддерживаемых адаптеров.

Вы можете выполнить развертывание на следующих платформах с адаптером по умолчанию, `adapter-auto`:

- [Cloudflare Pages](https://developers.cloudflare.com/pages/) через [`adapter-cloudflare`](https://github.com/sveltejs/kit/tree/master/packages/adapter-cloudflare)
- [Netlify] (https://netlify.com) через [`adapter-netlify`](https://github.com/sveltejs/kit/tree/master/packages/adapter-netlify)
- [Vercel](https://vercel.com) через [`adapter-vercel`](https://github.com/sveltejs/kit/tree/master/packages/adapter-vercel)


#### Node.js

Чтобы создать простой Node-сервер, установите пакет [`@sveltejs/adapter-node@next`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) и обновите `svelte.config.js`:

```diff
/// file: svelte.config.js
-import adapter from '@sveltejs/adapter-auto';
+import adapter from '@sveltejs/adapter-node';
```

После этого [svelte-kit build](#svelte-kit-cli-svelte-kit-build) сгенерирует автономное приложение Node в директории `build`. Вы можете передать адаптерам параметры, например указать директорию для полученного приложения:

```diff
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
-		adapter: adapter()
+		adapter: adapter({ out: 'my-output-directory' })
	}
};
```

#### Статические сайты

Большинство адаптеров будут генерировать статический HTML для любых страниц, которые возможно [предварительно отрисовать](#parametry-straniczy-prerender). В некоторых случаях, когда можно предварительно отрисовать всё приложение, используйте [`@sveltejs/adapter-static@next`](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) для генерации статического HTML кода для _всех_ страниц. Полностью статический сайт может быть размещен на самых разных платформах и хостингах, включая [GitHub Pages](https://pages.github.com/).

```diff
/// file: svelte.config.js
-import adapter from '@sveltejs/adapter-auto';
+import adapter from '@sveltejs/adapter-static';
```

Также `adapter-static` можно использовать для создания одностраничных приложений (SPA), указав [корневую страницу](https://github.com/sveltejs/kit/tree/master/packages/adapter-static#spa-mode).

> Вы должны убедиться, что [`trailingSlash`](#konfiguracziya-trailingslash) настроен соответствующим образом для вашей среды. Если ваш хост не отображает `/a.html` при получении запроса на `/a`, вам нужно будет установить `trailingSlash: 'always'` для создания `/a/index.html`.

#### Контекст платформы

Некоторые адаптеры могут иметь доступ к дополнительной информации о запросе. Например, Cloudflare Workers может получить доступ к объекту `env`, содержащему пространства имен KV и т. д. Эта информация может быть передана как свойство `platform` в объекте `RequestEvent`, который используется в [хуках](#huki) и [эндпоинтах](#marshruty-endpointy). Ознакомьтесь с документацией нужного адаптера, чтобы узнать больше.

### Адаптеры сообщества

Для других платформ существуют дополнительные [адаптеры от сообщества](https://sveltesociety.dev/components#adapters). После установки соответствующего адаптера с помощью менеджера пакетов обновите `svelte.config.js`:

```diff
/// file: svelte.config.js
-import adapter from '@sveltejs/adapter-auto';
+import adapter from 'svelte-adapter-[x]';
```


### Создание адаптера

Мы рекомендуем скопировать и взять за основу [адаптер](https://github.com/sveltejs/kit/tree/master/packages) для платформы, которая близка к нужной.

Пакеты адаптеров должны реализовывать следующий API, который создает `Adapter`:

```js
// @filename: ambient.d.ts
const AdapterSpecificOptions = any;

// @filename: index.js
// ---cut---
/** @param {AdapterSpecificOptions} options */
export default function (options) {
/** @type {import('@sveltejs/kit').Adapter} */
    const adapter = {
        name: 'adapter-package-name',
        async adapt(builder) {
          // имплементация адаптера
        }
    };

    return adapter;
}
```

Типы для `Adapter` и его параметры доступны в [types/config.d.ts](https://github.com/sveltejs/kit/blob/master/packages/kit/types/config.d.ts).

Есть ряд вещей, которые должны быть выполнены внутри метода `adapt`:

- Очищает директорию готовой сборки
- Записывает вывод SvelteKit с помощью `builder.writeClient`, `builder.writePrerendered`, `builder.writeServer` и `builder.writeStatic`
- Создаёт код, который:
  - Импортирует `App` из `${builder.getServerDirectory()}/app.js`
  - Создаёт экземпляр приложения со сгенерированным методом `builder.generateManifest({ relativePath })` манифестом.
  - Слушает запросы от платформы, при необходимости преобразует их в стандартный [Request](https://developer.mozilla.org/ru-RU/docs/Web/API/Request)и вызывает функцию `render` для создания [Response](https://developer.mozilla.org/ru-RU/
  - предоставляет любую информацию о конкретной платформе SvelteKit с помощью опции `platform`, переданной `server.respond`
  - Глобально настроит `fetch` для работы на целевой платформе. SvelteKit предоставляет хелпер `@sveltejs/kit/install-fetch` для платформ, которые могут использовать `node-fetch`
- При необходимости, соберает модули приложения в единый бандл, чтобы избежать установки зависимостей на целевой платформе
- Помещает статические файлы пользователя и сгенерированные JS/CSS в правильное место для целевой платформы

При возможности, мы рекомендуем помещать готовое приложение в директорию `build/`, а любые промежуточные данные в директории `'.svelte-kit/' + имя_адаптера`.

> API адаптера может меняться до версии 1.0.
