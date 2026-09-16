(function () {
    var lists = [];
    var rmSelect = function ($div, changeCallBack) {

        var opened = false;
        var bodyBinded = false;
        var $input;

        this._bindBody = function () {
            if (!bodyBinded) {
                bodyBinded = true;
                $('body').bind('click', function () {
                    if (this.isOpen()) {
                        this.close();
                    }
                }.of(this));
            }
        };

        this._bindOpen = function () {
            $div.find(".rm-select-link, .rm-select-marker").bind('click', function () {
                if (this.isOpen()) {
                    this.close();
                } else {
                    this.open();
                }
                return false;
            }.of(this));
        };

        this._unbindOpen = function () {
            $div.children(".rm-select-link, .rm-select-marker").unbind('click');
        };

        this._bindSelectItem = function () {
            $div.find('li').bind('click', function (e) {
                this.select($(e.currentTarget));
                return false;
            }.of(this)).last().addClass('last');
        };

        this._unbindSelectItem = function () {
            $div.find('li').unbind('click');
        };

        this._bind = function () {
            this._bindOpen();
            this._bindSelectItem();
            this._bindBody();
            this._findInput();
        };

        this._unbind = function () {
            this._unbindOpen();
            this._unbindSelectItem();
        };

        this._findInput = function () {
            $input = $div.find('input[type="hidden"]');
        };

        this.isOpen = function () {
            return opened;
        };

        /**
         * @return jQuery
         */
        this._getList = function () {
            return $div.children('ul');
        };

        this.open = function () {
            $.each(lists, function (i, o) {
                if (o.isOpen()) {
                    o.close();
                }
            });
            this._getList().show().closest('.rm-select').addClass('opened');
            opened = true;
        };

        this.refresh = function () {
            this._unbindOpen();
            this._bindOpen();
            this._unbindSelectItem();
            this._bindSelectItem();
        };

        this.updateInput = function ($a) {
            if ($input[0] !== undefined) {
                $input.val($a.attr('data-val'));
            }
        };

        this.select = function ($li, option) {
            option = $.extend({
                silent: false
            }, option);
            this._unbind();
            var $a = $li.children('span').clone();
            $a.addClass('rm-select-link display-link');
            $a.setTo($div.children('.rm-select-link'));
            this._bind();
            this.close();
            this.updateInput($a);
            if (changeCallBack !== undefined && !option.silent) {
                changeCallBack($a);
            }
            return true;
        };

        this.close = function () {
            this._getList().hide().closest('.rm-select').removeClass('opened');
            opened = false;
        };

        this._bind();
        lists.push(this);
    };

    jQuery.fn.rmSelect = function (callback) {
        var $e = $(this);
        if ($e.data('rmSelect') === undefined) {
            var select;
            if ($e.length > 1) {
                select = [];
                $.each($e, function (i, g) {
                    select.push(new rmSelect($(g), callback));
                }.of(this));
            } else {
                select = new rmSelect($(this), callback);
            }
            $e.data('rmSelect', select);
        }
        return $e.data('rmSelect');
    };

})();