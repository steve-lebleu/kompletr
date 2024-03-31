# Input

The *input* parameter is required as **HTMLInputElement** or **selector**.

## Giving a selector

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## Giving an HTMLElement

```html
<script>
  const input = document.getElementById('auto-complete');
  kompletr({
    input,
    data: ['orange', 'apple', 'kiwi'],
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```