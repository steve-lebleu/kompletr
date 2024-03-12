# Getting started

## Installation

### With package manager

:::tabs
== npm
```bash
> npm i kompletr -D
```
== yarn
```bash
> yarn add kompletr -D
```
== pnpm
```bash
> pnpm i kompletr -D
```
:::

### From CDN

:::tabs
== jsdelivr
```html
<script src=""></script>
```
== cdnjs
```html
<script src=""></script>
```
== unpkg
```html
<script src=""></script>
```
:::

### Direct download

1. Download latest release archive
2. Get JS files from *./dist/js/*.js*
3. Get CSS files from *./dist/css/*.css*

## Usage

### 1. Load module

:::tabs
== HTML
```html
<script src="" type="module"></script>
```
== CommonJS
```javascript
const { kompletr } = require('kompletr');
```
== ESM
```javascript
import { kompletr } from 'kompletr';
```
:::

### 2. Define input element

```html
<input id="auto-complete" type="text" autocomplete="off" />
```

### 3. Initialize Kompletr

```html
<script>
  const input = document.getElementById('auto-complete');
  input.kompletr({
    data: ['apple', 'banana', 'orange', 'mandarine'],
    onSelect: (selected) => {
      console.log('Current selected value: ', selected);
    },
    onError: (error) => {
      console.log('An error has occured: ', error);
    }
  });
</script>
```
:link: See [API section](./api.md) for more informations about available options.
