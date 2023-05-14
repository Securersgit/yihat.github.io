function dm_social_share(em){
    var shareurl=em.href;
    var top = (screen.availHeight - 500) / 2;
    var left = (screen.availWidth - 500) / 2;
    var popup = window.open(
        shareurl,
        'social sharing',
        'width=550,height=420,left='+ left +',top='+ top +',location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1'
    );
    return false;
}

(function( $ ){
    "use strict";

    $('.dm-social-sharing[data-location="before-content"]').each(function (index, element) {
        $(element).clone().insertBefore('#main-content .post-content');
        $(element).remove();
    });

})(jQuery);