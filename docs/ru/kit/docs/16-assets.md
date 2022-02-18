---
title: Обработка внешних файлов
---

### Хеширование

Чтобы включить хэши в имена внешних файлов и кэшировать их, вы можете настроить Vite обработать их, импортировав, как показано ниже:

```html
<script>
	import logo from '$lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

Если вы предпочитаете ссылаться на внешние файлы непосредственно в разметке, можно использовать препроцессор, такой как [svelte-preprocess-import-assets] (https://github.com/bluwy/svelte-preprocess-import-assets) или [svelte-image] (https://github.com/matyunya/svelte-image).

Для внешних файлов, включенных через `url()`, можно найти опцию [`experimental.useVitePreprocess`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#usevitepreprocess):

```js
// svelte.config.js
export default {
	experimental: {
		useVitePreprocess: true
	}
};
```

### Оптимизация

Можно использовать сжатые форматы изображений, такие как `.webp` или `.avif`, или отзывчивые изображения, которые отдают разные размеры в зависимости от экрана вашего устройства. Для изображений, которые статически включены в проект, можно использовать препроцессор, такой как [svelte-image] (https://github.com/matyunya/svelte-image) или плагин Vite, такой как [vite-imagetools](https://github.com/JonasKruckenberg/
