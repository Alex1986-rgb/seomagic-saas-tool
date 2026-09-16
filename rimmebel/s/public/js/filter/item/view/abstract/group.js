RimMebel.prototype.FilterViewItemGroup = RimMebel.prototype.FilterViewOpenable.extend({

    initialize : function() {
        this.model.on('render', this.render, this);
    },

    render : function() {
        var self = this;
        var $group = this.$el.find('ul:not(.letter-choose-list)');
        $group.empty();
        var i = 0;
        this.model.getList().each(function(model) {
            model.trigger('clearView');
            if (model.get('count') > 0) {
                var view = new R[self.getViewClassName()]({
                    model : model
                });
                $group.append(view.render().$el);
                if (++i % 2 == 0) {
                    $group.append('<li class="clear"></li>');
                }
            }
        });
    },

    getViewClassName : function() {

    }

});