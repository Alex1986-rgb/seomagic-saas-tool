RimMebel.prototype.FilterViewCategoryList = RimMebel.prototype.FilterViewListItemGroup.extend({

    events : function() {
        return _.extend({}, RimMebel.prototype.FilterViewListItemGroup.prototype.events, {
            'click .all-items-link' : 'reset'
        });
    },

    initialize : function() {
        RimMebel.prototype.FilterViewCategoryList.__super__.initialize.apply(this, arguments);
        this.model.set('totalCount', this.$el.find('.all-items-count-text [data-count]').text());
    },

    render : function() {
        this.options.$title.text(this.getChosenText());
        var $allCategories = this.$el.find('.all-items-count-text');
        var totalCount = this.model.get('totalCount');
        $allCategories
            .find('[data-count]').text(totalCount).end()
            .find('[data-text]').text(RimMebel.Helpers.pluralize(totalCount, ['товар', 'товара', 'товаров']));
        this.$el.find('.all-items-link').toggleClass('current', !this.model.get('listItems').getChosen());
        RimMebel.prototype.FilterViewCategoryList.__super__.render.apply(this, arguments);
    },

    reset : function() {
        this.model.clearChosen();
    }

}, {

    getClassName : function() {
        return 'FilterViewCategoryList';
    }

});