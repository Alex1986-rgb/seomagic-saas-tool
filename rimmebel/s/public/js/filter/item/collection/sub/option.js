RimMebel.prototype.FilterItemOptionCollection = Backbone.Collection.extend({

    model : R.FilterModelOption,

    confirm : function() {
        this.each(function(model) {
            model.changeMarked();
        });
    },

    cancel : function() {
        this.each(function(model) {
            model.set('marked', false);
            model.trigger('reset');
        });
    },

    clear : function() {
        this.each(function(model) {
           model.clear();
        });
    },

    getValues : function() {
        var values = [];
        this.each(function(model) {
            if (model.get('chosen')) {
                values.push(model.get('idItem'));
            }
        });
        return values;
    },
    
    getNames : function() {
        var names = [];
        this.each(function(model) {
            if (model.get('chosen')) {
                names.push(model.get('name'));
            }
        });
        return names;
    }

});