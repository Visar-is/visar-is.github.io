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
	
	/* Only make the table clickable/sortable if JS is loaded */
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
		var yslines = $('.longitudinal-lines line');

		yslines.each(function(i, ysline) {
			var chartEl = ysline.next('.chart');

			// We need a classname which identifies lines of the same class as the one we’re processing right now.
			// Currently, this is not easily achievable across different types of longitudinal chart, and fixing that
			// would require regenerating many charts. Therefore, for the moment, I opted for two special cases: one
			// handling longitudinal scatter charts (the original) and the other handling cohort charts.
			var lineClass = ysline.getAttribute('class').split(' ').filter(function (c) {
				// Is the current classname one which we can use to identify associated line and li.point elements?
				// • of the form `s\d+` for longitudinal schools
				// • `cohort-grade-\d+` for grade cohort charts.
				// • {you/compare}-bg-{bg_key}-{bg_val} for background longitudinal charts.
				return c[0] == 's'
					|| (c == 'you' || c == 'compare')
					|| c.indexOf('cohort-grade-') != -1
					|| c.match(/^[a-zA-Z0-9_]+-bg-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+/) !== null;
			})[0];
			
			var points = $('.point.' + lineClass);
			var lines = $('.longitudinal-lines line.' + lineClass);
			$('.point.' + lineClass).last().addClass('last');

			$(ysline).on('mouseover', function (event) {
				points.addClass('hovered');
				lines.addClass('hovered');
				chartEl.addClass('hovered');
			});

			$(ysline).on('mouseout', function (event) {
				points.removeClass('hovered');
				lines.removeClass('hovered');
				chartEl.removeClass('hovered');
			});
		});
	}());
});
