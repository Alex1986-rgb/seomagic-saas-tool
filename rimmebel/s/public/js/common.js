$(function() {

    //windows phone viewport fix
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
    }

    $("#clientPhone").inputmask("mask",{"mask": "+999999999999", "greedy": false });

    //init rm select
    $('.rm-select').rmSelect();

    $('.read-more-btn').click(function() {
        var $el = $(this),
            defaultHeight;
        var $box = $el.closest('.index-text-container');
        var boxHeight = $box.find('.index-text-box').height();
        var $btnText = $el.find('.read-more-btn-text');
        var listHeight = $box.find('.simple-text').height();

        if ($el.data('default-height') == undefined) {
            $el.data('default-height', boxHeight);
            defaultHeight = boxHeight;
        } else {
            defaultHeight = $el.data('default-height');
        }

        $box.find('.index-text-box')
            .stop(false, true)
            .animate({
                height: $box.hasClass('active') ? defaultHeight : listHeight
            }, 300, function(){
                $box.toggleClass('active');
                if ($box.hasClass('active')) {
                    $btnText.text("Свернуть");
                } else {
                    $btnText.text("Читать далее");
                }
            });

    });
});