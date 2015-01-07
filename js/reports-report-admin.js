// Django admin insert script for improving UX of huge multi-select checkbox lists.
// See also css/reports-report-admin.css

// This script is loaded in the header, so jQuery is guaranteed to be available but the DOM is not guaranteed to be loaded.
(function ($) {
	// Add new selectors to be enhanced here, as it cannot be done in the markup
	var selectors = [
		'.form-row.field-owners ul',
		'.form-row.field-shared_with ul',
	];
	
	$(document).ready(function () {
		$.each(selectors, function (i, selector) {
			var els = $(selector);
			els.addClass('multi-select-list');
			els.each(function (i, el) {
				var el = $(el);
				var statusEl = $('<p class="multi-select-status">0 selected</p>');
				var updateStatusEl = function () {
					var checked = el.find(':checked');
					if (checked.length == 0) {
						statusEl.text(checked.length + ' selected');
					} else {
						var checkedNames = [];
						checked.each(function (i, el) { checkedNames.push(el.parentElement.textContent); });
						statusEl.text(checked.length + ' selected: ' + checkedNames.join(', '));
					}
				};
				el.after(statusEl);
				el.find('input[type="checkbox"]').change(updateStatusEl);
				updateStatusEl();
			});
		});
	});
}(jQuery || django.jQuery));
