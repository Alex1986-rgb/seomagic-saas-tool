RimMebel.prototype.FilterViewOpenable = RimMebel.prototype.FilterViewAbstract.extend({

    events : {
        'click .dd-choose-item-btn' : 'toggle',
        'click' : 'stopPropagation'
    },

    toggle : function() {
        if (this.$el.hasClass('open')) {
            this.close.apply(this, arguments);
        } else {
            this.open.apply(this, arguments);
        }
    },

    open : function() {
        this.$el.addClass('open').find('.rm-dd-item-box').show();
        var holderWidth = $('.items-holder').width();
        var $elDD = $(this.$el).find('.rm-dd-item-box');
        var leftPosition = $(this.$el).position().left;
        var ddWidth = $elDD.outerWidth();
        var totalWidth = leftPosition + ddWidth;
        if ( leftPosition + ddWidth > holderWidth ) {
            $elDD.addClass('positioned').css({
                'left' : holderWidth - totalWidth
            });
        }
        this.trigger('open', this);
    },

    close : function() {
        this.$el.removeClass('open').find('.rm-dd-item-box').hide();
        this.trigger('close', this);
    },

    stopPropagation : function(e) {
        e.stopPropagation();
    }

});