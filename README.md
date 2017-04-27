# Completer - A jQuery auto-completion plugin

[![GitHub version](https://badge.fury.io/gh/e-lLess%2Fcompleter.svg)](https://badge.fury.io/gh/e-lLess%2Fcompleter)

Completer is a self-completion system developed with HTML 5, CSS 3, JavaScript and jQuery.
        
## Demo

http://plugins.e-lless.be/completer/

## Installation

Obvious install with [Bower](http://bower.io) :

> $ bower install completer --save

## How to use ?

In your HTML page, between <head> tags, retrieve Completer styles:

``` html 
<link href="path_to_completer_css" rel="stylesheet" type="text/css" />
```

In your HTML page, between <head> tags, retrieve jQuery and Completer :

``` html 
<script src="directory_of_your_jquery/jquery.js"></script>
<script src="directory_of_your_completer/jquery.completer.js"></script>
```

Into your HTML code, place the following code :

``` html 
<input type="text" name="auto-complete" id="auto-complete" class="input--search" autocomplete="off" />
```
 
Invoke the plugin with 2 required parameters :

``` javascript
$('#searcher').completer({
    url : 'path_to_your_json_source.php',
    field : 'name_of_the_field_on_which_filter_json_data'
});
```

## Options

Following options are available :

* **url**: string, path of the server script which return JSON data
* **field**: string, name of the field to use for sort data on client side
* **fieldsToDisplay**: array, fields to retrieve from JSON data and to display into result item
* **completerName**: string, element ID used for multiples instances
* **animation**: string, style of animation ('fade'|'slide'|'none')
* **animationSpeed**: int, speed of the animation
* **begin**: boolean, check expression from beginning of the value if true, on the whole word if false
* **onChar**: int, number of chars completed in input before Completer firing
* **maxResults**: int, number of max results to display
* **beforeDisplay**: function(e, dataset), function, callback fired before display of result set
* **afterDisplay**: function(e, dataset), function, callback fired after display of result set
* **beforeFocus**: function(e, element), function, callback fired before focus on result item
* **afterFocus**: function(e, element), callback fired after focus on result item
* **beforeComplete**: function(e, dataset, element), callback fired before insertion of result
* **afterComplete**: function(e, dataset, element), callback fired after insertion of result
                
