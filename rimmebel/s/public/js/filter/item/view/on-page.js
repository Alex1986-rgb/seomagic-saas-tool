RimMebel.prototype.FilterViewOnPage = RimMebel.prototype.FilterViewAbstract.extend({

    events : {
        'click .category-filter-amount-item' : 'changeOnPage'
    },

    initialize : function() {
        this.initValue(this.$el.find('.item-per-page-btn.clicked').text() - 0);
        this.model.on('change:value', this.changeCurrent, this);
    },

    changeOnPage : function(e) {
        this.model.setNewValue($(e.currentTarget).text() - 0);
    },

    changeCurrent : function(model) {
        this.$el
            .find('.clicked').removeClass('clicked').end()
            .find('[data-page="' + model.get('value') + '"]').addClass('clicked');
    }

});