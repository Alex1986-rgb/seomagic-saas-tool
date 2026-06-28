RimMebel.prototype.FilterViewListItemGroup = RimMebel.prototype.FilterViewItemGroup.extend({

    initialize : function() {
        RimMebel.prototype.FilterViewListItemGroup.__super__.initialize.apply(this, arguments);
        this.model.on('reset', this.render, this);
        this.model.on('change', this.close, this);
    },

    setListItems : function(listItems) {
        this.model.setListItems(listItems);
        listItems.on('add', function(model) {
            this.options.chosenCollection.add(model);
        }, this);
    },

    render : function() {
        this.$el.find('.dd-choose-item-main-text').text(this.getChosenText());
        RimMebel.prototype.FilterViewListItemGroup.__super__.render.apply(this, arguments);
    },

    getChosenText : function() {
        var chosen = this.model.get('listItems').getChosen();
        if (chosen) {
            return chosen.getShowedValue();
        } else {
            return this.model.get('defaultText');
        }
    },

    getViewClassName : function() {
        return 'FilterViewList';
    }

}, {

    init : function(listItemOptions, chosenCollection, chosenData) {
        var self = this;
        var listItemGroup = new R[this.getClassName()](_.extend({}, listItemOptions, {
            chosenCollection : chosenCollection
        }));
        var listItems = new R.FilterListItemCollection();
        listItemGroup.setListItems(listItems);
        listItemGroup.$el.find('.dd-choose-item-unit-box').each(function() {
            var model = self.initListItem(listItemGroup.model.get('description'), $(this));
            listItemGroup.model.get('listItems').add(model);
        });
        this.initChosenModel(listItemGroup, chosenData);
        var chosen = listItems.getChosen();
        if (chosen) {
            listItemGroup.model.set('value', chosen.get('value'));
            listItemGroup.model.set('name', chosen.get('name'));
        }
        return listItemGroup;
    },

    initListItem : function(description, $el) {
        var model = new R.FilterModelListItem({
            id : description + '_' + $el.data('alias'),
            value : $el.data('alias'),
            name : $el.find('.dd-choose-item-unit-name').text(),
            count : $el.find('.dd-choose-item-count span').text(),
            chosen : $el.hasClass('current')
        });
        new R.FilterViewList({
            model : model,
            el : $el
        });
        return model;
    },

    initChosenModel : function(listItemGroup, chosenData) {
        var chosen = chosenData[listItemGroup.model.get('description')];
        if (chosen) {
            var model = new R.FilterModelListItem({
                id : listItemGroup.model.get('description') + '_' + chosen.alias,
                value : chosen.alias,
                name : chosen.name,
                chosen : true
            });
            listItemGroup.model.get('listItems').add(model);
        }
    },

    getClassName : function() {
        return 'FilterViewListItemGroup';
    }

});