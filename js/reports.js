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
	
	// Solves Chrome Bug #350893
	// Causes a flicker, should only do this for Chrome browsers!
	$("#header object").each(function() { $(this).load($(this).attr("data")); });
	
	// Longitudinal chart hover effects.
	(function () {
		var yslines = $('line.you_schools');

		yslines.each(function(i, ysline) {
			var schoolClass = ysline.getAttribute('class').split(' ').filter(function (c) { return c[0] == 's'; })[0];
			var points = $('.point.' + schoolClass);
			var lines = $('.longitudinal-lines line.' + schoolClass);
			$('.point.' + schoolClass).last().addClass('last');

			$(ysline).on('mouseover', function (event) {
				points.addClass('hovered');
				lines.each(function (i, line) {
					line.setAttribute('class', line.getAttribute('class') + ' hovered');
				});
			});

			$(ysline).on('mouseout', function (event) {
				points.removeClass('hovered');
				lines.each(function (i, line) {
					line.setAttribute('class', line.getAttribute('class').split(' ').filter(function (c) { return c != 'hovered'; }).join(' '));
				});
			});
		});
	}());
});
