RimMebel.prototype.FilterViewAbstract = Backbone.View.extend({

    model : R.FilterModelAbstract,

    initValue : function(value) {
        if (this.model.getValue() == undefined) {
            this.model.set('value', value);
        }
    },

    clearView : function() {
        this.undelegateEvents();
        this.$el.removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
    }

});
