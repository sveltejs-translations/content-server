---
title: Макеты
---

До сих пор мы рассматривали страницы как полностью автономные компоненты — при переходе между страницами существующий компонент уничтожался, а новый занимал его место.

Но во многих приложениях есть элементы, которые должны быть видны на _каждой_ странице, такие как навигация или подвал. Вместо того, чтобы повторять их на каждой странице, мы можем использовать _компоненты макета_.

Чтобы создать макет, который будет применяться к каждой странице приложения, создайте файл с именем `src/routes/__layout.svelte`. По умолчанию макет (SvelteKit использует такой, если не найдет этого файла) выглядит следующим образом:

```html
<slot></slot>
```

Мы можем добавить любую разметку, стили и поведение, которые мы хотим. Единственное требование — компонент должен иметь `<slot>` для содержимого страницы.  Например, давайте добавим панель навигации:

```html
/// file: src/routes/__layout.svelte
<nav>
	<a href="/">Главная</a>
	<a href="/about">О сайте</a>
	<a href="/settings">Настройки</a>
</nav>

<slot></slot>
```

Если мы создадим страницы для `/`, `/about` и `/settings`...

```html
/// file: src/routes/index.svelte
<h1>Главная</h1>
```

```html
/// file: src/routes/about.svelte
<h1>О сайте</h1>
```

```html
/// file: src/routes/settings.svelte
<h1>Настройки</h1>
```

...навигация всегда будет видна, и переход между тремя страницами приведёт только к замене содержимого элемента `<h1>`.

### Вложенные макеты

Предположим, что у нас не просто одна страница `/settings`, а есть и вложенные страницы, вроде `/settings/profile` и `/settings/notifications` с общим подменю (для реального примера см. [github.com/settings](https://github.com/settings)).

Мы можем создать макет, который применяется только к страницам, расположенным ниже `/settings` (при этом останется и корневой макет с навигацией):

```html
/// file: src/routes/settings/__layout.svelte
<h1>Настройки</h1>

<div class="submenu">
	<a href="/settings/profile">Профиль</a>
	<a href="/settings/notifications">Уведомления</a>
</div>

<slot></slot>
```

### Именованные макеты

Некоторым частям вашего приложения может понадобиться что-то отличное от макета по умолчанию. В этих случаях можно создать _именованные макеты_...

```svelte
/// file: src/routes/__layout-foo.svelte
<div class="foo">
	<slot></slot>
</div>
```

...а затем используйте их, ссылаясь на имя макета (`foo`, в примере выше) в имени файла:

```svelte
/// file: src/routes/my-special-page@foo.svelte
<h1>I am inside __layout-foo</h1>
```

#### Область применения

Именованные макеты могут быть созданы на любой глубине и будут применяться к любым компонентам в том же поддереве. Например, `__layout-foo` будет применяться к `/x/one` и `/x/two`, но не `/x/three` или `/four`:

```
src/routes/
├ x/
│ ├ __layout-foo.svelte
│ ├ one@foo.svelte       # ✅ page has `@foo`
│ ├ two@foo.svelte       # ✅ page has `@foo`
│ └ three.svelte         # ❌ page does not have `@foo`
└ four@foo.svelte        # ❌ page has `@foo`, but __layout-foo is not 'in scope'
```

#### Цепи наследования

Макеты сами могут наследовать от именованных макетов, из того же каталога или родительского каталога. Например, `x/y/__layout@root.svelte` является макетом по умолчанию для `/x/y` (что означает `/x/y/one`, `/x/y/two` и `/x/y/three` наследуют от него), потому что у него нет имени. Поскольку он указывает `@root`, он унаследует непосредственно от ближайшего `__layout-root.svelte`, пропуская `__layout.svelte` и `x/__layout.svelte`.

```
src/routes/
├ x/
│ ├ y/
│ │ ├ __layout@root.svelte
│ │ ├ one.svelte
│ │ ├ two.svelte
│ │ └ three.svelte
│ └ __layout.svelte
├ __layout.svelte
└ __layout-root.svelte
```

> В случае, когда `__layout-root.svelte` содержит только `<slot />`, это фактически означает, что можно 'сбросить' на пустой макет для любой страницы или вложенного макета в приложении, добавив `@root`.

Если родитель не указан, макет унаследует от ближайшего макета по умолчанию (т.е. безымянного) макета _above_ в дереве. В некоторых случаях полезно, чтобы именованный макет унаследовал от макета по умолчанию _наряду с ним_ в дереве, например, `__layout-root.svelte`, наследующий от `__layout.svelte`. Можно сделать это, явно указав `@default`, разрешив `/x/y/one` и братьям и сестрам использовать макет приложения по умолчанию без использования `x/__layout.svelte`:

```diff
src/routes/
├ x/
│ ├ y/
│ │ ├ __layout@root.svelte
│ │ ├ one.svelte
│ │ ├ two.svelte
│ │ └ three.svelte
│ └ __layout.svelte
├ __layout.svelte
-└ __layout-root.svelte
+└ __layout-root@default.svelte
```

> `default` является зарезервированным именем - другими словами, нельзя назвать файл `__layout-default.svelte`.


### Страницы ошибок

Если страница не смогла загрузиться (см [Загрузка данных](#zagruzka-dannyh)), SvelteKit отобразит страницу ошибки. Вы можете настроить вид этой страницы, создав компонент `__error.svelte` рядом с вашим макетом и страницами:

Например, если не удалось загрузить `src/routes/settings/notifications/index.svelte`, SvelteKit отрисует `src/routes/settings/notifications/__error.svelte` в том же макете, если он существует. В противном случае он отрисует `src/routes/settings/__error.svelte` в родительском макете или `src/routes/__error.svelte` в корневом макете.

> В SvelteKit есть страница ошибок по умолчанию, если он не найдет файла `src/routes/__error.svelte`, но рекомендуется сделать свою.

Если в компоненте`__error.svelte` есть функция [`load`](#zagruzka-dannyh), она будет вызываться со свойствами `error` и `status`:

```html
<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>
	export let title;
</script>

<h1>{title}</h1>
```

> Макеты также имеют доступ к `error` и `status` через [хранилище страниц](#moduli-$app-stores)
>
> Во избежание того, чтобы пользователям стала доступна чувствительная информация, текст ошибок будет очищен от технических подробностей в продакшн режиме работы приложения.


#### 404s

Вложенные страницы ошибок отображаются только тогда, когда возникает ошибка при рендеринге определенной страницы. В случае запроса, который не соответствует ни одному существующему маршруту, SvelteKit вместо этого отобразит общий 404. Например, учитывая эти маршруты...

```
src/routes/
├ __error.svelte
├ marx-brothers/
│ ├ __error.svelte
│ ├ chico.svelte
│ ├ harpo.svelte
│ └ groucho.svelte
```

...Файл `marx-brothers/__error.svelte` не будет отображаться, если вы посетите `/marx-brothers/karl`. Если вы хотите отобразить вложенную страницу ошибки, вы должны создать маршрут, соответствующий любому запросу `/marx-brothers/*`, и вернуть из него 404:

```diff
src/routes/
├ __error.svelte
├ marx-brothers/
│ ├ __error.svelte
+│ ├ [...path].svelte
│ ├ chico.svelte
│ ├ harpo.svelte
│ └ groucho.svelte
```

```svelte
/// file: src/routes/marx-brothers/[...path].svelte
<script context="module">
/** @type {import('./[...path]').Load} */
export function load({ params }) {
	return {
		status: 404,
		error: new Error(`Not found: /marx-brothers/${params.path}`)
	};
}
</script>
```