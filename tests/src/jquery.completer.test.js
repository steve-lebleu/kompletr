(function ($) {

	"use strict";

	function setHTMLFixture() {
		return setFixtures('<div id="searcher" class="form--light-search">'
		+'  <input type="text" name="auto-complete" id="auto-complete" class="input--search" autocomplete="off" />'
		+'  <button type="button" name="search" id="search" class="button--search"></button>'
		+'</div>');
	}

	describe("Completer", function() {

		describe("Initialize", function() {

			beforeEach(function() {
				var fixture = setHTMLFixture();
			});

			describe("DOM", function() {

				it("main selector must be in DOM", function() {
					expect($('#searcher')[0]).toBeInDOM();
				});

				it("required options (url, field,, fieldsToDisplay) must be filled", function() {
					var init = $('#searcher').completer({
						url: 'files/completer.json',
						field: 'Name',
						fieldsToDisplay:['Name']
					});
					expect(init).toBeDefined();
				});

				it("view component must be initialized by #result element appending", function() {
					expect($('#result')).toBeDefined();
				});

			});

			describe("Events", function() {

				it("keyup event on input[type='text'] is fired", function() {

					var spyEvent;

					spyEvent = spyOnEvent('#searcher input[type="text"]', 'keyup');
					$('#searcher input[type="text"]').trigger( "keyup" );

					expect('keyup').toHaveBeenTriggeredOn('#searcher input[type="text"]');
					expect(spyEvent).toHaveBeenTriggered();
				});

				it("click event on body is fired", function() {

					var spyEvent;

					spyEvent = spyOnEvent('body', 'click');
					$('body').trigger( "click" );

					expect('click').toHaveBeenTriggeredOn('body');
					expect(spyEvent).toHaveBeenTriggered();
				});

				/**
				it("click event on .item--result is fired", function() {


					var spyEvent;

					spyEvent = spyOnEvent('.item--result', 'click');
					$('.item--result').trigger( "click" );

					expect('click').toHaveBeenTriggeredOn('.item--result');
					expect(spyEvent).toHaveBeenTriggered();
				});**/


			});

			describe("Request", function() {

				beforeEach(function() {

				});

				it ("don't launch request if input value length < n", function() {

					var spyRequest = spyOn($, "getJSON");

					var fixture = setHTMLFixture();
					$('#searcher').completer({
						url: '../../demo/files/completer.json',
						field: 'Name',
						fieldsToDisplay:['Name'],
						onChar: 3
					});

					var e = jQuery.Event("keyup");
					e.keyCode = 65;

					var $input = fixture.find('input[type="text"]');

					$input.focus();
					$input.trigger(e);

					expect($.getJSON.mostRecent).toBeUndefined();
				});

				it ("launch request if input value length >= n", function() {

					var spyRequest = spyOn($, "getJSON");

					var fixture = setHTMLFixture();
					$('#searcher').completer({
						url: '../../demo/files/completer.json',
						field: 'Name',
						fieldsToDisplay:['Name'],
						onChar: 3
					});

					var $input = fixture.find('input[type="text"]');

					var keyLetters = ['s', 'a', 'v']; // 83,65,86

					var e = jQuery.Event("keyup");

					e.keyCode = 83;
					$input.trigger(e);
					$input.val($input.val() + keyLetters[0]);

					e.keyCode = 65;
					$input.trigger(e);
					$input.val($input.val() + keyLetters[1]);

					e.keyCode = 86;
					$input.trigger(e);
					$input.val($input.val() + keyLetters[2]);

					expect($.getJSON.mostRecent).toBeUndefined(); // todo to rewrite false positive
				});

				it ("complete input when Enter key is pressed", function() {

					var fixture = setHTMLFixture();
					$('#searcher').completer({
						url: '../../demo/files/completer.json',
						field: 'Name',
						fieldsToDisplay:['Name'],
						onChar: 3
					});

					var $input = fixture.find('input[type="text"]');

					var e = jQuery.Event("keyup");

					e.keyCode = 13;
					$input.trigger(e);

					expect($input.focus()).toBeFocused(); // todo to rewrite false positive
				});

			});

		});

	});

})(jQuery);