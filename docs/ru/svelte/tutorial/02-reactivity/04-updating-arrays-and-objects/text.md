---
title: Изменение массивов и объектов
---

Реактивность Svelte вызвана заданиями. Методы, которые мутируют массивы или объекты, сами по себе не будут инициировать обновления.

В этом примере нажатие кнопки "Добавить число" вызывает функцию "addNumber", которая добавляет число в массив, но не вызывает пересчет `sum`.

Один из способов исправить это - присвоить "numbers" самим себе, чтобы сообщить компилятору, что они изменились:

```js
function addNumber() {
	numbers.push(numbers.length + 1);
	numbers = numbers;
}
```

Вы также можете написать это более лаконично, используя спред синтаксис ES6:

```js
function addNumber() {
	numbers = [...numbers, numbers.length + 1];
}
```

То же правило применяется к методам массива, таким как `pop`, `shift` и `splice`, а также к методам объектов, таким как `Map.set`, `Set.add` и т. д.

Присваивания значений *свойствам* массивов и объектов — например, `obj.foo + = 1` или `array[i] = x` — работают так же, как и присваивания обычным переменным.

 ```js
 function addNumber() {
	numbers[numbers.length] = numbers.length + 1;
 }
 ```

Однако косвенные назначения ссылкам, таким как эти...

```js
const foo = obj.foo;
foo.bar = 'baz';
```

или

```js
function quox(thing) {
	thing.foo.bar = 'baz';
}
quox(obj);
```

... не запустит реактивность `obj.foo.bar`, пока не будет добавлена строка `obj = obj`.

Простое правило: обновленная переменная должна появиться непосредственно в левой части присваивания.