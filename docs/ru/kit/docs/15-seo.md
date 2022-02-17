---
title: SEO
---

Самым важным аспектом SEO является создание высококачественного контента, который широко связан со всем Интернетом. Тем не менее, есть несколько технических соображений для создания сайтов, которые хорошо ранжируются.

### Из коробки

#### SSR

В то время как поисковые системы в последние годы стали лучше индексировать контент, отображаемый с помощью клиентского JavaScript, контент, отображаемый на стороне сервера, индексируется чаще и надежнее. SvelteKit использует SSR по умолчанию, и хотя вы можете отключить его в [`handle`](#huki-handle), вы должны оставить его включенным, если у вас нет веской причины не делать этого.

> Рендеринг SvelteKit легко настраивается, и при необходимости вы можете реализовать [динамический рендеринг](https://developers.google.com/search/docs/advanced/javascript/dynamic-rendering). Обычно это не рекомендуется, поскольку SSR имеет и другие преимущества помимо SEO.

#### Производительность

Такие сигналы, как [Core Web Vitals](https://web.dev/vitals/#core-web-vitals), влияют на ранжирование в поисковых системах. Поскольку Svelte и SvelteKit создают минимальные накладные расходы, проще создавать высокопроизводительные сайты. Вы можете проверить производительность своего сайта с помощью Google [PageSpeed ​​Insights](https://pagespeed.web.dev/) или [Lighthouse](https://developers.google.com/web/tools/lighthouse).

#### Нормализованные URL

SvelteKit перенаправляет пути с косой чертой в конце на пути без косой черты (или наоборот, в зависимости от вашей [конфигурации](#konfiguracziya-trailingslash)), поскольку повторяющиеся URL-адреса вредны для SEO.

### Ручная настройка

#### `title` и `meta`

Каждая страница должна иметь хорошо написанные и уникальные элементы `<title>` и `<meta name="description">` внутри [`<svelte:head>`](https://ru.svelte.dev/docs#sintaksis-shablonov-svelte-head). Руководство по написанию описательных заголовков и описаний, а также другие рекомендации по обеспечению понятности контента для поисковых систем можно найти в документации Google [Lighthouse SEO-аудиты] (https://web.dev/lighthouse-seo/).

> Распространенным шаблоном является возврат связанных с SEO [`stuff`](s#zagruzka-dannyh-vozvrashhaemye-znacheniya-stuff) из функций загрузки страницы, а затем их использование (как [`$page.stuff`](#moduli-$app-stores)) в `<svelte:head>` в вашем корневом [макете](#makety).

#### Структурированные данные

[Структурированные данные](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data) помогают поисковым системам понять содержание страницы. Если вы используете структурированные данные вместе с [`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess), вам нужно будет явно сохранить данные `ld+json` (это [может измениться в будущем ](https://github.com/sveltejs/svelte-preprocess/issues/305)):


```js
// svelte.config.js
import preprocess from 'svelte-preprocess';
export default {
	preprocess: preprocess({
		preserve: ['ld+json'],
		// ...
	})
};
```

#### Карта сайта

[Карта сайта](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap) помогает поисковым системам определять приоритетность страниц вашего сайта, особенно если у вас большой объем контента. Вы можете создать карту сайта динамически, используя эндпоинт:

```js
// src/routes/sitemap.xml.js
export async function get() {
	return {
		headers: {
			'Content-Type': 'application/xml'
		},
		body: `
			<?xml version="1.0" encoding="UTF-8" ?>
			<urlset
				xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
				xmlns:xhtml="https://www.w3.org/1999/xhtml"
				xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
				xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
				xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
				xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
			>
				<!-- <url> elements go here -->
			</urlset>
		`.trim()
	};
}
```

#### AMP

Печальная реальность современной веб-разработки заключается в том, что иногда необходимо создать версию вашего сайта [Accelerated Mobile Pages (AMP)](https://amp.dev/). В SvelteKit это можно сделать, установив параметр конфигурации [`amp`](#konfiguracziya-amp), который имеет следующие эффекты:

- Клиентский JavaScript, включая маршрутизатор, отключен.
- Стили объединяются в `<style amp-custom>`, и вводится [шаблон AMP](https://amp.dev/boilerplate/).
- В процессе разработки запросы проверяются с помощью [валидатора AMP](https://validator.ampproject.org/), поэтому вы получаете раннее предупреждение о любых ошибках.
