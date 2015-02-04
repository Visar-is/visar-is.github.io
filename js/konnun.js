$(document).ready(function() {

	// Determine if Header is Fixed
	// Return corresponding height value
	var header_padding = function() {
		if ($('header').css('position') === 'fixed') {
			var padding = $('header').height() + 45;
		}
		else {
			var padding = 0;
		}
		return padding;
	};

	// Set Padding Top for #content
	$('#content').css('padding-top', header_padding());

	// Hide Message
	$('.message-close').on('click', function() {
		$(this).parent().fadeOut(function() {
			// Update Padding Top for #content
			$('#content').css('padding-top', header_padding());
		});
	});
	
	
	$('<style />').html($('#webfonts').html()).appendTo($('head'));
});

if (!('ontouchstart' in document.documentElement)) {
	document.documentElement.className += ' no-touch';
}

// Add padding to .wrap so that scrolling to the last question doesn’t break flow
// in theory, += screen height - last question height - footer height. in practice…
$('#wrap').css('padding-bottom', '10em');


// Autoscroll to next question on click
$('.advance-on-click').click(function (event) {
	var currentQuestion = $(event.target).closest('.question');
	var offset = currentQuestion.offset().top + currentQuestion.outerHeight();
	
	// If the clicked option is already selected, un-select it and take no further action.
	if (currentQuestion.find(':checked').closest('.choice-target').hasClass('selected')) {
		currentQuestion.find(':checked').prop('checked', false);
		currentQuestion.find('.choice-target').removeClass('selected');
		return;
	}
	
	
	if ($(this).hasClass('radio-target') || $(this).hasClass('radio-optional-target')) {
		$(event.target).closest('.choice-target').addClass('selected');
	}
	
	if ($(this).hasClass('checkbox-target') || $(this).hasClass('checkbox-optional-target')) {
		if($(this).find('input').prop('checked')) {
			$(event.target).closest('.choice-target').addClass('selected');
		} else {
			$(event.target).closest('.choice-target').removeClass('selected');
		}
	}
	
	if ($('.question').length > 1) {
		if (!($(this).hasClass('radio-optional-target') || $(this).hasClass('checkbox-optional-target') || $(this).hasClass('checkbox-target'))) {
			$('body,html').animate({
				scrollTop: offset
			}, 290);
		}
	}
});


// Set checkbox/choice open response option target elements.
$('.radio-optional-target').parent().click(function (event) {
	$(this).parent().addClass('selected');
	$(this).find('.optional-text').focus();
	$(this).find('input[type=radio]').prop('checked', true);
});
$('.checkbox-optional-target').parent().click(function (event) {
	$(this).find('.optional-text').focus();
	$(this).find('input[type=checkbox]').prop('checked');
});

$('.optional-text').click(function (event) {
	$(this).parent().addClass('selected');
	$(this).parent().find('input[type=checkbox]').prop('checked', true);
	$(this).parent().find('input[type=radio]').prop('checked', true);
});


// Required question validation
$('#next-button').click(function (event) {
	// Always let the user go back, only check values on next
	if ($(event.target).attr('name') === 'back')
		return true;
	if($(this).attr('data') == 'disabled')
		return false;
		
	// Check to see if anything which is required has not been filled in
	var requiredFields = $('[data-required]');
	
	// Clear any current signs of invalidity
	requiredFields.each(function (i, e) {
		$(e).removeClass('invalid');
	});
	
	var unfulfilled = requiredFields.filter(function (i) {
		var el = $(this);
		
		if (el.hasClass('choice') || el.hasClass('checkbox') || el.hasClass('multiple-choice')) {
			// If a choice question is required, an option must be checked.
			// If a multiple-choice question is required, then it should only ever have one
			// checkbox, which is required to be checked.
			// This selector does both.
			var selected = $(this).find('input:checked');
			return selected.length === 0 ? true : false; 
		} else if (el.hasClass('open')) {
			// Unlikely to be used, but allow for this anyway. open requires a len of > 0
			// to be valid
			return el.find('textarea').val() === '' ? true : false;
		} else if (el.hasClass('dropdown-label')) {
			// If it’s a dropdown, check that the value is not the empty string.
			return el.find('select').val() == '';
		}
		
		// No client-side handler set up for this question choice so don’t require it here, leave it to the server.
		return false;
	});
	
	
	if ($('.constrained-dropdown').length > 0) {
		var sum_total = 0;
		$('.constrained-dropdown .percentage-select').each(function() {
			val = $(this).val();
			if (val == '') { val = 0; }
			sum_total += parseInt(val);

		});
		
		if (sum_total != 100 && sum_total != 0) { 
			unfulfilled.push.apply(unfulfilled,$('.constrained-dropdown').filter(function() { return true; })); 
		}
	}
	
	// if there are any unfulfilled questions:
	if (unfulfilled.length !== 0) {
		// Mark them as invalid, show their correction instructions
		unfulfilled.each(function (i, e) {
			$(e).addClass('invalid');
		});
		
		// Navigate to the first unfulfilled question
		document.location.hash = $(unfulfilled[0]).attr('id');
		
		// Prevent form submit
		event.preventDefault();
		return false;
	} else {
		// this should lock the button so it cannot be pressed twice.
		$(this).attr('data','disabled');
	}
});
