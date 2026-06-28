RimMebel.prototype.CitySwitcher = function() {

    var _$block;

    this.setBlock = function($block) {
        _$block = $block;
    };

    this.bindSwitch = function() {
        _$block.find('.header-cities-item').click(function() {
            var $city = $(this);
            if (!$city.hasClass('clicked')) {
                _$block.find('.header-cities-item.clicked').removeClass('clicked')
                    .find('.header-cities-item-box').hide();
                $city
                    .find('.header-cities-item-box').fadeIn(300).end()
                    .addClass('clicked')
                ;
            }
        });
    };

};

//RimMebel.prototype.CitySwitcher.init = function($block) {
//    var citySwitcher = new R.CitySwitcher();
//    citySwitcher.setBlock($block);
//    citySwitcher.bindSwitch();
//    return citySwitcher;
//};