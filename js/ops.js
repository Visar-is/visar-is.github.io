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


	// Solves Chrome Bug #350893.
	$("object").each(function() { $(this).load(this.getAttribute("data")); });
	
	(function () {
		$('.collapsible-header').click(function (event) {
			var collectionEl = $(event.target).closest('.collapsible');
			var ddimg = collectionEl.find('.collapsible-expanded-indicator img');
			var currentSrc = ddimg.prop('src');
			event.preventDefault();

			if (collectionEl.hasClass('collapsed')) {
				collectionEl.removeClass('collapsed');
			} else {
				collectionEl.addClass('collapsed');
			}
			ddimg.prop('src', ddimg.attr('data-toggle-src'));
			ddimg.attr('data-toggle-src', currentSrc);
		});
	}());
	$('.collapsible.collapse-on-load:not(.collapsed) .collapsible-header').click();


	// Apply default sort.
	window.setTimeout(function () {
		$('.default-sort').each(function () {
			sorttable.innerSortFunction.apply(this, []);
		});
	}, 100);
	
	
	// Progressively enhance participant state forms.
	$('.participant-state-form [type=submit]').remove();
	$('.participant-state-form [name=call_status]').change(function () {
		var callStatusEl = $(this);
		var callStatusForm = callStatusEl.closest('form');
		var data = callStatusForm.serialize();
		console.log(data);

		callStatusEl.prop('disabled', true);
		
		$.ajax({
			url: callStatusForm.attr('action'),
			type: callStatusForm.attr('method'),
			data: data,
			processData: false,

			success: function () {
				callStatusEl.attr('data-saved-value', callStatusEl.val());
			},

			error: function () {
				callStatusEl.val(callStatusEl.attr('data-saved-value'));
			},

			complete: function () {
				callStatusEl.prop('disabled', false);
			}
		});
	});

});
