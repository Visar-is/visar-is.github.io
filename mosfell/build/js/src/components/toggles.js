"use strict";

// open/closed containers
$('[data-toggle-id]')
    .on('click', function (event) {

        var target = $(event.currentTarget);
        var selector = '#' + target.attr('data-toggle-id');
        var toggleThis = $(selector);
        var status = toggleThis.attr('data-toggle-status');
        toggleThis.attr('data-toggle-status', status == 'closed' ? 'open' : 'closed');
        target.attr('data-toggle-trigger-status', status == 'closed' ? 'open' : 'closed');

    })
;