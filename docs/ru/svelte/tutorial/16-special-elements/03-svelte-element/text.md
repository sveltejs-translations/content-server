---
title: <svelte:element>
---

Иногда мы заранее не знаем, какой элемент DOM визуализировать. `<svelte:element>` здесь пригодится. Вместо последовательности блоков `if`...

```html
{#if selected === 'h1'}
    <h1>I'm a h1 tag</h1>
{:else if selected === 'h3'}
    <h3>I'm a h3 tag</h3>
{:else if selected === 'p'}
    <p>I'm a p tag</p>
{/if}
```

...может быть один динамический компонент:

```html
<svelte:element this={selected}>I'm a {selected} tag</svelte:element>
```

Значение `this` может быть любой строкой или falsy значением - если falsy, ни один элемент не отображается.