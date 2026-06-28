RimMebel.prototype.FilterModelListItem = RimMebel.prototype.FilterModelAbstract.extend({

    defaults : {
        chosen : false
    },

    chooseItem : function() {
        this.trigger('choose-item', this);
    },

    triggerChoose : function() {
        this.trigger('choose');
    },

    clear : function() {
        this.set({
            chosen : false
        });
        this.triggerChoose();
        this.trigger('reset');
    },

    getShowedValue : function() {
        return this.get('name');
    }

});