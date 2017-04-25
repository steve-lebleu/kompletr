# Completer - A jQuery plugin to provides auto-completion management

[![GitHub version](https://badge.fury.io/gh/e-lLess%2Fcompleter.svg)](https://badge.fury.io/gh/e-lLess%2Fcompleter)

Completer.js is a self-completion system developed with HTML 5, CSS 3, JavaScript and jQuery. 
It can be used with or without databases or server language, the only required point is the response which must have JSON format. 
        
## Demo

## Installation

Obvious install with bower :

> bower install completer --save

## Usage

In your HTML page, between <head> tags, retrieve Completer styles:

> <link href="path_to_completer_css" rel="stylesheet" type="text/css" />

In your HTML page, between <head> tags, retrieve jQuery and Completer :

> <script src="directory_of_your_jquery/path_to_your_jquery.js"></script> 
> <script src="directory_of_your_completer/path_to_your_jquery.completer.js"></script>

Into your HTML code, place the following code :

> <div id="searcher" class="form--light-search">
>  <input type="text" name="autocomplete" id="autocomplete" class="input--search" autocomplete="off" />
>  <button type="button" name="search" id="search" class="button--search"></button>
> </div>
 
Finally, invoke the fabulous plugin with 2 required parameters :

> $('#searcher').completer({
>   url : 'path_to_your_json_source.php',
>   field : 'name_of_the_field_on_which_filter_json_data'
> });

## Options

Following options are available :


## Documentation