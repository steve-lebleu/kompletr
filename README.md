# Kømpletr - Vanilla JS autocompletion library

![Github action workflow status](https://github.com/steve-lebleu/kompletr/actions/workflows/build.yml/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/kompletr/badge.svg?branch=master)](https://coveralls.io/github/steve-lebleu/kompletr?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/kompletr/badge)](https://www.codefactor.io/repository/github/steve-lebleu/kompletr)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/kompletr?logo=Github)
[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://github.com/steve-lebleu/kompletr/blob/master/LICENSE)

*10kb of lightweight vanilla to add simple & efficient autocomplete.*

## Installation

### Package manager

```bash 
$ npm i kompletr --save
```

### Direct download

1. Download latest release archive
2. Get JS files from ./dist/js/.js*
3. Get CSS files from ./dist/css/.css*

## Getting started

Load Kømpletr styles:

``` html 
<head>
...
<link href="kompletr.min.css" rel="stylesheet" type="text/css" />
...
</head>
```

Load kompletr script:

``` html 
<script src="kompletr.min.js"></script>
```

Define an input element:

``` html 
<input type="text" id="auto-complete" class="input--search" autocomplete="off" placeholder="Whatever you want..." />
```
 
Invoke Kømpletr:

``` javascript
const input = document.getElementById('autocomplete');
kompletr({
  input,
  data: [],
  onSelect: (selected) => {
    console.log('There is the selected value', selected);
  }
});
```

## Options

Following options are available:

* **animationType**: string, style of animation ('fadeIn','slideDown'). Default fadeIn
* **animationDuration**: int, speed of the animation. Default 500ms
* **fieldsToDisplay**: string[], properties to display in the suggestion field when suggestions are Objects
* **mapPropertyAsValue**: string, property to map as input value when the suggestions are Objects
* **filterOn**: string, check expression from beginning of the value or on the whole word. Default 'prefix'
* **startQueryingFromChar**: int, number of chars completed in input before kompletr fire search
* **maxResults**: int, number of max results to display
* **onKeyup**: function(value), callback fired each time the user press a keyboard touch
* **onSelect**: function(selected), callback fired after selection of on result item
* **onError**: function(error), callback fired when an error occurs
