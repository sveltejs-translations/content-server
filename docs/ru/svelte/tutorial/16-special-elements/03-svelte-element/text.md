---
title: <svelte:element>
---

Иногда мы заранее не знаем, какой элемент DOM визуализировать. `<svelte:element>` здесь пригодится. Вместо последовательности блоков `if`...

```html
{#if selected === 'h1'}
    <h1>Я тэг h1</h1>
{:else if selected === 'h3'}
    <h3>Я тэг h3</h3>
{:else if selected === 'p'}
    <p>Я тэг p</p>
{/if}
```

...может быть один динамический компонент:

```html
<svelte:element this={selected}>Я тэг {selected}</svelte:element>
```

Значение `this` может быть любой строкой или falsy значением - если falsy, ни один элемент не отображается.