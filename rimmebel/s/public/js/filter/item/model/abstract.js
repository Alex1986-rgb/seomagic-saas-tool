RimMebel.prototype.FilterModelAbstract = Backbone.Model.extend({

    defaults : {
        description : '',
        name : '',
        value : undefined,
        defaultValue : undefined,
        count : 0
    },

    setAjaxData : function(data) {
        if (data[this.get('description')]) {
            var countData = data[this.get('description')];
            this.setCountData(countData);
        }
    },

    setValue : function(data) {
        var value = (data == undefined) ? this.get('defaultValue') : data;
        this.set('value', value);
        this.trigger('updateView');
    },

    setCountData : function(countData) {

    },

    getValue : function() {
        return this.get('value');
    },
    
    getName : function() {
        return this.get('name');
    },

    getValueForAjax : function() {
        return this.getValue();
    },

    reset : function() {
        this.set('value', this.get('defaultValue'));
        this.set('name', '');
    },

    triggerChange : function() {
        this.trigger('filter');
    }

});