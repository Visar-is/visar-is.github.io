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
	
	// Set up (or hide) copy to clipboard buttons.
	if (ClipboardJS.isSupported()) {
		new ClipboardJS('.copy-to-clipboard');
	} else {
		$('.copy-to-clipboard').hide();
	}
});

if (!('ontouchstart' in document.documentElement)) {
	document.documentElement.className += ' no-touch';
}

// Add padding to .wrap so that scrolling to the last question doesn’t break flow
// in theory, += screen height - last question height - footer height. in practice…
$('#wrap').css('padding-bottom', '10em');


$('.response-input').click(function (event) {
	var inputEl = $(event.target),
		questionEl = inputEl.closest('.question'),
		responseEl = inputEl.closest('.response'),
		optionalTextEl = responseEl.find('.optional-text'),
		now = new Date().getTime();
	
	// If the response has been clicked before, make sure there’s been a >200ms delay before accepting further clicks.
	// This prevents double-clicking from accidentally de-selecting deselectable radio buttons.
	if (responseEl.attr('data-last-click') != null) {
		if (now - responseEl.attr('data-last-click') < 200) {
			return;
		}
	}
	
	if (responseEl.hasClass('selected')) {
		// The participant has clicked an already selected item. Ensure it is unselected, even if it is a radio button.
		inputEl.prop('checked', false);
		questionEl.find('.selected').removeClass('selected');
	} else {
		// The participant has clicked an unselected item.
		if (inputEl.prop('type') == 'radio') {
			questionEl.find('.response.selected').removeClass('selected');
			// This is probably redundant if inside a label element
			inputEl.prop('checked', true);
		}
		responseEl.addClass('selected');
		
		// If the response requires an advance, scroll to the next question.
		if (responseEl.hasClass('advance-on-click')) {
			var offset = questionEl.offset().top + questionEl.outerHeight();
			if ($('.question').length > 1) {
				$('body,html').animate({
					scrollTop: offset
				}, 290);
			}
		} else if (optionalTextEl.length > 0) {
			optionalTextEl.focus();
		}
	}
	
	// Record the time this most recent response click took place.
	responseEl.attr('data-last-click', now);
});

// Ensure that the relevant input is selected when an optional input is focused.
$('.optional-text').click(function (event) {
	var responseEl = $(event.target).closest('.response');
	if (!responseEl.hasClass('selected')) {
		responseEl.find('.response-input').click();
	}
});

// Expand optional text boxes to fill the space they’re in.
$('.optional-text').each(function (i, el) {
	var el = $(el);
	el.css('width', (el.parent().width() - el.prev().width() - 40) + 'px');
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
	
	var anonymPopupContainer = document.getElementById('continue_anonymously_popover_container'),
		isAnonymPopupContainerVisible;
		
	if (anonymPopupContainer) {
		isAnonymPopupContainerVisible = anonymPopupContainer.offsetHeight > 0 || anonymPopupContainer.offsetWidth > 0;
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
	} else if (anonymPopupContainer && (document.getElementsByName('informed_consent_keep_personal_information').length == 0 || !document.getElementsByName('informed_consent_keep_personal_information')[0].checked)  && !isAnonymPopupContainerVisible) {
		
		// Two different cases can lead here. Either the user pressed next on the informed consent page without choosing
		// to save personal information in a survey where that’s possible, or the survey has 
		// informed_consent.keep_personal_information_option set to false, in which case it is not possible to opt to
		// choose to continue keeping personal data, but we still want to show the pen and paper popup to encourage 
		// participants to write down their new anonymous code.
		// In this case, the button in the popup offering the option to continue anonymously is hidden server side.
		
		// Display the warning popup and prevent form submission.
		$('#continue_anonymously_popover_container').show();
		
		// Attach event handlers to keep personal information button.
		$('#continue_keeping_personal_information').click(function (event) {
			document.getElementsByName('informed_consent_keep_personal_information')[0].checked = true;
			
			// Allow the form to submit after changing the checkbox status.
		});
		
		event.preventDefault();
		return false;
	} else {
		// this should lock the button so it cannot be pressed twice.
		$(this).attr('data','disabled');
	}
});


(function () {
	var pausePopoverContainer = document.getElementById('pause_popover_container');
	var ppStartButton = $('#pause-popover-start-button');
	var ppPauseButton = $('#pause-popover-pause-button');
	
	$('#pause-button').click(function (event) {
		var pausePopoverContainerVisible = pausePopoverContainer.offsetHeight > 0 || pausePopoverContainer.offsetWidth > 0;
		
		if (pausePopoverContainer && !pausePopoverContainerVisible) {
			$(pausePopoverContainer).show();
			
			event.preventDefault();
			return false;
		}
	});
	
	$(pausePopoverContainer).click(function (event) {
		if (event.target === event.currentTarget) {
			$(this).hide();
		}
	});
	
	$('#continue_anonymously_popover_container').click(function (event) {
		if (event.target === event.currentTarget) {
			$(this).hide();
		}
	});
	
	$('.popover-container .close').click(function (event) {
		$(this).closest('.popover-container').hide();
		event.preventDefault();
		return false;
	});
	
	$(document).ready(function () {
		if (document.getElementById('pause-popover-start-button')) {
			// If the pause popover contains a start button, the survey has just started. We should display the survey start
			// variant of the pause popover, to encourage participants to write down their access key.
			ppStartButton.show();
			ppPauseButton.hide();
			$(pausePopoverContainer).show();
		}
	});
	
	ppStartButton.click(function (event) {
	 	// Don’t allow the pause dialog start button to submit the page form, just hide the modal and swap the buttons around.
		event.preventDefault();
		$(pausePopoverContainer).hide();
		ppStartButton.hide();
		ppPauseButton.show();
	});
}());