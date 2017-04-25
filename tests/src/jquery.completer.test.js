(function () {

	"use strict";

	describe("Completer library", function() {

		describe("Initialize", function() {

			it("Must have one DOM object, and URL option mandatory", function() {
				expect($('#auto-complete').completer({
					url: 'files/completer.json',
					field: 'Name',
					speed: 350,
					animation: 'slide'
				})).toBe($);
			});

			/*
			it("Devrait lancer une exception si l'entrée n'est pas numérique", function()  {
				expect(Conversion.livreVersKilo.bind("abc"))
					.toThrow("ValeurLivreIncorrecte");
			});
			*/

		});
	});

})();