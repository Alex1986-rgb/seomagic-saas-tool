RimMebel.prototype.FilterListItemCollection = Backbone.Collection.extend({

    model : R.FilterModelListItem,

    initialize : function() {
        this.on('choose-item', this.changeChosen, this);
    },

    changeChosen : function(model) {
        var chosen = this.getChosen();
        if (chosen) {
            chosen.set('chosen', false);
        }
        model.set('chosen', true);
        model.triggerChoose();
        this.trigger('reset');
    },

    getChosen : function() {
        return this.find(function(model) {
            return model.get('chosen');
        });
    }

});