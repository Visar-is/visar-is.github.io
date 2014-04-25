"use strict";

var forEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i, list);
    }
};

var $1 = document.querySelector;

var AjaxReq = function (url, callback, method) {
    var httpRequest;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 8 and older
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    httpRequest.onreadystatechange = function (xhr) {
        if (xhr.currentTarget.readyState === 4) {
            callback(xhr.currentTarget);
        }
    };

    httpRequest.open(method || "GET", url, true);
    httpRequest.send(null);

    return httpRequest;
};

var body = document.querySelector('body');
body.className += (body.className != '' ? ' ':'') + 'js-ready';
