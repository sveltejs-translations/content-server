---
title: "Что нового в Svelte: Май 2022"
description: "Динамическое переключение тегов HTML-элемента со <svelte:element>"
author: Daniel Sandoval
authorURL: https://desandoval.net
---

После вчерашнего саммита Svelte, у нас есть много новостей! Ознакомьтесь со всеми на [Svelte Society YouTube Channel](https://www.youtube.com/sveltesociety) и остальными обновлениями этого месяца ниже...

## Что нового в Svelte

- Элемент `<svelte:element>` позволяет визуализировать элемент динамически заданного типа. Это полезно, например, при рендеринге контента форматированного текста из CMS. Проверьте [docs](https://ru.svelte.dev/docs#template-syntax-svelte-element) или [tutorial](https://ru.svelte.dev/tutorial/svelte-element) для получения дополнительной информации (**3.47.0**)!


## Обновления Language Tools

- Теперь поддерживаются `svelte:element` и `sveltekit:reload`
- Недействительные пути импорта Svelte теперь будут автоматически обнаружены - см. PR для возвращения старого поведения ([#1448](https://github.com/sveltejs/language-tools/pull/1448))
- `source.sortImports` позволяет сортировать импорт без удаления неиспользуемого импорта ([#1338](https://github.com/sveltejs/language-tools/issues/1338))
- Наведении курсора на атрибуты HTML теперь будет отображаться информация о HTML вместо информации о TS ([#1447](https://github.com/sveltejs/language-tools/pull/1447))
- В VS Code теперь вы можете обернуть существующие блоки кода в теги потока управления с помощью команды `Insert Snippet` ([#1373](https://github.com/sveltejs/language-tools/pull/1373))

## Что нового в SvelteKit

- Файлы и каталоги теперь можно назвать `__tests__` и `__test__` в каталоге маршрутов ([#4438](https://github.com/sveltejs/kit/pull/4438))
- Функции Netlify Edge ([#4657](https://github.com/sveltejs/kit/pull/4657)) и выходной API сборки Vercel ([#4663](https://github.com/sveltejs/kit/pull/4663)) теперь поддерживаются
- Пользовательские зависимости `load`, массив строк, представляющих URL-адреса, от которых зависит страница, теперь доступны при загрузке маршрутов ([Docs](https://kit.svelte.dev/docs/loading#output-dependencies), [#4536](https://github.com/sveltejs/kit/pull/4536))


**Breaking Changes**
- Валидаторы теперь называются "matchers" ([Docs](https://ru.kit.svelte.dev/docs#marshruty-rasshirennaya-marshrutizacziya-sopostavlenie), [#4358](https://github.com/sveltejs/kit/pull/4358))
- `__layout.reset` был заменен именованными макетами, которые имеют большую настраиваемость для общих элементов макета ([Docs](https://ru.kit.svelte.dev/docs#makety-imenovannye-makety), [#4388](https://github.com/sveltejs/kit/pull/4388))
- Предварительный рендеринг теперь пропущен для ссылок `rel="external"` ([#4545](https://github.com/sveltejs/kit/pull/4545))
- `maxage` теперь `cache` в `LoadOutput` ([#4690](https://github.com/sveltejs/kit/pull/4690))


---

## Крутые примеры сообщества

**Приложения и сайты, созданные с помощью Svelte**
- [polySpectra AR](https://ar.polyspectra.com/) позволяет создавать прототип более быструю 3D-печать с бесшовной передачей AR-файлов ([видеодемонстрация](https://www.youtube.com/watch?v=VhYCeVGcG3E))
- [Pixel Art Together](https://github.com/liveblocks/pixel-art-together) - это бесплатный многопользовательский редактор пиксельного искусства на базе Liveblocks
- [Менеджер инструментов](https://tooling-manager.netlify.app/) позволяет сравнить ваш технологический стек JavaScript с стандартными шаблонами отрасли
- [Легкое портфолио](https://easy-portfolio.com/) генерирует портфолио на основе вашего профиля GitHub
- [FLOAT](https://github.com/muttoni/float) - это программа отслеживания посещаемости мероприятий
- [The Coin Perspective](https://thecoinperspective.com/) - это трекер цен на криптовалюту и инструмент управления портфелем
- [Locutionis](https://github.com/pbouillon/locutionis) - это небольшой онлайн-ссылка на фигуры речи (на французском языке)
- [ASM Editor](https://asm-editor.specy.app/) - это все в одном веб-редакторе для M68K и MIPS
- [Otium](https://github.com/alombi/otium) - это бесплатный менеджер книг с открытым исходным кодом и органайзер книжных полок, который поможет вам управлять своими книгами и теми, которые вы хотели бы прочитать.
- [Sinwaver](https://github.com/Hugo-Dz/Sinwaver) - это генератор синусоидальных волн SVG

Хотите внести свой вклад в современный сайт SvelteKit? [Помогите создать сайт Svelte Society](https://github.com/svelte-society/sveltesociety.dev/issues)!


**Образовательные ресурсы**

_Читать_
- [4 совета для более чистых компонентов Svelte](https://geoffrich.net/posts/clean-component-tips/) Джеффа Рича
- [Построение клона Clubhouse со Svelte и 100 мс](https://www.100ms.live/blog/clubhouse-clone-with-svelte) Сын Тайво
- [SvelteKit uvu Testing: Fast Component Unit Tests](https://rodneylab.com/sveltekit-uvu-testing/) от Rodney Lab
- [Учебник по аутентификации SvelteKit JWT](https://dev.to/pilcrowonpaper/sveltekit-jwt-authentication-tutorial-2m34) от pilcrowOnPaper
- [Преобразование Svelte SPA на основе rollup в SvelteKit](https://github.com/sveltejs/kit/discussions/4595) Саймона Х.
- [Добавить Commitint, Commitizen, Standard Version и Husky в проект SvelteKit](https://davipon.hashnode.dev/add-commitint-commitizen-standard-version-and-husky-to-sveltekit-project) Дэвида Пенга

_Смотреть и слушать_
- [Рич Харрис - Дорога к SvelteKit 1.0 (Svelte Society NYC)](https://www.youtube.com/watch?v=s6a1pbTVcUs) от Svelte Society
- [Основы Svelte - Введение в Svelte](https://codingcat.dev/course/intro-to-svelte) от Coding Cat
- [Svelte Components Using Custom Markdown Renderers - Weekly Svelte](https://www.youtube.com/watch?v=ZiEROAqobwM) от LevelUpTuts
- [Внедрение {@const} в блоке if](https://www.youtube.com/watch?v=f5iReGqjmG0) от lihautan
- [Svelte and Contributing to Open-Source with Geoff Rich](https://podcast.20minjs.com/1952066/10417700-episode-6-svelte-and-contributing-to-open-source-with-geoff-rich) от 20minJS


**Библиотеки, инструменты и компоненты**
- [KitDocs](https://github.com/svelteness/kit-docs) - это интеграция документации для SvelteKit, например, VitePress for Svelte.
- [Svelte Copy](https://github.com/ghostdevv/svelte-copy) - это библиотека click/tap-to-copy, которая облегчает копирование в буфер обмена
- [Svend3r](https://github.com/oslabs-beta/svend3r) предоставляет красивые визуализации, которые используют мощь D3, чтобы оживить ваши данные, абстрагируя их императивный код
- [Svelte Hamburgers](https://github.com/ghostdevv/svelte-hamburgers) - это простой в использовании компонент меню Hamburger для Svelte
- [Svelte Droplet](https://github.com/probablykasper/svelte-droplet) - это зона удаления файлов для Svelte
- [Svelte MP3](https://www.npmjs.com/package/svelte-mp3) - это легкий пылающий быстрый, но простой минималистичный аудиоплеер для Svelte
- [SvelteUI](https://github.com/Brisklemonade/svelteui) - это библиотека компонентов для создания полнофункциональных и доступных веб-приложений быстрее, чем когда-либо
- [svelte-spotlight](https://github.com/beynar/svelte-spotlight) - это компонент прожектора без головы, который поможет вам создать глобальное поле поиска вашего сайта за считанные минуты
- [svelte-pdf-simple](https://github.com/gspasov/svelte-pdf-simple) - это простая библиотека svelte для отображения PDF-файлов и предоставления вам всего контроля
- [persistent-svelte-store](https://github.com/omer-g/persistent-svelte-store) - это общее постоянное записываемое хранилище, построенное с нуля в TypeScript в соответствии с контрактом хранилищ Svelte
- [svelte-exmarkdown](https://github.com/ssssota/svelte-exmarkdown) - это компонент Svelte для динамического отображения разметки
- [Bookit](https://github.com/leveluptuts/bookit) - это среда рендеринга компонентов, похожая на сборник рассказов - тонко настроенная на работу непосредственно в ваших проектах SvelteKit

Присоединяйтесь к нам на [Reddit](https://www.reddit.com/r/sveltejs/) или [Discord](https://discord.com/invite/yy75DKs), чтобы продолжить разговор.

Если вы предпочитаете присоединиться к нам лично, Svelte Summit переходит в реальный мир. Присоединяйтесь к нам на два дня потрясающего контента Svelte! [Получите билеты сейчас!](https://ti.to/svelte/svelte-summit-fall-edition)

Увидимся в следующем месяце!
