( function( $ ) {
    "use strict";
    function ss_plugin_loadpopup_js(em){
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

    $('.dm-modal').each(function (index, popup) {
        let modal = $(this),
            $target = $(modal.attr('data-targetby'));

        if ( ! $target.attr('data-toggle') ) {
            $(document).on('click', modal.attr('data-targetby') , function (e) {
                if (!$('body').hasClass('elementor-editor-active')) {
                    e.preventDefault();
                    modal.modal('show');
                }
            });
        }
    });

} )( jQuery );
