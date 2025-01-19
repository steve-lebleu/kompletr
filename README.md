# JS autocompletion library - Kømpletr

[![Logo Kømpletr light](https://cdn.konfer.be/images/kompletr/logo-kompletr-dark.png#gh-light-mode-only)](https://cdn.konfer.be/images/kompletr/logo-kompletr-dark.png#gh-light-mode-only)
[![Logo Kømpletr dark](https://cdn.konfer.be/images/kompletr/logo-kompletr-light.png#gh-dark-mode-only)](https://cdn.konfer.be/images/kompletr/logo-kompletr-light.png#gh-dark-mode-only)

![Github action workflow status](https://github.com/steve-lebleu/kompletr/actions/workflows/build.yml/badge.svg?branch=master)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/kompletr?logo=Github)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/kompletr/badge)](https://www.codefactor.io/repository/github/steve-lebleu/kompletr)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/kompletr/badge.svg?branch=master)](https://coveralls.io/github/steve-lebleu/kompletr?branch=master)
[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://github.com/steve-lebleu/kompletr/blob/master/LICENSE)

## Features

- :white_check_mark: Sync / async querying
- :white_check_mark: Cache management
- :white_check_mark: Keyboard navigation
- :white_check_mark: Flexible research (begining, whole word or ... on your own)
- :white_check_mark: Flexible suggestions display (1, 2, 3, ... fields)
- :white_check_mark: Support string or object values
- :white_check_mark: No dependencies
- :white_check_mark: 10kb fully included

## Installation

### Package manager

#### Install package

```bash
npm i kompletr --save
```

#### Import module

```javascript
import kompletr from 'kompletr'
```

Get CSS from *./node_modules/kompletr/css/kompletr.min.css*

### Direct download

1. Download latest release archive
2. Get JS from *[Your-vendors-path]/kompletr/js/kompletr.min.js*
3. Get CSS from *[Your-vendors-path]/kompletr/css/kompletr.min.css*

#### Import script and stylesheet

``` html
...
<link href="kompletr.min.css" rel="stylesheet" type="text/css" />
<script src="kompletr.min.js" type="module"></script>
...
```

## Getting started

Define input element:

``` html
<input type="text" id="auto-complete" autocomplete="off" placeholder="Whatever you want..." />
```

Invoke Kømpletr:

``` javascript
kompletr({
  input: 'auto-complete',
  data: [],
  onSelect: (selected) => {
    console.log('There is the selected value', selected);
  }
});
```

## Options

- **fieldsToDisplay**: string[], properties to display in the suggestion field when suggestions are Objects
- **mapPropertyAsValue**: string, property to map as input value when the suggestions are Objects
- **filterOn**: string, check expression from beginning of the value or on the whole word. Default 'prefix'
- **startQueryingFromChar**: int, number of chars completed in input before kompletr fire search
- **maxResults**: int, number of max results to display
- **onKeyup**: function(value), callback fired each time the user press a keyboard touch
- **onSelect**: function(selected), callback fired after selection of on result item
- **onError**: function(error), callback fired when an error occurs

## Licence

[GPL](https://www.gnu.org/licenses/gpl-3.0.html)
