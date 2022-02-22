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
	
	// For the moment, chart hover effects are implemented separately for each chart type. Might be possible
	// to generalise this in the future, if having multiple functions becomes enough of a maintenance burden.

	// Scatter chart hover effects.
	(function () {
		$('.chart.scatter').each(function (i, chartEl) {
			var chartEl = $(chartEl);
			var keyEl = chartEl.find('.key');
			var hoverableClasses = [];
			
			// Make a list of hoverable classes.
			if (keyEl.find('[data-hoverclass]').length > 0) {
				keyEl.find('[data-hoverclass]').each(function (i, el) {
					hoverableClasses.push(el.getAttribute('data-hoverclass'));
				});
				console.log('Hoverable classes are', hoverableClasses);
			} else {
				var hcd = {};
				chartEl.find('.point').each(function (i, el) {
					el.getAttribute('class').split(' ').filter(function (c) {
						return c[0] == 's'
							|| c == 'you-line'
							|| c == 'compare-line'
					});
				}).forEach(function (c) {
					hcd[c] = true;
				});

				hoverableClasses = Object.keys(hcd);
			}

			// Do some setup work now that we know which elements are hoverable.
			hoverableClasses.forEach(function (hoverClass) {
				var lines = chartEl.find('.lines .line.' + hoverClass);

				// Make thicker, transparent duplicates of every hoverable line element, requiring less sensitive mouse positioning.
				lines.each(function (i, lineEl) {
					var hoverLineEl = lineEl.cloneNode();
					hoverLineEl.setAttribute('class', hoverLineEl.getAttribute('class') + ' hover-area');
					lineEl.parentElement.appendChild(hoverLineEl);
				});
			});

			// Assign a chart-wide mouseover handler.
			chartEl.mouseover(function (event) {
				var target = event.target;

				// Determine whether the target of the mouseover is a hoverable element.
				if (event.target.classList.contains('dot')) {
					target = event.target.parentElement;
				}

				var hoverClass = Array.from(target.classList).find(function (c) {
					return hoverableClasses.includes(c);
				});
				
				if (hoverClass) {
					var points = chartEl.find('.point.' + hoverClass);
					var lines = chartEl.find('.lines .line.' + hoverClass);

					chartEl.addClass('hovered');
					points.addClass('hovered');
					lines.addClass('hovered');
					keyEl.find('.' + hoverClass).addClass('hovered');

					// Ensure that hover effect elements are cleaned up.
					chartEl.find('.hover-box').hide();

					// Add in hover effect elements.
					points.each(function (i, pointEl) {
						if ([undefined, ''].indexOf(pointEl.getAttribute('data-name')) !== -1) {
							console.log('Point has no name, skipping', pointEl);
							return;
						}

						var hoverBoxEl = chartEl.find('.hover-box[data-index='+pointEl.getAttribute('data-index')+']');
						hoverBoxEl.text(pointEl.getAttribute('data-name'));
						hoverBoxEl.show();
						hoverBoxEl.css('top', $(pointEl).position().top + 20);
						hoverBoxEl.css('left', $(pointEl).position().left - (hoverBoxEl.outerWidth() / 2))
					})
				}
			});

			chartEl.mouseout(function (event) {
				var target = event.target;

				// Determine whether the target of the mouseover is a hoverable element.
				if (event.target.classList.contains('dot')) {
					target = event.target.parentElement;
				}
				
				var hoverClass = Array.from(target.classList).find(function (c) {
					return hoverableClasses.includes(c);
				});

				if (hoverClass) {
					var points = chartEl.find('.point.' + hoverClass);
					var lines = chartEl.find('.lines .line.' + hoverClass);

					chartEl.removeClass('hovered');
					points.removeClass('hovered');
					lines.removeClass('hovered');
					keyEl.find('.'+hoverClass).removeClass('hovered');

					// Hide hover effects.
					chartEl.find('.hover-box').hide();
				}
			});

		});
	}());

	// Longitudinal chart hover effects.
	(function () {
		$('.bn-longitudinal-chart').each(function (i, chartEl) {
			var chartEl = $(chartEl);
			var hoverableClasses = [];
			var keyEl = chartEl.find('.key');
			
			// Make a list of hoverable classes. If any key items have data-hoverable, then it’s a new chart using
			// explicit hoverability. Otherwise, use the cludgy old heuristic.
			if (keyEl.find('[data-hoverclass]').length > 0) {
				keyEl.find('[data-hoverclass]').each(function (i, el) {
					hoverableClasses.push(el.getAttribute('data-hoverclass'));
				});
			} else {
				var hcd = {};
				chartEl.find('.data line').each(function(i, el) {
					// We need a classname which identifies lines of the same class as the one we’re processing right now.
					// Currently, this is not easily achievable across different types of longitudinal chart, and fixing that
					// would require regenerating many charts. Therefore, for the moment, I opted for two special cases: one
					// handling longitudinal scatter charts (the original) and the other handling cohort charts.
					hcd[$(el).attr('class').split(' ').filter(function (c) {
						// Is the current classname one which we can use to identify associated line and li.point elements?
						// • of the form `s\d+` for longitudinal schools
						// • `cohort-grade-\d+` for grade cohort charts.
						// • {you/compare}-bg-{bg_key}-{bg_val} for background longitudinal charts.
						return c[0] == 's'
							|| c.match(/^[a-zA-Z0-9_]+-bg-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+/) !== null
							|| c.indexOf('cohort-grade-') != -1
							|| (c == 'you' || c == 'compare');
					}).reduce(function (longest, current) {
						return current.length > longest.length ? current : longest;
					})] = true;
					hoverableClasses = Object.keys(hcd);
				});
			}

			// Do some setup work now that we know which elements are hoverable.
			hoverableClasses.forEach(function (hoverClass) {
				var points = chartEl.find('.point.' + hoverClass);
				var lines = chartEl.find('.longitudinal-lines line.' + hoverClass);
				chartEl.find('.point.' + hoverClass).last().addClass('last');

				// Make thicker, transparent duplicates of every hoverable line element, requiring less sensitive mouse positioning.
				lines.each(function (i, lineEl) {
					var hoverLineEl = lineEl.cloneNode();
					hoverLineEl.setAttribute('class', hoverLineEl.getAttribute('class') + ' hover-area');
					lineEl.parentElement.appendChild(hoverLineEl);
				});
			});


			// Assign chart-level event handlers for relevant hover events.
			chartEl.mouseover(function (event) {
				// Determine whether the target of the mouseover is a hoverable element.
				var hoverClass = Array.from(event.target.classList).find(function (c) {
					return hoverableClasses.includes(c);
				});
				
				if (hoverClass) {
					var points = chartEl.find('.point.' + hoverClass);
					var lines = chartEl.find('.longitudinal-lines line.' + hoverClass);

					chartEl.addClass('hovered');
					points.addClass('hovered');
					keyEl.find('.' + hoverClass).addClass('hovered');
					// Even jQuery 3.6 seems to not correctly support svg class operations.
					lines.each(function (i, lineEl) { lineEl.setAttribute('class', lineEl.getAttribute('class') + ' hovered')});

					// Ensure that hover effect elements are cleaned up.
					chartEl.find('.hover-box').hide();

					// Add in hover effect elements.
					points.each(function (i, pointEl) {
						if ([undefined, ''].indexOf(pointEl.getAttribute('data-name')) !== -1) {
							console.log('Point has no name, skipping', pointEl);
							return;
						}

						var hoverBoxEl = chartEl.find('.hover-box[data-index='+pointEl.getAttribute('data-index')+']');
						hoverBoxEl.text(pointEl.getAttribute('data-name'));
						hoverBoxEl.show();
						hoverBoxEl.css('top', $(pointEl).position().top + 20);
						hoverBoxEl.css('left', $(pointEl).position().left - (hoverBoxEl.outerWidth() / 2))
					})
				}
			});

			chartEl.mouseout(function (event) {
				// Determine whether the target of the mouseout is a hoverable element.
				var hoverClass = Array.from(event.target.classList).find(function (c) {
					return hoverableClasses.includes(c);
				});

				if (hoverClass) {
					var points = chartEl.find('.point.' + hoverClass);
					var lines = chartEl.find('.longitudinal-lines line.' + hoverClass);

					chartEl.removeClass('hovered');
					points.removeClass('hovered');
					keyEl.find('.'+hoverClass).removeClass('hovered');
					// Even jQuery 3.6 seems to not correctly support svg class operations.
					lines.each(function (i, lineEl) {
						lineEl.setAttribute('class', lineEl.getAttribute('class').split(' ').filter(function (c) { return c !== 'hovered' }).join(' '))
					});

					// Hide hover effects.
					chartEl.find('.hover-box').hide();
				}
			});
		});
	}());

	// Bar chart hover effects
	// For the moment, this is a much more basic version of the effects than in the other charts, simply
	// reacting to legend hovers by highlighting relevant values.
	(function () {
		$('.bar-chart').each(function (i, el) {
			var chartEl = $(el);
			
			chartEl.find('.key li').mouseover(function (event) {
				// For the moment we can assume that bar chart legend items have a single class, vastly simplifying the hover code.
				var hoverclass = event.target.getAttribute('class');
				chartEl.addClass('hovered');
				chartEl.find('.' + hoverclass).addClass('hovered');
			});

			chartEl.find('.key li').mouseout(function (event) {
				// For the moment we can assume that bar chart legend items have a single class, vastly simplifying the hover code.
				var hoverclass = (event.target.getAttribute('class') || '').replace('hovered', '');

				chartEl.removeClass('hovered');
				chartEl.find('.' + hoverclass).removeClass('hovered');
			});
		});
	}());
});
