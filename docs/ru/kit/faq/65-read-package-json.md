---
title: Как я могу включить детали из `Package.json в моё приложение?
---

Вы не можете напрямую требовать файлы JSON, поскольку SVELTEKIT ожидает, что [`svelte.config.js`](/docs#konfiguracziya) будет модулем ES. Если вы хотите включить номер версии вашего приложения или другую информацию из `package.json`, вы можете загрузить JSON следующим образом:

```js
/// file: svelte.config.js
// @filename: index.js
/// <reference types="@types/node" />
import { URL } from 'url';
// ---cut---
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);
```