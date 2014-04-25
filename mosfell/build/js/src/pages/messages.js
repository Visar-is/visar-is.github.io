"use strict";

var Messages = {};

Messages.init = function () {
    var recipientCheckboxes = document.querySelectorAll('input[type=checkbox][data-recipient]');

    forEach(recipientCheckboxes, function forEachRecipientCheckbox(cb) {
        cb.addEventListener('change', Messages.updateContactCount, false);
    });

    Messages.bindToggleButtons();

    Messages.bindTouchyUpdateLink();
    Messages.preventOverlapsUpdateLinks();
};

Messages.updateContactCount = function handleRecipientCheckboxChange(event) {
    var count = document.querySelectorAll('input[type=checkbox][data-recipient]:checked').length,
        dispVal = count != 1 ? 'inline' : 'none',
        recipientCounts = document.querySelectorAll('[data-recipient-count]'),
        recipientPlurals = document.querySelectorAll('[data-recipient-count-plural]')
    ;

    forEach(recipientCounts, function updateRecipientCount(el) {
        el.innerText = count;
    });
    forEach(recipientPlurals, function toggleRecipientPlural(el) { 
        el.style.display = dispVal;
    });
};


Messages.toggle = {
    all: function (ev) {
        var el = ev.target;
        var container = document.querySelector("#" + el.getAttribute('data-for'));
        if (container) {
            var checks = $('input[type=checkbox]'),
                chk;
            for(var i=0;i<checks.length;i++) {
                chk = $(checks[i]);
                if (chk.attr('disabled') !== 'disabled') {
                    chk.prop('checked', true);
                }
            }
        }
        Messages.updateContactCount();
    },

    inv: function (ev) {
        var el = ev.target;
        var container = document.querySelector("#" + el.getAttribute('data-for'));
        if (container) {
            var checks = container.querySelectorAll('input[type=checkbox]'),
                chk;
            for(var i=0;i<checks.length;i++) {
                chk = $(checks[i]);
                if (chk.attr('disabled') !== 'disabled') {
                    chk.prop('checked', chk.prop('checked') == false);
                }
            }
        }
    }
};

Messages.bindToggleButtons = function () {
    var toggleAll = document.querySelectorAll('.toggle-all');
    var toggleInv = document.querySelectorAll('.toggle-inv');

    forEach(toggleAll, function (el) {
        el.addEventListener('click', Messages.toggle.all);
    });

    forEach(toggleInv, function (el) {
        el.addEventListener('click', Messages.toggle.inv);
    });
};

Messages.preventOverlapsUpdateLinks = function () {

    $('.contact--show-update-link')
        .on('click', function () {
            // close all others
            var trigger = $(this);
            if (trigger.attr('data-toggle-trigger-status') == 'open') {
                $('.contact--update-link[data-toggle-status="open"]')
                    .each(function (i, el) {
                        console.log(el);
                        var $el = $(el);
                        if($el.prev().get(0) !== trigger.get(0)) {
                            $el.attr('data-toggle-status', 'closed');
                        }
                    })
                ;
            }
        });
};

Messages.bindTouchyUpdateLink = function () {
    var focusedElement;
    $('.contact--update-link input')
        .on('focus', function () {
            if (focusedElement == this) return; // already has focus
            focusedElement = this;
            setTimeout(function () { focusedElement.select(); }, 50); 
        })
    ;
};


$(Messages.init);