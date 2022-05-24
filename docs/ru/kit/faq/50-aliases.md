---
title: Как мне настроить подмену пути(aliases)?
---

Псевдонимы могут быть установлены в `svelte.config.js`, как описано в [`configuration`](#konfiguracziya-alias).

Затем запустите `npm run sync` или `npm run dev` (который выполнит `sync`). SvelteKit автоматически сгенерирует необходимую конфигурацию псевдонима в `jsconfig.json` или `tsconfig.json`.
