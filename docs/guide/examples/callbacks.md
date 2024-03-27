# Callbacks

Three callbacks are exposed to give you more flexibility:

## onKeyup

Fired after *onkeyup* event, with parameters:

- *value*: current input value
- *done*: callback function to call with refreshed data in parameter

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

Fired when a suggestion is selected by a click or a keypress on Enter:

- *selected*: current input value
  
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

Fired when an error is catched, with the error given in parameter:

- *error*: current error
  
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