(function(){

    var $overlay;

    var initPopup = function($popupBlock){

        this.bindClose = function($closeElements){
            $closeElements.bind('click', function(){
                this.hide();
            }.of(this));
        };

        this.bindOpen = function($openButton) {
            $openButton.click(function(){
                this.show();
            }.of(this));
        };

        this.hide = function(){
            $popupBlock.hide();
            $overlay.hide();
        };

        this.show = function() {
            this._openedClose();
            if ( document.documentElement.clientHeight > $popupBlock.height() + 40 ) {
                $popupBlock.css({
                    position : 'fixed',
                    top : '20px'
                })
            } else {
                $popupBlock.css({
                    position : 'absolute',
                    top : window.pageYOffset + 20
                })
            }
            $popupBlock.fadeIn(400);
            $overlay.show();
        };

        this._openedClose = function() {
            if (initPopup.opened instanceof initPopup) {
                initPopup.opened.hide();
            }
            initPopup.opened = this;
        };

        this.getCloseElements = function() {
            var $closeElements = $.merge((function(){
                if (!($overlay instanceof jQuery)) {
                    $overlay = $('#overlay');
                }
                return $overlay;
            })(), $('.rmPopupClose'));
            return $closeElements;
        };

    };

    window.initPopup = function($popupBlock, $openButton) {
        var rmPopup = $popupBlock.data('rmPopup');
        if (!(rmPopup instanceof initPopup)) {
            rmPopup = new initPopup( $popupBlock );
            rmPopup.bindClose( rmPopup.getCloseElements() );
            if ($openButton instanceof jQuery) {
                rmPopup.bindOpen( $openButton );
            }
            $popupBlock.data('rmPopup', rmPopup);
        }
        return rmPopup;
    };

    window.initNewPopup = function($popupBlock) {
        var rmPopup = new initPopup($popupBlock);
        rmPopup.bindClose(rmPopup.getCloseElements());
        return rmPopup;
    };

})();