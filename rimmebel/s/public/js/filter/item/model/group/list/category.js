RimMebel.prototype.FilterModelCategoryList = RimMebel.prototype.FilterModelListGroupItem.extend({

    setAjaxData : function(data) {
        this.set('totalCount', data['allCategoriesCount']);
        RimMebel.prototype.FilterModelCategoryList.__super__.setAjaxData.apply(this, arguments);
    },

    clearChosen : function() {
        var chosen = this.get('listItems').getChosen();
        if (chosen) {
            chosen.clear();
        }
    }

});