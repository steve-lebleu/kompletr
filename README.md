# Kompleter - jQuery auto-completion plugin

![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/konfer-be/kompleter/master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/kompleter/master)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/konfer-be/kompleter)

Self-completion plugin developed with HTML 5, CSS 3, JavaScript and jQuery. Demo here https://demo.konfer.be/kompleter/
        
## Why ?

For the fun, principaly. And to deliver a functional and simple plugin that meets simple need. If you need to display results from an HXR call, this can help.

## Installation

> $ npm i kompleter --save

## How to use ?

In your HTML page, between <head> tags, retrieve kompleter styles:

``` html 
<link href="path_to_kompleter_css" rel="stylesheet" type="text/css" />
```

In your HTML page, between <head> tags, retrieve jQuery and kompleter :

``` html 
<script src="directory_of_your_jquery/jquery.js"></script>
<script src="directory_of_your_kompleter/jquery.kompleter.js"></script>
```

Into your HTML code, place the following code, with your data attributes values where :

* **data-url:** path to the data provider, which can be an action of controller or a JSON file. The data format returned must be JSON.</li>
* **data-filter-on:** the property name of JSON object on which apply filter at keyup.
* **data-fields:** fields of JSON object to display, separated by a coma.

``` html 
<input type="text" id="auto-complete" class="input--search" autocomplete="off" placeholder="Enter a city name ..." data-url="" data-filter-on="" data-fields="" />
```
 
Invoke the plugin :

``` javascript
$('#auto-complete').kompleter({});
```

## Options

Following options are available :

* **animation**: string, style of animation ('fade','slide','none')
* **animationSpeed**: int, speed of the animation
* **begin**: boolean, check expression from beginning of the value if true, on the whole word if false
* **onChar**: int, number of chars completed in input before kompleter firing
* **maxResults**: int, number of max results to display
* **beforeDisplay**: function(e, dataset), function, callback fired before display of result set
* **afterDisplay**: function(e, dataset), function, callback fired after display of result set
* **beforeFocus**: function(e, element), function, callback fired before focus on result item
* **afterFocus**: function(e, element), callback fired after focus on result item
* **beforeComplete**: function(e, dataset, element), callback fired before insertion of result
* **afterComplete**: function(e, dataset, element), callback fired after insertion of result