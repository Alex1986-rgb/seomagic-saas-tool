RimMebel.prototype.FilterContainer = Backbone.View.extend({

    renderItems : function(items) {
        var itemModel, itemView, isLast;
        this.clear();
        for (var i = 0, totalCount = items.length; i < totalCount; i++) {
            isLast = i % 3 == 2;
            itemModel = new R.ItemModel(items[i]);
            itemModel.set('isLast', isLast);
            itemView = new R.ItemView({
                model : itemModel
            });
            itemView.render();
            this.$el.append(itemView.$el);
            if (isLast) {
                this.$el.append('<div class="clear"></div>');
            }
        }
        this.$el.append(this.getOverlay());
    },

    clear : function() {
        this.$el.html('');
    },

    loadStart : function() {
        this.$el.parent().removeClass('not-loading');
    },

    loadFinish : function() {
        this.$el.parent().addClass('not-loading');
        $('.seo-box').hide();
    },

    getOverlay : function() {
        var $overlay;
        return function() {
            if ($overlay == undefined) {
                $overlay = $('<div class="filter-overlay"></div>');
            }
            return $overlay;
        }
    }()

});