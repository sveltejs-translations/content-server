---
title: Привязки внутри блока each
---

Вы можете выполнить привязку даже к свойствам внутри блока `each`.

```html
{#each todos as todo}
	<div class:done={todo.done}>
		<input
			type=checkbox
			bind:checked={todo.done}
		>

		<input
			placeholder="What needs to be done?"
			bind:value={todo.text}
		>
	</div>
{/each}
```

> Обратите внимание, что взаимодействие с этими элементами `<input>` приведёт к изменению соответствующего массива. Если вы предпочитаете работать с неизменяемыми данными, не создавайте таких привязок и используйте вместо них обработчики событий.
