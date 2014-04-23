"use strict";

// Login code
var AvatarPreview = function (element) {
    if (element) {
        element = $(element);
        element.on('blur', $.proxy(this.previewAvatar,this));
        element.on('change', $.proxy(this.previewAvatar,this));
        
        setTimeout($.proxy(function() {
            if (element.value != '') {
                this.previewAvatar();
            }
        }, this), 1000);
    }
};

AvatarPreview.autoInit = function () {
    $('.avatar-preview')
        .each(function (i, el) {
            new AvatarPreview(el);
        })
    ;
};

$.extend(AvatarPreview.prototype, {
    flags: {
        previewing: false
    },

    previewAvatar:  function () {
        if (this.flags.previewing) { return; };
        this.flags.previewing = true;

        var xhr = AjaxReq('/ajax/md5?username=' + username.value || '', $.proxy(function (xhr) {

            var img = document.getElementById('avatar_preview');
            if (img) {
                var avatar = new Image();
                var avatarUrl = "http://www.gravatar.com/avatar/" + xhr.responseText + "?s=200";
                avatar.onload = function () {
                    img.src = avatarUrl;
                    img.setAttribute('data-status', 'on');
                };
                avatar.src = avatarUrl;
            }

            this.flags.previewing = false;
        }, this));
    }
});


$(AvatarPreview.autoInit);
