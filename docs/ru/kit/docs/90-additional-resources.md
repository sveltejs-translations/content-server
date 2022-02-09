---
title: Дополнительные ресурсы
---

### FAQ

Прочтите [SvelteKit FAQ](/faq), чтобы найти решения типичных проблем, а также полезные советы и рекомендации.

[Svelte FAQ](https://ru.svelte.dev/faq) и [`vite-plugin-svelte` FAQ](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md) также могут быть полезны для вопросов, касающихся этих библиотек.

### Примеры

Мы написали и опубликовали несколько различных сайтов на Sveltekit в качестве примеров:

- [`sveltejs/realworld`](https://github.com/sveltejs/realworld) пример блога
- [директория `sites/kit.svelte.dev`](https://github.com/sveltejs/kit/tree/master/sites/kit.svelte.dev) содержит код этого сайта
- [`sveltejs/sites`](https://github.com/sveltejs/sites) содержит код [svelte.dev](https://github.com/sveltejs/sites/tree/master/sites/svelte.dev) и клона [HackerNews]

Пользователи SvelteKit также опубликовали множество примеров на GitHub с тегами [#sveltekit](https://github.com/topics/sveltekit) и [#sveltekit-template](https://github.com/topics/sveltekit-template), а также на сайте [Svelte Society](https://sveltesociety.dev/templates#svelte-kit). Имейте ввиду, что некоторые из этих сайтов могут быть уже устаревшими

### Интеграции

[`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess) автоматически преобразует код в шаблонах Svelte, чтобы обеспечить поддержку TypeScript, PostCSS, Scss/Sass, Less и многих других подобных технологий (кроме CoffeeScript, который [не поддерживается](https://github.com/sveltejs/kit/issues/2920#issuecomment-996469815) SvelteKit). Первым шагом настройки является добавление `svelte-preprocess` в [`svelte.config.js`](#konfiguracziya). Этот файл уже существует в TypeScript шаблоне, а если используется шаблон JavaScript, нужно будет создать его. После этого обычно нужно только установить соответствующую библиотеку, например `npm install -D sass` или `npm install -D less`. Дополнительную информацию ищите в документации [`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess).

[Дополнения Svelte](https://sveltesociety.dev/templates#adders) позволяют настроить множество различных сложных интеграций, таких как Tailwind, PostCSS, Firebase, GraphQL, mdsvex и многое другое, с помощью одной команды. Полный список шаблонов, компонентов и инструментов, доступных для использования со Svelte и SvelteKit, ищите на сайте [sveltesociety.dev](https://sveltesociety.dev/).

В SvelteKit FAQ также есть [раздел об интеграции](/faq#integrations), который может быть полезен, если вы столкнетесь с какими-либо проблемами.


### Поддержка

Вы можете обратиться за помощью в русскоязычный канал [Telegram](https://t.me/sveltejs), [Discord](https://svelte.dev/chat) и [StackOverflow](https://stackoverflow.com/questions/tagged/sveltekit). Пожалуйста, сначала поищите информацию, касающуюся вашей проблемы, в FAQ, Google или другой поисковой системе, в Issue на GitHub и историях чатов, чтобы не отнимать время у других. Это поможет сообществу развиваться быстрее, потому, что людей, задающих вопросы, гораздо больше, чем отвечающих на них.
