# Data

## Querying on initialization

```html
<script>
  const input = document.getElementById('auto-complete');
  const result = await fetch('/your-api');
  const data = await result.json();
  input.kompletr({
    data,
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
    onError: (error) => {
      console.log('Do something at your sausage with this: ', error?.message);
    }
  });
</script>
```

## Querying on the fly

```html
<script>
  const input = document.getElementById('auto-complete');
  input.kompletr({
    data: [],
    onKeyup: async function (value, done) {
      const result = await fetch(`/your-api?q=${value}&limit=10&offset=0&...`);
      const data = await result.json();
      done(data);
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
    onError: (error) => {
      console.log('Do something at your sausage with this: ', error?.message);
    }
  });
</script>
```

::: tip 
:bulb: Refer to the cache option to improve performances and bandwith consumming.
:::