RimMebel.prototype.ItemSearch = function() {

    var self = this;

    var _$form, _$submit;
    var _searchUrl, _validator;

    var idQuery = 'searchQuery';

    this.setForm = function($form) {
        _$form = $form;
    };

    this.getForm = function() {
        return _$form;
    };

    this.setSubmitButton = function($button) {
        _$submit = $button;
    };

    this.setSearchUrl = function(searchUrl) {
        _searchUrl = searchUrl;
    };

    this.bindSubmit = function() {
        _$submit.click(function() {
            _$form.submit();
        });
    };

    this.bindValidate = function() {
        var validate = R.getBaseValidate();
        validate.submitHandler = function() {
            self._searchItems();
            return false;
        };
        R.validate(validate)
            .setSearchValidation(idQuery);
        _validator = this.getForm().validate(validate);
    };

    this._searchItems = function() {
        window.location.href = _searchUrl + '?q=' + encodeURIComponent($('#' + idQuery).val());
    }

};

RimMebel.prototype.ItemSearch.init = function($form, $submit, searchUrl) {
    var itemSearch = new R.ItemSearch();
    itemSearch.setSearchUrl(searchUrl);
    itemSearch.setForm($form);
    itemSearch.setSubmitButton($submit);
    itemSearch.bindValidate();
    itemSearch.bindSubmit();
    return itemSearch;
};