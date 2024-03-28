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
<script src="kompletr.min.js" type="module"></script>
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

### 2. Load styles

:::tabs
== HTML
```html
<link href="./kompletr.min.css" rel="stylesheet" type="text/css" />
```
== CommonJS
```javascript
const styles = require('./kompletr.min.css');
```
== ESM
```javascript
import styles from './kompletr.min.css';
```
:::

### 3. Define input element

```html
<input id="auto-complete" type="text" autocomplete="off" />
```

### 4. Initialize Kompletr

```html
<script>
  const input = document.getElementById('auto-complete');
  kompletr({
    input,
    data: ['apple', 'banana', 'orange', 'mandarine'],
    onSelect: (selected) => {
      console.log('Current selected value: ', selected);
    },
  });
</script>
```
