RimMebel.prototype.FilterModelOnPage = RimMebel.prototype.FilterModelAbstract.extend({

    defaults : {
        description : 'onPage',
        defaultValue : 15
    },

    setNewValue : function(newValue) {
        if (newValue != this.get('value')) {
            this.set('value', newValue);
            this.triggerChange();
        }
    }

});