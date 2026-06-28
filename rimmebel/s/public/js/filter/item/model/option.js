RimMebel.prototype.FilterModelOption = RimMebel.prototype.FilterModelAbstract.extend({

    defaults : {
        idItem : 0,
        name : '',
        chosen : false,
        marked : false
    },

    mark : function(newValue) {
        this.set('marked', newValue != this.get('chosen'));
    },

    changeMarked : function() {
        if (this.get('marked')) {
            this.set({
                chosen : !this.get('chosen'),
                marked : false
            });
            this.triggerChoose();
        }
    },

    triggerChoose : function() {
        this.trigger('choose');
    },

    clear : function() {
        this.set({
            chosen : false,
            marked : false
        });
        this.triggerChoose();
        this.trigger('reset');
    },

    getShowedValue : function() {
        return this.get('name');
    }

});