"use strict";

        
var Contacts = {};

Contacts.deleteContact = function(element, url, callback) {
    var csrf = $("[name='csrfmiddlewaretoken']").val();

    $.post(url, {
        'csrfmiddlewaretoken': csrf
    }, function (xhr) {
        callback(xhr, element);
    });
};


Contacts.fadeOutAndRemove = function(element) {
    element = $(element);
    element.addClass('contact__removed');
};

Contacts.delete = function(event) {
        event.preventDefault();

        var target = $(event.currentTarget).find('.delete-contact-final');

        var contactId = target.attr('data-contact-id');
        Contacts.deleteContact(target, target.attr('href'), function(xhr, element) {
            if (xhr.success && xhr.success == true) {
                var id = element.attr('data-contact-id');
                var box = $('.mosfell-contact[data-id=' + id +']');
                if(box) {
                    Contacts.fadeOutAndRemove(box);  
                } else {
                    alert('Contact removed.');
                }
                
            } else {
                alert('Something went wrong...')
            }
        });
    }

$(function () {
    $('.contact--delete--trigger')
        .on('submit', Contacts.delete )
    ;
});
