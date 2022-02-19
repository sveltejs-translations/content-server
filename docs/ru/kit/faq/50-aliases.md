---
title: Как мне настроить подмену пути(aliases)?
---

Сначала её нужно добавить в конфигурацию Vite. В файле `svelte.config.js` добавьте [`vite.resolve.alias`](https://vitejs.dev/config/#resolve-alias):

В `svelte.config.cjs` добавьте [`vite.resolve.alias`](https://vitejs.dev/config/#resolve-alias):

```js
/// file: svelte.config.js
// @filename: ambient.d.ts
declare module 'path';

// @filename: index.js
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    vite: {
      resolve: {
        alias: {
          $utils: path.resolve('./src/utils')
        }
      }
    }
  }
};
export default config;
```

Затем, чтобы TypeScript тоже учитывал подмену путей, добавьте аналогичные записи и в `tsconfig.json` (для пользователей TypeScript) или `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "$utils/*": ["src/utils/*"]
    }
  }
}
```
