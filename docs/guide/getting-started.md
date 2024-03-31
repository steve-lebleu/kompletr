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
<script type="module" src="https://cdn.jsdelivr.net/npm/kompletr@latest/dist/js/kompletr.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/kompletr@latest/dist/css/kompletr.min.js" rel="stylesheet" type="text/css" />
```
== unpkg
```html
<script type="module" src="https://unpkg.com/kompletr@latest/dist/js/kompletr.min.js"></script>
<link href="https://unpkg.com/kompletr@latest/dist/css/kompletr.min.js" rel="stylesheet" type="text/css" />
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

## Styling

Play with Kompletr style is quite easy and conventionnal. Please notice following remarks:

- Kompletr doesn't embedd (yet) CSSinJS
- The styling of the main *input* element is at your own
- Two base themes availables as option: *light* (default) and *dark*
- Easy customization by CSS override

### CSS definition

FYI

```css
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Thasadith");
.kompletr .container--search-results {
  position: absolute;
  margin: 0;
  width: 100%; }

.kompletr .item--row {
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-left: none;
  border-right: none;
  font-size: 100%; }
  .kompletr .item--row:last-child {
    border-bottom: none !important; }
  .kompletr .item--row:hover, .kompletr .item--row.focus {
    cursor: pointer;
    -webkit-transition: all 0.2s ease-in-out ease-in-out;
    transition: all 0.2s ease-in-out ease-in-out; }
  .kompletr .item--row .item--property {
    flex: 50%; }
    .kompletr .item--row .item--property:nth-child(even) {
      text-align: right; }
    .kompletr .item--row .item--property:nth-child(n+0) {
      font-weight: 600; }
    .kompletr .item--row .item--property:nth-child(n+2) {
      font-weight: normal; }

.kompletr.light .item--row {
  color: #333;
  border-bottom: 1px dashed #dfdfdf;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.8); }
  .kompletr.light .item--row .item--property:nth-child(n+0) {
    color: #333; }
  .kompletr.light .item--row .item--property:nth-child(n+2) {
    color: #9e9e9e; }
  .kompletr.light .item--row:hover, .kompletr.light .item--row.focus {
    backdrop-filter: blur(26px) saturate(120%);
    -webkit-backdrop-filter: blur(26px) saturate(120%);
    background-color: rgba(255, 255, 255, 0.4); }
    .kompletr.light .item--row:hover .item--property:nth-child(n+0), .kompletr.light .item--row:hover .item--property:nth-child(n+2), .kompletr.light .item--row.focus .item--property:nth-child(n+0), .kompletr.light .item--row.focus .item--property:nth-child(n+2) {
      color: #333; }

.kompletr.dark .item--row {
  color: #dfdfdf;
  border-bottom: 1px dashed #444;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(51, 51, 51, 0.8); }
  .kompletr.dark .item--row .item--property:nth-child(n+0) {
    color: #dfdfdf; }
  .kompletr.dark .item--row .item--property:nth-child(n+2) {
    color: #777; }
  .kompletr.dark .item--row:hover, .kompletr.dark .item--row.focus {
    backdrop-filter: blur(26px) saturate(120%);
    -webkit-backdrop-filter: blur(26px) saturate(120%);
    background-color: rgba(51, 51, 51, 0.4); }
    .kompletr.dark .item--row:hover .item--property:nth-child(n+0), .kompletr.dark .item--row:hover .item--property:nth-child(n+2), .kompletr.dark .item--row.focus .item--property:nth-child(n+0), .kompletr.dark .item--row.focus .item--property:nth-child(n+2) {
      color: #fff; }

```