RimMebel.prototype.FilterViewItems = Backbone.View.extend({

    filterItems : [],
    opened : {},

    initialize : function() {
        var self = this;
        this.$el.click(function() {
            self.closeOpened();
        });
    },

    add : function(item) {
        if (item instanceof RimMebel.prototype.FilterViewOpenable) {
            this.filterItems.push(item);
            item.on('open', function(item) {
                this.closeOpened();
                this.addToOpened(item);
            }, this);
            item.on('close', this.removeFromOpened, this);
        }
    },

    closeOpened : function() {
        _.each(this.opened, function(item) {
            item.close();
        });
    },

    addToOpened : function(item) {
        this.opened[ item.cid ] = item;
    },

    removeFromOpened : function(item) {
        delete this.opened[ item.cid ];
    }

});