/* Vísar.is - konnun.js 
	- Requires the Mac OS application CodeKit to compile prepend tags below
	- http://incident57.com/codekit
	- Created by Brennan Novak, June 2013
*/

/*	Import JS Libraries
	@codekit-prepend "lib/jquery.1.9.1.min.js";
	@codekit-prepend "lib/html5shiv.js";

	Import JS App Components
	@codekit-prepend "global/messages.js";	
*/

$(document).ready(function() {


	// Fix old safari bugs
	$('label').click(function() {});


	// Next In Survey 
	$('#next-button, #finish-button').click(function(event) {

		// Always let the user go back, only check values on next
		if ($(event.target).attr('name') === 'back') {
		  return true;
		}
	
		// Check to see if anything which is required has not been filled in
		var requiredFields = $('[data-required]');
	
		// Clear any current signs of invalidity
		requiredFields.each(function(i, e) {
			$(e).removeClass('invalid');
			$(e).find('.correction-instructions').hide();
		});
		
		// 
		var unfulfilled = requiredFields.filter(function(i) {

			var el = $(this);

			if (el.hasClass('choice') || el.hasClass('multiple-choice')) {
	
				// If a choice question is required, an option must be checked.
				// If a multiple-choice question is required, then it should only ever have one
				// checkbox, which is required to be checked.
				// This selector does both.
				var selected = $(this).find('input:checked');
				return selected.length === 0 ? true : false; 
			}
			else if (el.hasClass('open')) {
				// Unlikely to be used, but allow for this anyway. open requires a len of > 0
				// to be valid
				return el.find('textarea').val().length == 0 ? true : false;
			}

			// No handler set up for this question choice so assume correct
			return true;
		});

		// If there are any unfulfilled questions:
		if (unfulfilled.length !== 0) {

			// Mark them as invalid, show their correction instructions
			unfulfilled.each(function(i, e) {
				$(e).find('.correction-instructions').show();
				$(e).addClass('invalid');
			});

			// Navigate to the first unfulfilled question
			document.location.hash = $(unfulfilled[0]).attr('id');

			// Prevent form submit
			return false;
		}
	});

});