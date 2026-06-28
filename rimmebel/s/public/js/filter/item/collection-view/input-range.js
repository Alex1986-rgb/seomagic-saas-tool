RimMebel.prototype.FilterViewInputRangeGroup = RimMebel.prototype.FilterViewOpenable.extend({

    _rangeItems : [],

    events : function() {
        return _.extend({}, R.FilterViewOpenable.prototype.events, {
            'click .main-btn' : 'confirm',
            'click .cancel-link' : 'clear'
        });
    },

    addRangeItem : function(rangeItem) {
        this._rangeItems.push(rangeItem);
    },

    confirm : function() {
        _.each(this._rangeItems, function(rangeItem) {
            rangeItem.confirm();
        });
        RimMebel.prototype.FilterViewInputRangeGroup.__super__.close.apply(this, arguments);
    },

    clear : function() {
        _.each(this._rangeItems, function(rangeItem) {
            rangeItem.clear();
        });
        RimMebel.prototype.FilterViewInputRangeGroup.__super__.close.apply(this, arguments);
    },

    close : function() {
        _.each(this._rangeItems, function(rangeItem) {
            rangeItem.reset();
        });
        RimMebel.prototype.FilterViewInputRangeGroup.__super__.close.apply(this, arguments);
    }

}, {

    init : function(options, chosenCollection, itemCollection) {
        var rangeGroup = new R.FilterViewInputRangeGroup(options);
        rangeGroup.$el.find('.dd-size-item').each(function() {
            var $this = $(this);
            var model = new R.FilterModelRangeItem({
                id : $this.data('desc'),
                description : $this.data('desc'),
                name : $this.find('.dd-size-item-text').text()
            });
            rangeGroup.addRangeItem(new R.FilterViewInputRange({
                model : model,
                el : $this
            }));
            chosenCollection.add(model);
            itemCollection.add(model);
        });
        return rangeGroup;
    }

});