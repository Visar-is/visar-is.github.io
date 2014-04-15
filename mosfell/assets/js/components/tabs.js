"use strict";

// Tabs

var Tabs = function (element) {

    this.element = element;
    this.$element = $(element);

    this.init();
};

Tabs.autoInit = function () {
    $('.tabs')
        .each(function (i, el) {
            new Tabs(el);
        })
    ;
};

$.extend(Tabs.prototype, {

    init: function () {
        this.$element.find('.tabs--triggers a')
            .on('click', function (event) {
                var element = $(event.target);
                var targetId = element.attr('href').replace(/^\#/, '');
                var box = element.parents('.tabs').first();
                // Deactivate
                box
                    .find('.active')
                    .removeClass('active')
                ;
                // Activate
                box
                    .find('#' + targetId)
                    .addClass('active')
                ;
                element
                    .parent()
                    .addClass('active')
                ;

                event.preventDefault();
            })
        ;
    }
});

$(Tabs.autoInit);
