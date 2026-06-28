RimMebel.prototype.FilterViewInputRange = RimMebel.prototype.FilterViewAbstract.extend({

    events : {
        'click .ico-filter-del' : 'markForRemove'
    },

    _$inputs : undefined,

    initialize : function() {
        var range = this.getRange();
        if (range) {
            this.initValue(range);
            this.model.set('chosen', true);
        }
        this.model.on('reset', this.reset, this);
    },

    confirm : function() {
        var range = this.getRange();
        if (range) {
            this.model.setRange(range);
        } else {
            this.model.clear();
        }
    },

    reset : function() {
        var range = this.model.get('value');
        var $inputs = this.getInputs();
        if (range) {
            $inputs.eq(0).val(range.from || '');
            $inputs.eq(1).val(range.to || '');
        } else {
            $inputs.val('');
        }
        this.model.set('marked', false);
    },

    clear : function() {
        this.getInputs().val('');
        this.model.clear();
    },

    markForRemove : function() {
        this.getInputs().val('');
        this.model.set('marked', true);
    },

    getRange : function() {
        var $inputs = this.getInputs();
        var from = $inputs.eq(0).val() - 0;
        var to = $inputs.eq(1).val() - 0;
        if (from !== 0 || to !== 0) {
            var range = {};
            if (from !== 0) {
                range.from = from;
            }
            if (to !== 0) {
                range.to = to;
            }
            return range;
        }
        return null;
    },

    getInputs : function() {
        if (this._$inputs == undefined) {
            this._$inputs = this.$el.find('input[type="text"]');
        }
        return this._$inputs;
    }

});