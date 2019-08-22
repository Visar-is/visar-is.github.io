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
	var templateChooser = $('[name=template_id]');

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
		return Object.keys(selectedIds);
	};

	var updateStatus = function () {
		var text = [];
		composeEmailButton.prop('disabled', !multiSelectMode);
		exportCsvButton.prop('disabled', !multiSelectMode);
		if (multiSelectMode) {
			text.push(activeIds().length + ' selected');
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
				var stateEl = el.find('[name="' + key + '"]');
				if (stateEl.attr('type') == 'checkbox') {
					// The state is a boolean checkbox.
					var state = stateEl.prop('checked');
					if (state != (value == 'true')) {
						show = false;
					}
				} else if (key.includes('count')) {
					parts = value.split('-')
					if !(parseInt(stateEl.text()) >= parts[0] && parseInt(stateEl.text()) <= parts[1]) {
						show = false
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
				// If this row is hidden, remove it from the current multi-selection (if any).
				el.find('.multi-select-checkbox').prop('checked', false).change();
			}
		});
		
		updateStatus();
	};
	
	exportCsvButton.mousedown(function () {
		$('.hidden-customer-id').remove();
		activeIds().forEach(function (val, i) {
			exportCsvButton.parent().append('<input class="hidden-customer-id" type="hidden" name="ids[]" value="' + val + '" />');
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
		multiSelectMode = activeIds().length > 0;
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
				// Batch-update all the currently selected rows after confirmation
				if (confirm("This action will affect all " + activeIds().length + " currently selected rows. Proceed?")) {
					data['ids'] = activeIds();
					$.each(data['ids'], function (i, value) {
						var rowEquivalentCheckbox = $(rowSelector + '[data-id=' + value + '] input[name=' + checkbox.attr('name') + ']');
						if (checkbox.prop('checked')) {
							rowEquivalentCheckbox.prop('checked', true);
						} else {
							rowEquivalentCheckbox.removeProp('checked');
						}
					});
				} else {
					checkbox.prop('checked', !checkbox.prop('checked'));
					return;
				}
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
		
		el.find('.participation-text').each(function(i, el) {
			var el = $(el);
			var participationElTimeout = null;
			el.keyup(function (event) {
				window.clearTimeout(participationElTimeout);
				participationElTimeout = window.setTimeout(function () {
					var data = {'csrfmiddlewaretoken': csrfToken}
					data[el.attr('name')] = el.val();
					$.ajax(url, {
						'method': 'POST',
						'data': data,
						'success': function () {
							console.log('Saved participation text state');
						},
						'error': function () {
							console.log('Participation state save failed!');
						}
					});
				}, 500);
			});
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
		var payload = getMessagePayload(),
			ajaxPayload = {
				'message_template': payload.message_template,
				'subject_template': payload.subject_template,
				'preview_id': previewCustomerEl.val(),
				csrfmiddlewaretoken: csrfToken
			};
		
		sendPreviewButton.text('Send Preview');

		console.log("Starting XHR to /crm/preview-email with payload:");
		console.log(ajaxPayload);
		previewIframe.load('/crm/preview-email', ajaxPayload, function () {
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
	
	templateChooser.change(function (event) {
		editor.getDoc().setValue(templateChooser.val());
		subjectEl.val(templateChooser.find(':selected').text());
	});
	
	sendPreviewButton.click(function () {
		var payload = getMessagePayload();
		payload['preview_email'] = previewEmailEl.val();
		payload['preview_id'] = previewCustomerEl.val();

		console.log(payload);
		
		sendPreviewButton.prop('disabled', true);
		sendPreviewButton.text('Sending…');
		
		$.ajax('/crm/send-email', {
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
		payload['ids'] = activeIds().map(function (pId) { return $(rowSelector + '[data-id=' + pId + ']').attr('data-customer-id'); });
		
		if (editor.getDoc().getValue().search('/choose-services') !== -1) {
			if (!confirm('Your messages contains a hard-coded service choosing URL. The same one will be sent to all customers! Proceed?')) {
				return;
			}
		}
		
		console.log(payload);
		
		if (confirm('This will send email to ' + payload['ids'].length + ' customers. Continue?')) {
			sendButton.prop('disabled', true);
			sendButton.text('Sending…');
	
			$.ajax('/crm/send-email', {
				method: 'POST',
				data: payload,
				success: function (data, textStatus, xhr) {
					if (xhr.status == 200) {
						console.log('Started batch send!');
						sendButton.text('Started batch send');
					} else {
						console.log('Got an error when trying to send a preview', xhr);
						sendButton.text('Failed to start batch send');
					}
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
		}
	});
	
	// Initialization code
	(function init() {
		// Read current page state, sync with internal state.
		selectAllEl.change();
		$('.multi-select-checkbox').change();
		
		updateStatus();
	}());
};
