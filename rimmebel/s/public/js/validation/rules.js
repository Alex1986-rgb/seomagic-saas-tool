(function() {

    var Validate = function(validate) {

        var _userAjaxUrl = '/user-ajax/validation';

        var getCheckLoginUrl = function() {
            return _userAjaxUrl + '?type=checkLogin';
        };
        var getCheckEmailUrl = function() {
            return _userAjaxUrl + '?type=checkEmail';
        };
        var getCheckForgotEmailUrl = function() {
            return _userAjaxUrl + '?type=checkForgotEmail';
        };
        var getCheckLoginEmailUrl = function() {
            return _userAjaxUrl + '?type=checkLoginEmail';
        };

        var checkFields = function(field) {
            if (validate.rules === undefined) {
                validate.rules = {};
            }
            if (validate.messages === undefined) {
                validate.messages = {};
            }
            if (validate.rules[field] === undefined) {
                validate.rules[field] = {};
            }
            if (validate.messages[field] === undefined) {
                validate.messages[field] = {};
            }
        };

        var setValidation = function(field, rules, messages) {
            if (field === false) return;
            checkFields(field);
            $.each(rules, function(name, rule) {
                validate.rules[field][name] = rule;
            });
            $.each(messages, function(name, rule) {
                validate.messages[field][name] = rule;
            });
        };

        this.setNameValidation = function(field) {
            setValidation(field, {
                required : true,
                minlength : 2,
                maxlength : 150
            }, {
                required : 'Введите имя',
                minlength : 'Имя слишком короткое',
                maxlength : 'Имя слишком длинное'
            });
            return this;
        };

        this.setLastNameValidation = function(field) {
            setValidation(field, {
                required : true,
                minlength : 2,
                maxlength : 150
            }, {
                required : 'Введите фамилию',
                minlength : 'Фамилия слишком короткая',
                maxlength : 'Фамилия слишком длинная'
            });
            return this;
        };

        this.setPhoneValidation = function(field) {
            setValidation(field, {
                required : true,
                phone : true
            }, {
                required : 'Введите номер телефона',
                phone : 'Формат: +380677698453'
            });
            return this;
        };

        this.setCityValidation = function(field) {
            setValidation(field, {
                required : true,
                minlength : 2,
                maxlength : 40
            }, {
                required : 'Введите город',
                minlength : 'Название города слишком короткое',
                maxlength : 'Название города слишком длинное'
            });
            return this;
        };

        this.setEmailValidation = function(field) {
            setValidation(field, {
                required : true,
                email : true
            }, {
                required : 'Введите электронную почту',
                email : 'Введите электронную почту'
            });
            return this;
        };

        this.setEmailFreeValidation = function(field) {
            this.setEmailValidation(field);
            setValidation(field, {
                remote : getCheckEmailUrl()
            }, {
                remote : 'Электронная почта занята'
            });
            return this;
        };

        this.setEmailExistValidation = function(field) {
            this.setEmailValidation(field);
            setValidation(field, {
                remote : getCheckForgotEmailUrl()
            }, {
                remote : 'Электронный адрес не закреплен ни за одним из профилей'
            });
            return this;
        };

        this.setPasswordValidation = function(field, reField) {
            setValidation(field, {
                required : true,
                minlength : 5,
                maxlength : 40
            }, {
                required : 'Введите пароль',
                minlength : 'Слишком короткий пароль',
                maxlength : 'Слишком длинный пароль'
            });
            setValidation(reField, {
                required : true,
                equalTo : '#' + field
            }, {
                required : 'Повторите пароль',
                equalTo : 'Пароли не совпадают'
            });
            return this;
        };

        this.setNotRequiredPasswordValidation = function(field, reField) {
            setValidation(field, {
                minlength : 6,
                maxlength : 50
            }, {
                minlength : 'Слишком короткий пароль',
                maxlength : 'Слишком длинный пароль'
            });
            setValidation(reField, {
                equalTo : '#' + field
            }, {
                equalTo : 'Пароли не совпадают'
            });
            return this;
        };

        this.setTextValidation = function(field, required) {
            setValidation(field, {
                required : !!required,
                minlength : 2,
                maxlength : 5000
            }, {
                required : 'Введите текст',
                minlength : 'Текст слишком короткий',
                maxlength : 'Текст слишком длинный'
            });
            return this;
        };

        this.setTitleValidation = function(field) {
            setValidation(field, {
                required : true,
                minlength : 2,
                maxlength : 255
            }, {
                required : 'Введите название',
                minlength : 'Название слишком короткое',
                maxlength : 'Название слишком длинное'
            });
            return this;
        };

        this.setSearchValidation = function(field) {
            setValidation(field, {
                required : true,
                minlength : 2,
                maxlength : 255
            }, {
                required : 'Введите название модели',
                minlength : 'Название модели слишком короткое',
                maxlength : 'Название модели слишком длинное'
            });
            return this;
        }

    };

    RimMebel.prototype.getBaseValidate = function() {
        return  {
            errorPlacement : function(error, element) {
                var $element = $(element);
                $element.parent().children('.error-message').remove();
                $(['<span class="error-message">',
                    $(error).text(),
                    '<i class="ico error-bubble"></i>',
                '</span>'].join('')).insertAfter($element);
            },
            highlight : function(element) {
                $(element).parent().removeClass('success').addClass('error');
            },
            unhighlight : function(element, errorClass) {
                $(element).parent().removeClass('error').addClass('success');
            }
        }
    };

    RimMebel.prototype.validate = function(validate) {
        return new Validate(validate);
    };

})();