RimMebel.prototype.RequestPopup = function() {

    var self = this;
    var _$popup, _$thxPopup, _$form, _$submit;

    var sending = false;

    var _ajaxRequestUrl, _validator, _idItem, _requestType;

    var idName = 'clientName';
    var idCity = 'clientCity';
    var idEmail = 'clientEmail';
    var idPhone = 'clientPhone';
    var idNote = 'requestNote';

    this.setPopup = function($popup) {
        $popup.find('form').sisyphus({
            locationBased : false,
            excludeFields : $('#requestNote'),
            autoRelease : false
        });
        _$popup = initNewPopup($popup);
    };

    this.setThxPopup = function($thxPopup) {
        _$thxPopup = initNewPopup($thxPopup);
    };

    this.initPopup = function($button) {
        $button.click(function() {
            _idItem = $(this).data('id');
            _$popup.show();
        });
    };

    this.setForm = function($form) {
        _$form = $form;
    };

    this.setSubmitButton = function($button) {
        _$submit = $button;
    };

    this.setAjaxUrl = function(url) {
        _ajaxRequestUrl = url;
    };

    this.setRequestType = function(type) {
        _requestType = type;
    };

    this.bindSubmit = function() {
        _$submit.click(function() {
            _$form.submit();
        });
    };

    this.bindValidate = function() {
        var validate = R.getBaseValidate();
        validate.submitHandler = function() {
            self._sendPriceRequest();
            return false;
        };
        R.validate(validate)
            .setNameValidation(idName)
            .setCityValidation(idCity)
            .setEmailValidation(idEmail)
            .setPhoneValidation(idPhone)
            .setTextValidation(idNote);
        _validator = _$form.validate(validate);
    };

    this._sendPriceRequest = function() {
        if (!sending) {
            sending = true;
            $.ajax({
                type : 'post',
                url : _ajaxRequestUrl,
                data : self._getData(),
                dataType : 'json',
                success : function(data) {
                    if (data.status) {
                        self._showThxBlock();
                    } else {
                        sending = false;
                    }
                }
            });
        }
    };

    this._showThxBlock = function() {
        _$popup.hide();
        _$thxPopup.show();
    };

    this._getItemData = function() {
        var itemData = [];
        itemData.push(_idItem);
        return itemData;
    };

    this._getData = function() {
        var data = _$form.serializeObject();
        data['requestType'] = _requestType;
        data['items'] = this._getItemData();
        data['clearFavorites'] = 0;
        return data;
    }

};

RimMebel.prototype.RequestPopup.init = function($popup, $button, $thxPopup, ajaxUrl, requestType) {
    var requestPopup = new R.RequestPopup();
    requestPopup.setPopup($popup);
    requestPopup.setThxPopup($thxPopup);
    requestPopup.initPopup($button);
    requestPopup.setForm($popup.find('form'));
    requestPopup.setSubmitButton($popup.find('input[type=submit]'));
    requestPopup.setAjaxUrl(ajaxUrl);
    requestPopup.setRequestType(requestType);
    requestPopup.bindSubmit();
    requestPopup.bindValidate();
    return requestPopup;
};