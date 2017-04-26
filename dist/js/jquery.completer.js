/**
 * Completer is a free script that implements an auto-completion system using AJAX technologies
 *
 * Copyright (C) 2014  Lebleu Steve <dev@e-lless.be>
 *
 * URL : http://scripts.e-lless.be/completer/

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Creative Commons Licence.
 *
 * @author S. Lebleu
 * @update 24/04/2017
 *
 **/

// @todo errors management
// @todo use event and|or deferred to set pointer after firing of events
// @todo manage multiple instances on same page

(function(window, document, $) {

    "use strict";

    var _app = {};

    /**
     *
     * @type {{}}
     * @private
     */
    var _options = {};

    /**
     *
     * @type {Array}
     */
    var _suggestions = [];

    /**
     * Index of the pointer into search results items set
     *
     * @type {number}
     */
    var _pointer = -1;

    /**
     *
     * @type {string}
     */
    var _previous_value ='';

    /**
     *
     */
    var _$container;

    /**
     * Object who have current focus into search results items set
     *
     * @type {null}
     */
    var _$focused = null;

    /**
     * Object on who completer is applied
     *
     * @type {null}
     */
    var _$input = null;

    /**
     * jQueryHTMLElement template
     *
     * @type {null}
     */
    var _$result = $('<div>', { 'id' : 'result', 'class' : 'form--search__result' });

    /**
     * Contains response elements as JSON data
     *
     * @type {{}}
     */
    var _response = {};

    /**
     * Manage focus on search results items
     *
     * @returns {{}}
     */
    var focus = function () {

        /**
         * Set focus on element by add|remove class 'focus'
         * Manage the pointer
         *
         * @param e
         * @param keyCode
         */
        var set = function(e, keyCode) {

            if(keyCode === 40)
            {
                if(_pointer !== -1)
                {
                    remove();
                }

                _pointer++;

                add();
            }
            else if(keyCode === 38)
            {
                remove();

                _pointer--;

                if(_pointer !== -1)
                {
                    add();
                }
            }
        };

        /**
         * Add focus on element
         */
        var add = function() {
            _$focused = _suggestions[_pointer];
            _suggestions[_pointer].addClass('focus');
        };

        /**
         * Remove focus on element
         */
        var remove = function() {
            _$focused = null;
            _suggestions[_pointer].removeClass('focus');
        };

        var that = {};
        that.set = set;
        return that;
    };

    _app.focus = focus();

    /**
     * Filter data on _$input.val() according to _options parameters
     *
     * @returns {*}
     */
    var filtering = function() {

        var filter = function(data) {

            return $.grep(data, function(element) {

                if(isNaN(_$input.val())) {
                    return _options.begin === true ? element[_options.field].toLowerCase().lastIndexOf(_$input.val().toLowerCase(), 0) === 0 : element[_options.field].toLowerCase().lastIndexOf(_$input.val().toLowerCase()) !== -1;
                }
                else {
                    return parseInt(_$input.val()) === parseInt(element[_options.field]);
                }
            });
        };

        var that = {};
        that.filter = filter;
        return that;
    };

    _app.filtering = filtering();

    /**
     *
     * @returns {{}}
     */
    var request = function() {

        var get = function(e) {

            try {

                var request = function() {
                    return $.getJSON({
                        url : _options.url,
                        data: { expression : _$input.val() }
                    });
                };

                var success = function(data) {

                    if(typeof data === 'undefined' || data === null) {
                        window.console.log('Error'); // @todo manage error
                    }

                    $(document).trigger('c.display', [ data ]);
                };

                var error = function(data, status, error) {
                    window.console.log('Error in request : ' + error);
                };

                var $ajax = request().done(success).fail(error);

                $.when($ajax).done(function() {
                    window.console.log('all done'); // todo manage callback
                });
            }
            catch(err) {
                window.alert('Request cannot be done');
            }
        };

        var that = {};
        that.get = get;
        return that;
    };

    _app.request = request();

    /**
     *
     * @returns {{}}
     */
    var view = function() {

        /**
         *
         */
        var init = function() {
            _$container.append(_$result);
        };

        /**
         *
         * @param e
         * @param params
         */
        var display = function(e, params) {

            _options.beforeDisplay(e, params);

            $(document).trigger('c.display.before');

            if(params === null) {
                throw new Error('Variable params cannot be null');
            }

            _response = _app.filtering.filter(params);

            generate(_response);

            $(document).trigger('c.display.after');

            _options.afterDisplay(e, _response);
        };

        /**
         * Generate && append HTML view in result box
         *
         * @param data
         */
        var generate = function(data) {

            try {

                var i = 0, l = data.length, $item, $span;

                if(l === 0) {
                    $item =  $('<div>', { 'class' : 'item--result', 'html' : 'No result'});
                }

                _suggestions = [];

                _$result.html('');

                for(i; i < l, i < _options.maxResults; i++)
                {
                    if(typeof data[i] !== 'undefined')
                    {
                        var cls = i + 1 === l ? 'last' : '';

                        $item = $('<div>', { 'id' : i, 'class' : 'item--result ' + cls + ''});

                        for(var j = 0; j < _options.fieldsToDisplay.length; j++) // @todo implements data retrieving by _options
                        {
                            $span = $('<span>', { 'class' : 'data-' + j + '', 'html' : data[i][j]});
                            $item[0].append($span[0]);
                        }

                        _suggestions.push($item);

                        _$result.append($item);
                    }
                }
            }
            catch(e) {
                window.console.log(e);
            }

        };

        /**
         * Manage navigation into results set
         *
         * @param e
         * @param keyCode
         */
        var navigate = function(e, keyCode) {

            if(_pointer >= -1 && _pointer <= _suggestions.length - 1)
            {
                // Pointer out of data set, before first element
                if(_pointer === -1)
                {
                    if(keyCode === 40)
                    {
                        $(document).trigger('c.focus', [ keyCode ]);
                    }
                }
                // Pointer in data set, at last element
                else if (_pointer === _suggestions.length - 1)
                {
                    if(keyCode === 38)
                    {
                        $(document).trigger('c.focus', [ keyCode ]);
                    }
                }
                // Pointer into data set
                else
                {
                    $(document).trigger('c.focus', [ keyCode ]);
                }
            }
        };

        /**
         * Insert the selected choice into _$input
         */
        var complete = function(e) {

            var id = _$focused !== null ? _$focused.attr('id') : 0;

            _options.beforeComplete(e, _response, _response[id]);

            _$input.val(_response[id][_options.field]);

            $(document).trigger('c.complete.after');

            _options.afterComplete(e, _response, _response[id]);
        };

        /**
         * Show search results set
         */
        var show = function() {

            switch(_options.animation) {

                case 'fade':
                    _$result.fadeIn(_options.animationSpeed);
                    break;

                case 'slide':
                    _$result.slideDown(_options.animationSpeed);
                    break;

                default:
                    _$result.fadeIn(_options.animationSpeed);
                    break;
            }

            _pointer = -1;
        };

        /**
         * Hide search results set
         */
        var hide = function() {

            _pointer = -1;

            switch(_options.animation) {

                case 'fade':
                    _$result.fadeOut(_options.animationSpeed);
                    break;

                case 'slide':
                    _$result.slideUp(_options.animationSpeed);
                    break;

                default:
                    _$result.fadeOut(_options.animationSpeed);
                    break;
            }
        };

        var that = {};

        that.init = init;
        that.display = display;
        that.navigate = navigate;
        that.complete = complete;
        that.show = show;
        that.hide = hide;

        return that;
    };

    _app.view = view();

    /**
     *
     * @returns {{}}
     */
    var handlers = function() {

        /**
         *
         */
        var init = function() {

            var $body = $('body');

            /**
             *  Keyboard navigation
             */
            $body.on('keyup', '.input--search', function(e) {

                e = e || window.event;

                var keyCode = e.keyCode;

                // Up/Down into Results
                if(keyCode === 38 || keyCode === 40)
                {
                    $(document).trigger('c.navigate', [ keyCode ]);
                }
                // Write the selected item into _$input
                else if (keyCode === 13)
                {
                    $(document).trigger('c.complete');
                }
                // Do request to retrieve data according to currents chars
                else
                {
                    if(_options.onChar <= _$input.val().length && _$input.val() !== _previous_value) {
                        $(document).trigger('c.request');
                    }
                }
            });

            /**
             * Hide results set
             */
            $body.on('click', function(e) {
                $(document).trigger('c.complete.after');
            });

            /**
             * Click on result
             */
            $body.on('click', '.item--result', function(e) {

                _options.beforeSelect(e, $(this));

                _$focused = $(this);

                $(document).trigger('c.complete');

                _options.afterSelect(e, $(this));
            });

            /**
             *
             */
            $(document).on('c.complete', _app.view.complete);

            /**
             *
             */
            $(document).on('c.complete.after', _app.view.hide);

            /**
             *
             */
            $(document).on('c.request', _app.request.get);

            /**
             *
             */
            $(document).on('c.display.before', _app.view.show);

            /**
             *
             */
            $(document).on('c.display', _app.view.display);

            /**
             *
             */
            $(document).on('c.display.after', _options.afterDisplay);

            /**
             *
             */
            $(document).on('c.navigate', _app.view.navigate);

            /**
             *
             */
            $(document).on('c.focus', _app.focus.set);

        };

        var that = {};
        that.init = init;
        return that;
    };

    _app.handlers = handlers();

    /**
     *
     * @param options
     * @returns {$.fn}
     */
    $.fn.completer = function(options) {

        // Ensure that only one completer exists
        if (!$.data(document.body, 'completer')) {

            $.data(document.body, 'completer', true);

            // Apply any options to the settings, override the defaults
            _options = $.fn.completer.defaults = $.extend({ }, $.fn.completer.defaults, options);

            if(_options.url === null) {
                throw new Error('URL option is mandatory');
            }

            if(_options.field === null) {
                throw new Error('Field option is mandatory');
            }

            // Set main container
            _$container = $(this);

            // Set input
            _$input = $(this).find('input[type="text"]');

            // Initialize view component
            _app.view.init();

            // Bind events
            _app.handlers.init();

            return $(this);
        }
    };

    // Defaults
    $.fn.completer.defaults = {
        url: null,                                          // Path of script or file REQUIRED
        completerName: 'completer',                         // Element ID
        animation: 'fade', 				                          // Fade, slide, none
        animationSpeed: 350, 			                          // Animation in speed (ms)
        begin: true,                                        // Check by string begin if true, in all world if false
        onChar: 2,                                          // Launch request after n chars
        maxResults: 10,                                     // Number of max results to display
        field: null,                                        // Field on to apply filter REQUIRED
        fieldsToDisplay: [ 1, 2, 3 ],
        beforeDisplay: function(e, dataset){},              // Callback fired before display of result set
        afterDisplay: function(e, dataset){},               // Callback fired after display of result set
        beforeSelect: function(e, element){},               // Callback fired before selection of result
        afterSelect: function(e, element){},                // Callback fired after selection of result
        beforeComplete: function(e, dataset, element){},    // Callback fired before insertion of result
        afterComplete: function(e, dataset, element){}      // Callback fired after insertion of result
    };

    $.completer = $.fn.completer;

})(window, document, jQuery);

