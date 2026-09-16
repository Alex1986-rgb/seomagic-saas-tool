RimMebel.prototype.ItemView = Backbone.View.extend({

    tagName : 'div',
    className : 'goods-preview',

    template : function(){
        var $el = $('#item-preview-template');
        if ($el[0] !== undefined) {
            return _.template($el.html());
        } else {
            return '';
        }
    }(),

    initialize : function() {

    },

    getHTML : function() {
        return this.template(this.model.toJSON());
    },

    render : function() {
        this.$el.html(this.getHTML());
        if (this.model.get('isLast')) {
            this.$el.addClass('last');
        }
        this.delegateEvents(this.events);
        return this;
    }

});