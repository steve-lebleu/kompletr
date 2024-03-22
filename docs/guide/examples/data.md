# Data

## Querying on initialization

```html
<script>
  const input = document.getElementById('auto-complete');
  const result = await fetch('/your-api');
  const data = await result.json();
  kompletr({
    input,
    data,
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## Querying on the fly

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

::: tip 
:bulb: Refer to the cache option to improve performances and bandwith consumming.
:::