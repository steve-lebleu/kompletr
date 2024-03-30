

# Options

The *options* parameter is required as **Object** with following properties:

## cache

Optional.

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

Required if *data* contains object values, to indicate which properties should be displayed into suggested item.

```html
<script>
  kompletr({
    input: 'auto-complete',
    data: [
      {
        name: 'Belgium',
        population: 10000000,
        code: 'BE',
        beer: true
      }
    ],
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

Optional.

Can be used to determine the search method when you delegate the filtering to Kompletr (in other terms, when you pass data without refresh it on your own by using *onKeyup* callback).

Accepted values:

- *prefix*: the search is done from the begining of the term
- *expression*: the search is done into the whole word

Default: *prefix*

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

Optional.

Number of results to display.

Default: 5

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

Optional.

Number of results to display.

Default: 10

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

Optional.

Number of chars before to fire research.

Default: 2

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

Optional.

Theme style.

Accepted values:

- *light*
- *dark*

Default: *light*

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