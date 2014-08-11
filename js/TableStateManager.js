/**
 * TableStateManager
 *
 * Abstraction for managing a table of filterable, bulk-editable, emailable things.
 *
 * Currently a highly specific wrapper around service behaviour, being slowly abstracted for use elsewhere too, e.g.
 * customer list page.
 *
 * Requires the email composition panel markup to be somewhere on-page.
 *
 * @param rowSelector A CSS selector which selects all of the row elements
 * @param batchUpdateUrl The URL to use for batch updating
 * @constructor
 */
var TableStateManager = function (rowSelector, batchUpdateUrl) {
	var participationEls = $(rowSelector);
	var selectAllEl = $('.select-all');
	var tableStateEl = $('.table-state');
	var columnFilters = $('.column-filter');
	var csrfToken = $('[name=csrfmiddlewaretoken]').val();
	var composeEmailButton = $('.compose-email-button');
	var exportCsvButton = $('.export-csv-button');
	var asPlainTableButton = $('.plain-table-button');
	var composeEmailEl = $('.email');
	var emailBackdropEl = $('.email-backdrop');
	var previewEmailEl = $('[name=preview-email]');
	var previewEmailPluralEl = $('.send-preview-plural').hide();
	var sendPreviewButton = $('[name=send-preview]');
	var audienceEl = $('[name=audience]');
	var sendButton = $('[name=send]');
	var previewCustomerEl = $('[name=preview-customer]');
	var emailComposeTextarea = $('.email [name=message]');
	var tokenEls = $('.email .token-list .token');
	var subjectEl = $('[name=subject]');
	var previewIframe = $('.preview-iframe');

	var multiSelectMode = false;
	var selectedIds = {};
	var allCustomerIds = [];
	var editor = CodeMirror.fromTextArea(emailComposeTextarea[0], {
		mode: 'text/html',
		viewportMargin: Infinity,
		lineWrapping: true
	});
	var numHidden = 0;

	var customerNames = {};
	participationEls.each(function () {
		customerNames[$(this).attr('data-id')] = $(this).find('.customer-name').text();
		allCustomerIds.push($(this).attr('data-id'));
	});
	
	var activeIds = function () {
		if (Object.keys(selectedIds).length > 0) {
			return Object.keys(selectedIds);
		} else {
			return allCustomerIds;
		}
	};

	var updateStatus = function () {
		var text = [];
		if (multiSelectMode) {
			text.push(Object.keys(selectedIds).length + ' selected');
		}
		if (numHidden > 0) {
			text.push(numHidden + ' hidden');
		}
		tableStateEl.text(text.join(', '));
	};

	var updateFilters = function () {
		var filterStates = {};
		columnFilters.each(function () {
			filterStates[this.name] = this.value;
		});

		numHidden = 0;
		
		participationEls.each(function () {
			var el = $(this);
			var show = true;
			$.each(filterStates, function (key, value) {
				if (value == 'all') {
					return;
				}
				
				// Logic for showing/hiding differs depending on type of relevant input.
				var stateEl = el.find('[name=' + key + ']');
				if (stateEl.attr('type') == 'checkbox') {
					// The state is a boolean checkbox.
					var state = stateEl.prop('checked');
					if (state != (value == 'true')) {
						show = false;
					}
				} else {
					// The state is a string comparison.
					show = stateEl.text() == value;
				}
			});

			if (show) {
				el.removeClass('hidden');
			} else {
				el.addClass('hidden');
				numHidden += 1;
				el.find('.multi-select-checkbox').prop('checked', false).change();
			}
		});

		updateStatus();
	};
	
	exportCsvButton.mousedown(function () {
		activeIds().forEach(function (val, i) {
			exportCsvButton.parent().append('<input type="hidden" name="ids[]" value="' + val + '" />');
		});
	});
	
	composeEmailButton.click(function () {
		emailBackdropEl.removeClass('hidden');
		// Update previewable schools list.
		previewCustomerEl.html('');
		activeIds().forEach(function (val, i) {
			var customerId = $(rowSelector + '[data-id=' + val + ']').attr('data-customer-id');
			previewCustomerEl.append('<option value="' + customerId + '">' + customerNames[val] + '</option>');
		});
	});
	
	emailBackdropEl.click(function (event) {
		if (event.target === emailBackdropEl[0]) {
			emailBackdropEl.addClass('hidden');
			// TODO: clear out the form fields here too.
		}
	});

	// Triggers change .multi-select.checkbox, doesn’t have to call updateStatus manually.
	selectAllEl.change(function () {
		var el = $(this);
		if (el.prop('checked')) {
			participationEls.each(function () {
				if (!$(this).hasClass('hidden')) {
					$(this).find('.multi-select-checkbox').prop('checked', true).change();
				}
			});
		} else {
			participationEls.find('.multi-select-checkbox').prop('checked', false).change();
		}
	});


	columnFilters.change(function (event) {
		updateFilters();
	});


	$('.multi-select-checkbox').change(function () {
		var id = $(this).prop('value');
		if ($(this).prop('checked')) {
			selectedIds[id] = true;
		} else {
			delete selectedIds[id];
		}
		multiSelectMode = Object.keys(selectedIds).length > 0;
		updateStatus();
	});


	participationEls.each(function () {
		var el = $(this);
		var participationId = el.attr('data-id');
		var url = el.attr('data-url');

		el.find('.participation-state').change(function (event) {
			var checkbox = $(event.target);
			var data = {};
			data[checkbox.attr('name')] = checkbox.prop('checked') ? '1' : '0';
			data['csrfmiddlewaretoken'] = csrfToken;

			if (multiSelectMode) {
				// Batch-update all the currently selected rows.
				data['ids'] = Object.keys(selectedIds);
				$.each(data['ids'], function (i, value) {
					var rowEquivalentCheckbox = $(rowSelector + '[data-id=' + value + '] input[name=' + checkbox.attr('name') + ']');
					if (checkbox.prop('checked')) {
						rowEquivalentCheckbox.prop('checked', true);
					} else {
						rowEquivalentCheckbox.removeProp('checked');
					}
				});
			}

			$.ajax(multiSelectMode ? batchUpdateUrl : url, {
				'method': 'POST',
				'data': data,
				'success': function () {
					console.log('Saved participation state', participationId, data);
				},
				'error': function () {
					console.log('Participation state save failed!');
				}
			});

			updateFilters();
		});
	});

	// Tiny feedback loop reinforcing multiple email addresses in preview field.
	previewEmailEl.keyup(function () {
		if (previewEmailEl.val().indexOf(' ') !== -1) {
			previewEmailPluralEl.show();
		} else {
			previewEmailPluralEl.hide();
		}
	});

	var getMessagePayload = function () {
		editor.save();
		return {
			subject_template: subjectEl.val(),
			message_template: emailComposeTextarea.val(),
			csrfmiddlewaretoken: csrfToken,
			audience: audienceEl.val()
		};
	};

	var updateEmailPreview = function () {
		var payload = getMessagePayload();
		sendPreviewButton.text('Send Preview');

		// TODO: insert time delay.
		previewIframe.load('/preview-email', {
			'message_template': payload.message_template,
			'subject_template': payload.subject_template,
			'preview_id': previewCustomerEl.val(),
			csrfmiddlewaretoken: csrfToken
		}, function () {
			console.log('XHR Complete');
		});
	};
	
	// Insert ready-made tokens into the editor on click.
	tokenEls.click(function (event) {
		editor.getDoc().replaceRange('{{ ' + event.target.textContent + ' }}', editor.getDoc().getCursor());
	});
	
	editor.on('change', updateEmailPreview);
	subjectEl.keyup(updateEmailPreview);
	previewCustomerEl.change(updateEmailPreview);
	
	sendPreviewButton.click(function () {
		var payload = getMessagePayload();
		payload['preview_email'] = previewEmailEl.val();
		payload['preview_id'] = previewCustomerEl.val();

		console.log(payload);
		
		sendPreviewButton.prop('disabled', true);
		sendPreviewButton.text('Sending…');
		
		$.ajax('/send-email', {
			method: 'POST',
			data: payload,
			success: function () {
				console.log('Sent preview!');
				sendPreviewButton.text('Sent!');
			},
			error: function () {
				console.log('Got an error when trying to send a preview');
				sendPreviewButton.text('Preview send failed');
			},
			complete: function () {
				console.log('AJAX finished');
				sendPreviewButton.prop('disabled', false);
			}
		});
	});
	
	sendButton.click(function () {
		var payload = getMessagePayload();
		payload['ids'] = activeIds();
		
		console.log(payload);
		sendButton.prop('disabled', true);
		sendButton.text('Sending…');

		$.ajax('/send-email', {
			method: 'POST',
			data: payload,
			success: function () {
				console.log('Started batch send!');
				sendButton.text('Started batch send');
			},
			error: function (err) {
				console.log('Got an error when trying to send a preview', err.responseText, err);
				sendButton.text('Starting batch send failed');
			},
			complete: function () {
				console.log('AJAX finished');
				sendButton.prop('disabled', false);
			}
		});
	});
};