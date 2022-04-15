---
title: Файлы ресурсов
---

### Импортирование

[Vite автоматически обработает импортированные файлы](https://vitejs.dev/guide/assets.html) для повышения производительности. Хэши будут добавлены к именам файлов, чтобы их можно было кэшировать, а ресурсы, меньшие, чем `assetsInlineLimit`, будут встроены.

```html
<script>
	import logo from '$lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

Если вы предпочитаете ссылаться на файлы ресурсов непосредственно в разметке, можно использовать препроцессор, такой как [svelte-preprocess-import-assets] (https://github.com/bluwy/svelte-preprocess-import-assets) или [svelte-image] (https://github.com/matyunya/svelte-image).

Для файлов ресурсов, включенных через CSS функцию `url()`, можно найти опцию [`experimental.useVitePreprocess`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#usevitepreprocess):

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
