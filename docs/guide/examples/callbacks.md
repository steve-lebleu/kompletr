# Callbacks

## onKeyup

```html
<script>
  const input = document.getElementById('auto-complete');
  kompletr({
    input,
    data: [],
    onKeyup: async function (value, done) {
      const result = await fetch(`/your-api?q=${value}&limit=10&offset=0&...`);
      const data = await result.json();
      done(data);
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## onSelect

```html
<script>
  const input = document.getElementById('auto-complete');
  kompletr({
    input,
    data: [],
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## onError

```html
<script>
  const input = document.getElementById('auto-complete');
  kompletr({
    input,
    data: [],
    onError: (error) => {
      console.log('Something went wrong with this: ', error);
    },
  });
</script>
```