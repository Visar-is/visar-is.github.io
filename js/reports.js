$(document).ready(function() {

	// Determine if Header is Fixed
	// Return corresponding height value
	// This is to add dynamic height when Messages are injected
	var header_padding = function() {
		if ($('header').css('position') === 'fixed') {
			var padding = $('header').height();
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
	
	/* Only make the table clickable/sortable if JS is loaded*/
	$('.sortable th').css('cursor','pointer');
	
    $('#table_search').keyup(function() {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

        $('.sortable tbody tr').show().filter(function() {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
        
        $('#search_text').html($('.sortable tbody tr:visible').length+' reports match.')
    });
	
});


