$(document).ready(function() {

	// Set Padding Top for #content
	$('#content').css('padding-top', $('header').height() + 45);

	// Hide Message
	$('.message-close').on('click', function() {
		$(this).parent().fadeOut(function(){

			// Update Padding Top for #content
			$('#content').css('padding-top', $('header').height() + 45);
		});
	});

});