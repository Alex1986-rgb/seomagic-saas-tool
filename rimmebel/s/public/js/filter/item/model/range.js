RimMebel.prototype.FilterModelRangeItem = RimMebel.prototype.FilterModelOption.extend({

    setRange : function(range) {
        if (!_.isEqual(range, this.get('value'))) {
            this.set({
                value : range,
                chosen : true
            });
            this.triggerChoose();
            this.triggerChange();
        }
    },

    getValue : function() {
        if (this.get('value') != undefined) {
            return [
                this.get('value').from,
                this.get('value').to
            ].join('–');
        }
        return undefined;
    },

    clear : function() {
        this.set({
            chosen : false,
            marked : false,
            value : undefined
        });
        this.triggerChange();
        this.triggerChoose();
        this.trigger('reset');
    },

    getShowedValue : function() {
        var value = this.get('value');
        var showedValueParts = [this.get('name'), ':'];
        if (value.from) {
            showedValueParts.push(' от ' + value.from);
        }
        if (value.to) {
            showedValueParts.push(' до ' + value.to);
        }
        return showedValueParts.join('');
    },

    cancel : function() {
        this.set('marked', false);
        this.trigger('reset');
    }

});