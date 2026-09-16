RimMebel.prototype.ItemGallery = function($gallery) {

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        //TODO start mobile gallery
    } else {
        $(".good-img-link").colorbox({
            rel:'item-gallery',
            photoRegex: /.*/i
        });
    }

};