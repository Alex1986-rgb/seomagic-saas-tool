RimMebel.prototype.FilterViewPriceInputRange = RimMebel.prototype.FilterViewOpenable.extend({

    events : function() {
        return _.extend({}, R.FilterViewOpenable.prototype.events, {
            'click .main-btn' : 'confirm'
        });
    },

    confirm : function() {
        this.options.price.confirm();
        RimMebel.prototype.FilterViewInputRangeGroup.__super__.close.apply(this, arguments);
    },

    close : function() {
        this.options.price.reset();
        RimMebel.prototype.FilterViewInputRangeGroup.__super__.close.apply(this, arguments);
    }

});