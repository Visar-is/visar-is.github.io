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
	
	var csvFileInput = $('.create-customer-form [name=pull_list]');
	var csvPreviewTable;
	csvFileInput.change(function () {
		// reset preview table
		csvPreviewTable = csvFileInput.after('<table></table>');
		csvFileInput.parse({
			config: {
				header: false,
				dynamicTyping: false,
				preview: 10
			},
			complete: function (data) {
				console.log('Completed CSV file parsing');
				for (var i=0;i<data.results.length;i++) {(function (row) {
					var row = csvPreviewTable.append('<tr></tr>');
					for (var j=0; j<row.length; j++) {(function (column) {
						if (i === 0) {
							row.append('<th></th>').text(column);
						} else {
							row.append('<td></td>').text(column);
						}
					}(row[j]));}
				}(data.results[i]));}
			}
		});
	});
});
