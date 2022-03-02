---
title: "Что нового в Svelte: Март 2022"
description: "Скоро Svelte Summit Spring... и эндпоинты страницы уже здесь!"
author: Daniel Sandoval
authorURL: https://desandoval.net
---

Только что объявлено: [Svelte Summit Spring](https://www.sveltesummit.com/) состоится 30 апреля 2022 года. 5-я виртуальная конференция Svelte [ищет докладчиков](https://www.sveltesummit.com/#speakers) и [спонсоров](https://www.sveltesummit.com/sponsors)... пришло время стереть пыль с этих предложений!

Кроме того, в этом месяце в SvelteKit были добавлены некоторые давно запрошенные функции... включая эндпоинты страниц! Это изменение в работе функции `load` облегчает получение данных, необходимых для основных страниц, перенаправление из ответов POST и обработку 404 и других ошибок.

Подробнее об этой и других новых функциях и исправлениях ниже!

## Что нового в SvelteKit
- В Документах теперь есть поиск и они стали многостраничными, с определениями типов и примерами кода с подсказками - Проверьте их по адресу [kit.svelte.dev/docs](https://kit.svelte.dev/docs/)
- Эндпоинты страницы значительно уменьшают шаблон, необходимый при загрузке страницы ([Issue](https://github.com/sveltejs/kit/issues/3532), [PR](https://github.com/sveltejs/kit/pull/3679), [Docs](https://kit.svelte.dev/docs/routing#endpoints-page-endpoints))
- Поддержка управления версиями и обнаружения обновлений приложений позволяет определить, что делать, если маршрут не загружается после обновления приложения ([Issue](https://github.com/sveltejs/kit/issues/87), [PR](https://github.com/sveltejs/kit/pull/3412), [Docs](https://kit.svelte.dev/docs/configuration#version))
- Новая опция в `npm init svelte@next` теперь автоматически настроит Playwright для тестирования ([PR](https://github.com/sveltejs/kit/pull/4056))


**Breaking Changes**
- Опция `target` больше недоступна. Вместо этого скрипт `init` гидрирует `parentNode` ([#3674](https://github.com/sveltejs/kit/pull/3674))
- Типы на уровне приложений теперь живут в пространстве имен `App`, что позволяет вводить глобальные типы, такие как `Stuff` или `Session` ([#3670](https://github.com/sveltejs/kit/pull/3670))
- `JSONString` теперь `JSONValue` ([#3683](https://github.com/sveltejs/kit/pull/3683))
- `createIndexFiles` был удален - теперь он контролируется опцией `trailingSlash` ([#3801](https://github.com/sveltejs/kit/pull/3801))
- SvelteKit больше не будет исключать внешние ссылки относительно корня из предварительного рендеринга, что вызовет 404, если эти URL-адреса предназначены для обслуживания отдельным приложением. Используйте пользовательский обработчик [`prerender.onError`](https://kit.svelte.dev/docs/configuration#prerender), если вам нужно игнорировать их ([#3826](https://github.com/sveltejs/kit/pull/3826))


## Новое в языковых инструментах
- Улучшен доступ к свойствам в разметке ([105.12.0](https://github.com/sveltejs/language-tools/releases/tag/extensions-105.12.0)) - обход некоторых известных проблем с автозаполнением ([#538](https://github.com/sveltejs/language-tools/issues/538) / [#1302](https://github.com/sveltejs/language-tools/issues/1302))


---

## Крутые примеры сообщества

**Приложения и сайты**

- [SvelteStorm](https://github.com/open-source-labs/SvelteStorm) специально разработан для предоставления всех основных инструментов, необходимых разработчику Svelte для создания приложения Svelte
- [Supachat](https://github.com/Lleweraf/supachat) - приложение для чата в реальном времени, использующее Svelte и Supabase
- [Radicle](https://radicle.xyz/) - одноранговый стек для совместного создания программного обеспечения
- [The Making Known](https://the-making-known.com/) - рассказанная встреча с плакатами, разработанными нацистским правительством Германии для общения с оккупированными странами Бельгии, Франции и Люксембурга во время Второй мировой войны.
- [Svelte Kanban](https://github.com/V-Py/svelte-kanban) - простой Svelte Kanban, сделанный в чистом CSS
- [fngrng](https://github.com/nvlgzr/fngrng) - тренер по набору текста, ориентированный на точность, а не скорость
- [Generative grids](https://svelte.dev/repl/873988ce33db43f097c0ca69df57b3ac?Version=3.46.4) - аккуратная маленькая генеративная сетка SVG в Svelte REPL со случайно сгенерированными цветовыми палитрами и фигурами
- [LifeHash](https://github.com/BlockchainCommons/lifehash.info) - метод визуализации хэша, который создает красивые, детерминированные иконки
- [TypedWebhook.tools](https://typedwebhook.tools/) - инструмент тестирования webhook для проверки полезной нагрузки с автоматической генерацией типов
- [Speedskating](https://github.com/spiegelgraphics/speedskating) - виджет анимации для показа олимпийских скоростных трасс. Построено с помощью Svelte, D3 и regl
- [Web tail](https://github.com/mishankov/web-tail) - веб-приложение для просмотра строк из файла в локальной системе или на удаленном сервере

Хотите работать над сайтом SvelteKit вместе с другими [попробуйте внести свой вклад в сайт Svelte Society](https://github.com/svelte-society/sveltesociety-2021/issues)!


**Обучающие ресурсы**

_Читать_
- [Svelte Components как Web Components](https://medium.com/@yesmeno/svelte-components-as-web-components-b400d1253504) Матиаса Мено
- [Простая маршрутизация Svelte с реактивными URL-адресами](https://bjornlu.com/blog/simple-svelte-routing-with-reactive-urls) Бьорна Лу
- [Выравнивание моего контента в блоге Sveltekit / Sanity.io с избранными видео и подсветкой синтаксиса](https://ryanboddy.net/level-up-blog) Райана Бодди
- [Как делался этот блог максимально используя GitHub](https://paullj.github.io/posts/how-this-blog-makes-the-most-of-github/) от paullj
- [FullStack JWT Auth: Introducing SvelteKit](https://dev.to/sirneij/fullstack-jwt-introducing-sveltekit-3jcn) Джона Идогуна
- [Svelte-Cubed: Добавление движения в 3D-сцены](https://dev.to/alexwarnes/svelte-cubed-adding-motion-to-3d-scenes-51lo) Алекса Уорнса
- [Создание RSS-канала с помощью Sanity and Svelte Kit](https://ghostdev.xyz/posts/creating-a-rss-feed-with-sanity-and-svelte-kit) от GHOST
- [Как использовать директиву style Svelte](https://geoffrich.net/posts/style-directives/) Джеффа Рича
- [SvelteKit и "Схема клиента"](https://retro.cloud/sveltekit-and-the-client-pattern/) Джулиана Лаубштейна

_Смотреть_
- [~~Теневые~~ Эндпоинты Страницы В Svelte Kit - Еженедельный Svelte](https://www.youtube.com/watch?v=PoYPZT7ruqI) от LevelUpTuts
- [Тестирование Для Начинающих (плейлист)](https://www.youtube.com/watch?v=y53wwdBr5AI&list=PLA9WiRZ-IS_z7KpqhPELfEMbhAGRwZrzn) от Joy of Code
- [KitQL - Родная библиотека SvelteKit для GraphQL](https://www.youtube.com/watch?v=6pH4fnFN70w) Жан-Ива КУЭ


**Библиотеки, инструменты и компоненты**
- [gosvelte](https://github.com/sachinbhutani/gosvelte) является доказательством концепции обслуживания страниц, созданных Svelte, на HTTP-сервере GoLang, при этом данные сервера отправляются в качестве реквизита в компоненты svelte
- [svelte-ethers-store](https://www.npmjs.com/package/svelte-ethers-store) использует библиотеку ethers.js в качестве коллекции читаемых магазинов Svelte для Svelte, Sapper или SvelteKit
- [Fluid Grid](https://fluid-grid.com/) - грид-система CSS для будущего веб-сайта
- [stirstack](https://github.com/seeReadCode/stirstack) - самоуверенный фреймворк, который сочетает в себе Svelte.js, TailwindCSS, InertiaJS и Ruby on Rails
- [OATHqr](https://codeberg.org/vhs/oathqr) помогает пользователям создавать учетные данные безопасности для использования с 2FA/MFA и другими приложениями с поддержкой OATH. Используйте его для генерации сканируемых QR-кодов для одноразовых приложений аутентификации паролей, таких как Aegis или YubiKey
- [svelte-GridTiles](https://github.com/honeybeeSunshine/svelte-GridTiles) - библиотека плиток с изменением перетаскивания, построенная на отзывчивой сетке
- [Miscellaneous Svelte Components](https://github.com/alex-knyaz/Miscellaneous-svelte-components/) - коллекция различных svelte-компонентов alex-knyaz, часто используемых в моих проектах
- [walk-and-graph-svelte-components](https://github.com/j2l/walk-and-graph-svelte-components) - сценарий узла CLI для обхода файлов svelte и js, чтобы нарисовать красивый JPG ваших зависимостей, иначе "импорт"
- [Felte](https://www.npmjs.com/package/felte) - простая в использовании библиотека форм для Svelte
- [svelte-use-tooltip](https://github.com/untemps/svelte-use-tooltip) - Svelte-экшен для отображения подсказки
- [Persistent-svelte-store](https://github.com/omer-g/persistent-svelte-store) - универсальное постоянно записываемое хранилище, построенное с нуля в TypeScript в соответствии с контрактом хранилищ Svelte

Мы что-то пропустили? Нужна помощь в реализации вашей следующей идеи в Svelte? Присоединяйтесь к нам на [Reddit](https://www.reddit.com/r/sveltejs/) или [Discord](https://discord.com/invite/yy75DKs).

Увидимся в следующем месяце!
