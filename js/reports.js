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
					}).forEach(function (c) {
						hcd[c] = true;
					});
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
			
			var showHoverBoxes = function (points, toggled=false) {
				points.each(function (i, pointEl) {
					if ([undefined, ''].indexOf(pointEl.getAttribute('data-name')) !== -1) {
						console.log('Point has no name, skipping', pointEl);
						return;
					}

					var hoverBoxEl = chartEl.find('.hover-box[data-index='+pointEl.getAttribute('data-index')+']');
					hoverBoxEl.text(pointEl.getAttribute('data-name'));
					hoverBoxEl.css('opacity') = '1';
					hoverBoxEl.css('top', $(pointEl).position().top + 20);
					hoverBoxEl.css('left', $(pointEl).position().left - (hoverBoxEl.outerWidth() / 2));
					if (toggled) {
						hoverBoxEl.addClass('toggled');
					}
				})
			};

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
					chartEl.find('.hover-box:not(.toggled)').css('opacity') = '';

					// Show hover effect elements.
					showHoverBoxes(points);
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
					chartEl.find('.hover-box:not(.toggled)').css('opacity') = '0';
				}
			});

			// Assign legend item click handler for toggling hover effects.
			chartEl.find('.key li').click(function (event) {
				var target = $(event.target);
				// Determine whether the target of the mouseout is a toggleable
				var hoverClass = Array.from(event.target.classList).find(function (c) {
					return hoverableClasses.includes(c);
				});

				if (hoverClass) {
					// If this item isn’t toggled, toggle it.
					if (!target.hasClass('toggled')) {
						chartEl.find('.point.'+hoverClass+', .lines .line.'+hoverClass).addClass('toggled');
						target.addClass('toggled');

						// If only one key item is toggled, toggle hover boxes for that item.
						if (chartEl.find('.key li.toggled').length == 1) {
							showHoverBoxes(chartEl.find('.point.' + hoverClass), true);
						} else {
							// If this click led to more than one item being toggled, untoggle and hide all hover boxes.
							chartEl.find('.hover-box.toggled').removeClass('.toggled').css('opacity') = '0';
						}
					} else { // Otherwise, untoggle it.
						target.removeClass('toggled');
						chartEl.find('.point.'+hoverClass+', .lines .line.'+hoverClass).removeClass('toggled');

						// Untoggle and hide relevant hover boxes.
						chartEl.find('.point.' + hoverClass).each(function (i, pointEl) {
							chartEl.find('.hover-box[data-index='+pointEl.getAttribute('data-index')+']').removeClass('toggled').css('opacity') = '0';
						});
					}

					// Make chart-wide toggle flag reflect reality.
					chartEl.toggleClass('toggled', chartEl.find('.toggled').length > 0);
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
					chartEl.find('.hover-box').css('opacity') = '0';

					// Add in hover effect elements.
					points.each(function (i, pointEl) {
						if ([undefined, ''].indexOf(pointEl.getAttribute('data-name')) !== -1) {
							console.log('Point has no name, skipping', pointEl);
							return;
						}

						var hoverBoxEl = chartEl.find('.hover-box[data-index='+pointEl.getAttribute('data-index')+']');
						hoverBoxEl.text(pointEl.getAttribute('data-name'));
						hoverBoxEl.css('opacity') = '1';
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
					chartEl.find('.hover-box').css('opacity') = '0';
				}
			});

			// Assign legend item click handler for toggling hover effects.
			chartEl.find('.key li').click(function (event) {
				var target = $(event.target);
				// Determine whether the target of the mouseout is a toggleable
				var hoverClass = Array.from(event.target.classList).find(function (c) {
					return hoverableClasses.includes(c);
				});

				if (hoverClass) {
					// If this item isn’t toggled, toggle it.
					if (!target.hasClass('toggled')) {
						chartEl.find('.point.'+hoverClass).addClass('toggled');
						chartEl.find('.longitudinal-lines line.' + hoverClass).each(function (i, lineEl) { lineEl.setAttribute('class', lineEl.getAttribute('class') + ' toggled')});
						target.addClass('toggled');
					} else { // Otherwise, untoggle it.
						target.removeClass('toggled');
						chartEl.find('.point.'+hoverClass).removeClass('toggled');
						chartEl.find('.longitudinal-lines line.' + hoverClass).each(function (i, lineEl) {
							lineEl.setAttribute('class', lineEl.getAttribute('class').split(' ').filter(function (c) { return c !== 'toggled' }).join(' '))
						});
					}

					// Make chart-wide toggle flag reflect reality.
					chartEl.toggleClass('toggled', chartEl.find('.toggled').length > 0);
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
				var hoverclass = event.target.getAttribute('class').replace('toggled', '');
				chartEl.addClass('hovered');
				chartEl.find('.' + hoverclass).addClass('hovered');
			});

			chartEl.find('.key li').mouseout(function (event) {
				// For the moment we can assume that bar chart legend items have a single class, vastly simplifying the hover code.
				var hoverclass = (event.target.getAttribute('class') || '').replace('hovered', '').replace('toggled', '');

				chartEl.removeClass('hovered');
				chartEl.find('.' + hoverclass).removeClass('hovered');
			});

			// Assign legend item click handler for toggling hover effects.
			chartEl.find('.key li').click(function (event) {
				var target = $(event.target);
				// For the moment we can assume that bar chart legend items have a single class, vastly simplifying the hover code.
				var hoverClass = (event.target.getAttribute('class') || '').replace('hovered', '').replace('toggled', '');

				if (hoverClass) {
					// If this item isn’t toggled, toggle it.
					if (!target.hasClass('toggled')) {
						chartEl.find('.'+hoverClass).addClass('toggled');
					} else { // Otherwise, untoggle it.
						chartEl.find('.'+hoverClass).removeClass('toggled');
					}

					// Make chart-wide toggle flag reflect reality.
					chartEl.toggleClass('toggled', chartEl.find('.toggled').length > 0);
				}
			});
		});
	}());

	// All Lines Longitudinal Chart Child Display
	$('#all-lines-child-select').change(function (event) {
		// Hide all toggleable elements.
		$('.all-lines-child-toggleable').each(function (i) { this.classList.add('hidden'); });
		if (this.value !== 'none') {
			$('.all-lines-child-toggleable.' + this.value).each(function (i) { this.classList.remove('hidden'); });
		}
	});
});
