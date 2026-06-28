RimMebel.prototype.FilterItemChosenCollection = Backbone.Collection.extend({

    model : R.FilterModelOption,

    hasChosen : function() {
        var item = this.find(function(model) {
            return model.get('chosen');
        });
        return item != undefined;
    },

    clearAll : function() {
        this.each(function(model) {
            model.clear();
        });
    }

});