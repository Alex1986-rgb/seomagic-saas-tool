RimMebel.prototype.FilterModelOptionGroupItem = RimMebel.prototype.FilterModelGroupItem.extend({

    defaults : {
        options : undefined,
        defaultValue : undefined
    },

    setOptions : function(options) {
        this.set('options', options);
        options.on('change:chosen', function() {
            this.collectValues();
            this.triggerChange();
        }, this);
    },

    collectValues : function() {
        this.set('value', this.get('options').getValues().join(','));
        this.set('name', this.get('options').getNames().join(','));
    },

    getUniqueField : function() {
        return 'idItem';
    },

    getModelClassName : function() {
        return 'FilterModelOption';
    },

    getList : function() {
        return this.get('options');
    }

});