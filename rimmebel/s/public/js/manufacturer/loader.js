RimMebel.prototype.ManufacturerLoader = function() {

    var self = this;

    var _$button;
    var _ajaxUrl;

    this.setButton = function($button) {
        _$button = $button;
    };

    this.setAjaxUrl = function(ajaxUrl) {
        _ajaxUrl = ajaxUrl;
    };

    this.initLoading = function() {
        _$button.click(function() {
            self._loadManufacturerHTML();
        });
    };

    this._loadManufacturerHTML = function() {
        $.ajax({
            type : 'post',
            url : _ajaxUrl,
            data : {
                lastLetter : $('.factory-list-category-name').last().text()
            },
            dataType : 'json',
            success : function(data) {
                if (data.html) {
                    self._appendManufacturerHTML(data.html);
                }
                if (data.isLast) {
                    _$button.closest('.factory-btn-box').hide();
                }
            }
        });
    };

    this._appendManufacturerHTML = function(html) {
        $(html).insertAfter($('.factory-list').last());
    };

};

RimMebel.prototype.ManufacturerLoader.init = function($button, ajaxUrl) {
    var manufacturerLoader = new R.ManufacturerLoader();
    manufacturerLoader.setButton($button);
    manufacturerLoader.setAjaxUrl(ajaxUrl);
    manufacturerLoader.initLoading();
    return manufacturerLoader;
};