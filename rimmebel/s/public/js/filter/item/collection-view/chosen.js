RimMebel.prototype.FilterViewChosenCollection = RimMebel.prototype.FilterViewAbstract.extend({

    events : {
        'click #filterResetButton' : 'clearAll'
    },

    initialize : function() {
        this.collection.on('choose', _.debounce(this.render, 100), this);
    },

    render : function() {
        if (this.collection.hasChosen()) {
            this.$el.removeClass('hide');
        } else {
            this.$el.addClass('hide');
        }
        this.$el.find('#filter-chosen-items').html(this._getItemsHTML());
    },

    clearAll : function() {
        this.collection.clearAll();
    },

    _getItemsHTML : function() {
        var self = this;
        var $chosenItems = self.$el.find('#filter-chosen-items');
        $chosenItems.empty();
        this.collection.each(function(model) {
            if (model.get('chosen')) {
                var view = new R.FilterViewChosen({
                    model : model
                });
                $chosenItems.append(view.render().$el);
            }
        });
    }

});