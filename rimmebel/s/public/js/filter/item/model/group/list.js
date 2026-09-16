RimMebel.prototype.FilterModelListGroupItem = RimMebel.prototype.FilterModelGroupItem.extend({

    defaults : {
        listItems : undefined,
        defaultValue : undefined
    },

    setListItems : function(listItems) {
        this.set('listItems', listItems);
        listItems.on('reset', this.changeValue, this);
    },

    changeValue : function() {
        var chosen = this.get('listItems').getChosen();
        if (chosen) {
            this.set({
                value : chosen.get('value'),
                name : chosen.get('name')
            });
        } else {
            this.reset();
        }
        this.trigger('reset');
        this.triggerChange();
    },

    getUniqueField : function() {
        return 'value';
    },

    getModelClassName : function() {
        return 'FilterModelListItem';
    },

    getList : function() {
        return this.get('listItems');
    }

});