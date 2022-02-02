---
title: "Что нового в Svelte: Февраль 2022"
description: "Rapid-Fire Replivest через Svelte, Sveltekit и сообщество"
author: Daniel Sandoval
authorURL: https://desandoval.net
---

Всем счастливого Февраля! За последний месяц или около того, мы увидели как [быстро развивались](accelerating-sveltes-development) Svelte и Sveltekit, новые правила сообщества в [Reddit](https://www.reddit.com/r/sveltejs/comments/s9n8ou/new_rules/), [GitHub](https://github.com/sveltejs/community/blob/main/CODE_OF_CONDUCT.md) and [Discord](https://discord.com/channels/457912077277855764/831611707667382303/935264550436102315), и довольно много удивительных приложений, учебников и библиотек.

Посмотрим...

## Основные моменты в Svelte ChangeLog
- **3.45.0** [новый a11y warning `a11y-no-redundant-roles`](https://svelte.dev/docs#accessibility-warnings-a11y-no-redundant-roles), исправлена деструктуризация и кеширование
- **3.46.0** [`{@const}` tag](https://svelte.dev/docs#template-syntax-const) и [`style:` directive](https://svelte.dev/docs#template-syntax-element-directives-style-property)
- В версиях **3.46.1 - 3.46.3** исправлены баги тега `{@const}` и директивы `style:`, вместе с рядом исправлений к анимациям
- [AST output is now available in the Svelte REPL](https://svelte.dev/repl/hello-world)

## Что нового в SvelteKit
- `inlineStyleThreshold` позволяет указать, куда встроенные таблицы стилей вставляются на страницу ([Docs](https://kit.svelte.dev/docs#configuration-inlinestylethreshold), [#2620](https://github.com/sveltejs/kit/pull/2620))
- Функции жизненного цикла `beforeNavigate`/`afterNavigate` позволяют добавлять функциональность до или после навигации по странице ([Docs](https://kit.svelte.dev/docs#modules-$app-navigation), [#3293](https://github.com/sveltejs/kit/pull/3293))
- Контекст платформы теперь может передаваться с адаптеров ([Docs](https://kit.svelte.dev/docs#adapters-supported-environments-platform-specific-context), [#3429](https://github.com/sveltejs/kit/pull/3429))
- Хуки теперь имеют параметр `ssr` в `resolve`, чтобы облегчить пропуск SSR, когда это необходимо ([Docs](https://kit.svelte.dev/docs#hooks-handle), [#2804](https://github.com/sveltejs/kit/pull/280
- `$page.stuff` предоставляет страницам механизм передачи данных «вверх» на макеты ([Docs](https://kit.svelte.dev/docs#loading-input-stuff), [#3252](https://github.com/sveltejs/kit/pull/3252))
- Fallthrough routes позволяют указать, куда маршрутизировать, когда маршрут не может быть загружен ([Docs](https://kit.svelte.dev/docs#routing-advanced-fallthrough-routes), [#3217](https://github.com/sveltejs/kit/pull/3217))

**Новое в конфиге**
- Политика безопасности контента (CSP) теперь поддерживается для повышения безопасности при использовании встроенных javascript или таблиц стилей ([Docs](https://kit.svelte.dev/docs#configuration-csp), [#3499](https://github.com/sveltejs/kit/pull/3499))
- Конфигурация `kit.routes` позволяет настраивать публичные/частные модули во время сборки ([Docs](https://kit.svelte.dev/docs#configuration-routes), [#3576](https://github.com/sveltejs/kit/pull/3576))
- Конфигурация `prerender.createIndexFiles` позволяет предварительно рендерить файлы index.html в качестве имени их подпапки ([Docs](https://kit.svelte.dev/docs#configuration-prerender), [#2632](https://github.com/sveltejs/kit/pull/2632))
- Методы HTTP теперь можно переопределить с помощью `kit.methodOverride` ([Docs](https://kit.svelte.dev/docs#routing-endpoints-http-method-overrides), [#2989](https://github.com/sveltejs/kit/pu

**Изменения в конфиге**
- `config.kit.hydrate` и `config.kit.router` теперь вложены в `config.kit.browser` ([Docs](https://kit.svelte.dev/docs#configuration-browser), [3578](https://github.com/sveltejs/kit/pull/3578))

**Критические изменения**
- использование объектов Request и Response в эндпоинтах и хуках ([#3384](https://github.com/sveltejs/kit/pull/3384))


---

## Крутые примеры сообщества

**Приложения и сайты**
- [timb(re)](https://paullj.github.io/timb) — среда программирования живой музыки.
- [Музыка для программирования](https://musicforprogramming.net/latest/) представляет собой серию миксов, предназначенных для прослушивания во время `${task}`, чтобы сосредоточить мозг и вдохновить его.
- [Team Tale](https://teamtale.app/) позволяет двум авторам написать одну и ту же историю в стиле команды тегов.
- [Puzzlez](https://www.puzzlez.io/) — онлайн-площадка для игры в судоку и Wordle.
- [Closed Caption Creator](https://www.closedcaptioncreator.com/) позволяет легко добавлять субтитры к вашему видео в Windows, Mac и Google Chrome.
- [SC3Lab](https://sc3-lab.netlify.app/) — генератор кода для экспериментов с svelte-cubed и three.js.
- [Donkeytype](https://github.com/0ql/Donkeytype) — это минималистичный и легкий тест набора текста, вдохновленный Monkeytype.
- [Выше](https://above.silas.pro/) — это визуальный таймер, созданный для людей с СДВГ/аутизмом.
- [base.report](https://base.report/) — современная исследовательская платформа для серьезных инвесторов
- [String](https://string.kampsy.xyz/) превращает ваш телефон в безопасный портативный диктофон, позволяя легко записывать и делиться личными заметками, семейными моментами, лекциями в классе и многим другим.
- [The Raytracer Challenge REPL](https://github.com/jakobwesthoff/the_raytracer_challenge_repl) предоставляет интерфейс живого редактора для настройки сцены с трассировкой лучей и визуализации ее в реальном времени в любом современном браузере.
- [awesome-svelte-kit](https://github.com/janosh/awesome-svelte-kit) — список замечательных примеров использования SvelteKit в дикой природе.
- [Обозреватель картографических проекций](https://www.geo-projections.com/) позволяет исследовать различные картографические проекции и объясняет их различия.
- [Рубикс](https://github.com/MeharGaur/rubiks) — симулятор кубика Рубика.
- [Pianisto](https://pianisto.net/) - рабочее пианино, созданное с помощью SVG, ToneJS и большого терпения.

Хотите работать над сайтом SvelteKit вместе с другими [попробуйте внести свой вклад в сайт Svelte Society](https://github.com/svelte-society/sveltesociety-2021/issues)!


**Обучение**

_Почитать_
[Ускорение разработки Svelte](https://svelte.dev/blog/accelerating-sveltes-development) Бена Макканна
- [Сборник рассказов для Vite] (https://storybook.js.org/blog/storybook-for-vite/)
- [Давайте изучим SvelteKit, создав с нуля статический блог Markdown](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog) Джоша Коллинсворта.
- [Создание приложения для iOS с помощью Svelte, Capacitor и Firebase](https://harryherskowitz.com/2022/01/05/tapedrop-app.html), Гарри Херсковиц.
- [Изменение параметров запроса в SvelteKit без перезагрузки страницы или навигации](https://dev.to/mohamadharith/mutating-query-params-in-sveltekit-without-page-reloads-or-navigations-2i2b) и [Обходной путь для Всплывающие пользовательские события в Svelte](https://dev.to/mohamadharith/workaround-for-bubbling-custom-events-in-svelte-3khk) Мохамада Харита
- [Как создать бессерверное приложение полного стека с помощью Svelte и GraphQL](https://dev.to/shadid12/how-to-build-a-full-stack-serverless-application-with-svelte-graphql-and-fauna-5427) Шадида Хака
- [Как развернуть приложения SvelteKit на страницах Github](https://sveltesaas.com/articles/sveltekit-github-pages-guide/)
- [Создание dApp с помощью SvelteKit](https://anthonyriley.org/2021/12/31/creating-a-dapp-with-sveltekit/) Энтони Райли
- [Сравнение параметров реактивности Svelte](https://opendirective.net/2022/01/06/comparing-svelte-reactivity-options/) Стива Ли.

_Посмотреть_
 [Интеграция сборника рассказов со SvelteKit](https://www.youtube.com/watch?v=Kc1ULlfyUcw) и [Интеграция FaunaDB со Svelte](https://www.youtube.com/watch?v=zaoLZc76uZM) от Стройные сирены
- [Учебное пособие по ускоренному курсу SvelteKit] (https://www.youtube.com/watch?v=9OlLxkaeVvw&list=PL4cUxeGkcC9hpM9ARM59Ve3jqcb54dqiP) от The Net Ninja
- [Svelte для начинающих](https://www.youtube.com/watch?v=BrkrOjknC_E&list=PLA9WiRZ-IS_ylnMYxIFCsZN6xVVSvLuHk) от Joy of Code
- [SvelteKit для начинающих | Учебное пособие по приложению для фильмов](https://www.youtube.com/watch?v=ydR_M0fw9Xc) от Dev Ed
- [SvelteKit $app/stores](https://www.youtube.com/watch?v=gBPhr1xbgaQ) от lihautan
- [Sveltekit - Получить все маршруты/страницы](https://www.youtube.com/watch?v=Y_NE2R3HuOU) от WebJeda

_Послушать_
- [Новый год, новый Svelte!?](https://share.transistor.fm/s/36212cdc) от Svelte Radio
- [So much Sveltey goodness (с участием Рича Харриса)](https://changelog.com/jsparty/205) от JS Party
- [Другая сторона технологий: документальная перспектива (со Стефаном Кингхэмом)](https://codingcat.dev/podcast/2-4-the-other-side-of-tech-a-documentarian-perspective) от Purrfect. .dev

**Библиотеки, инструменты и компоненты**
- [threlte](https://github.com/grischaerbe/threlte) — это библиотека компонентов из трех.js для Svelte.
- [svelte-formify](https://github.com/nodify-at/svelte-formify) — это библиотека для управления и проверки форм, которая использует декораторы для определения проверок.
- [gQuery] (https://github.com/leveluptuts/gQuery) — это сборщик и кеширование GraphQL для Svelte Kit.
- [Протокол разблокировки](https://github.com/novum-insights/sveltekit-unlock-firebase) — это интеграция, помогающая войти в систему с помощью клиентов MetaMask, Firebase и платного доступа.
- [AgnosticUI](https://github.com/AgnosticUI/agnosticui) представляет собой набор примитивов пользовательского интерфейса, которые начинают свою жизнь в чистом HTML и CSS.
- [Vitebook] (https://github.com/vitebook/vitebook) — это быстрая и легкая альтернатива Storybook на базе Vite.
- [SwyxKit] (https://swyxkit.netlify.app/) — это самоуверенная стартовая площадка для блогов SvelteKit + Tailwind + Netlify. Обновление к 2022 году!
- [svelte-themes](https://github.com/beynar/svelte-themes) — это абстракция для тем в вашем приложении SvelteKit.
- [svelte-transition](https://www.npmjs.com/package/svelte-transition) — это компонент Svelte, упрощающий использование переходов на основе классов CSS — идеально подходит для использования с TailwindCSS.
- [Svelte Inview](https://www.npmjs.com/package/svelte-inview) — это действие Svelte, которое отслеживает, как элемент входит или выходит из области просмотра/родительского элемента.
- [svelte-inline-compile](https://github.com/DockYard/svelte-inline-compile) — это преобразование babel, которое обеспечивает гораздо более приятный опыт тестирования компонентов svelte с использованием Jest и `@testing-library/ стройный`
- [@feltcoop/svelte-mutable-store](https://github.com/feltcoop/svelte-mutable-store) — это хранилище Svelte для изменяемых значений с параметром компилятора immutable.
- [headless-svelte-ui](https://www.npmjs.com/package/@bojalelabs/headless-svelte-ui) — это группа безголовых компонентов, которые можно использовать при создании приложений Svelte.

Мы что-то пропустили? Нужна помощь в реализации вашей следующей идеи в Svelte? Присоединяйтесь к нам на [Reddit](https://www.reddit.com/r/sveltejs/) или [Discord](https://discord.com/invite/yy75DKs).

Увидимся в следующем месяце!
