RimMebel.prototype.ItemFilterSearch = function() {

    var self = this;
    var _$element;
    var _filterUrl;

    this.setElement = function($element) {
        _$element = $element;
    };

    this.setFilterUrl = function(filterUrl) {
        _filterUrl = filterUrl;
    };

    this.bindSubmit = function($submit) {
        $submit.click(function() {
            window.location.href = _filterUrl + self._getFilterParamsAsUrl();
        });
    };

    this._getFilterParamsAsUrl = function() {
        var filterParams = this._getSelectParams();
        if (filterParams.length != 0) {
            return '?' + filterParams.join('&');
        }
        return '';
    };

    this._getSelectParams = function() {
        var selectParams = [];
        var dataId, dataDesc;
        _$element.find('.rm-select').each(function() {
            dataDesc = $(this).data('desc');
            dataId = $(this).find('.display-link').data('id');
            if (dataId && dataDesc) {
                selectParams.push(dataDesc + '=' + dataId);
            }
        });
        return selectParams;
    };

};

RimMebel.prototype.ItemFilterSearch.init = function($filterSearch, $submit, filterUrl) {
    var itemFilterSearch = new R.ItemFilterSearch();
    itemFilterSearch.setElement($filterSearch);
    itemFilterSearch.setFilterUrl(filterUrl);
    itemFilterSearch.bindSubmit($submit);
    return itemFilterSearch;
};