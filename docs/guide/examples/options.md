# Options

## animations

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      animationType: 'slideDown', // fadeIn|slideDown - Default: fadeIn
      animationDuration: 700, // Default: 500
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## cache

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      cache: 5000 // In seconds - Default: 0
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## fieldsToDisplay

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      fieldsToDisplay: [
        'name',
        'population',
        'code'
      ]
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```
    
## filterOn

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      filterOn: 'expression', // prefix|expression - Default: prefix
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## maxResults

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      maxResults: 10, // Default: 5
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## propToMapAsValue

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      propToMapAsValue: 'name',
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## startQueryingFromChar

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      startQueryingFromChar: 3, // Default: 2
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```

## theme

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: ['orange', 'apple', 'kiwi'],
    options: {
      theme: 'dark' // light|dark - Default: light
    },
    onSelect: (selected) => {
      console.log('Do something with this selected value: ', selected);
    },
  });
</script>
```