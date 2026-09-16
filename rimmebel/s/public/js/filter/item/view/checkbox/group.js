RimMebel.prototype.FilterViewCheckboxGroup = RimMebel.prototype.FilterViewItemGroup.extend({

    events : function() {
        return _.extend({}, R.FilterViewOpenable.prototype.events, {
            'click .main-btn' : 'confirm',
            'click .cancel-link' : 'clear'
        });
    },

    setOptions : function(options) {
        this.model.setOptions(options);
        options.on('add', function(model) {
            this.options.chosenCollection.add(model);
        }, this);
    },

    confirm : function() {
        this.model.get('options').confirm();
        this.close();
    },

    clear : function() {
        this.model.get('options').clear();
        this.close();
    },

    close : function() {
        RimMebel.prototype.FilterViewCheckboxGroup.__super__.close.apply(this, arguments);
        this.model.get('options').cancel();
    },

    getViewClassName : function() {
        return 'FilterViewCheckbox';
    }

}, {

    init : function(checkboxOptions, chosenCollection, chosenData) {
        var checkboxGroup = this.initCheckboxGroup(checkboxOptions, chosenCollection);
        _.each(chosenData[checkboxGroup.model.get('description')], function(data) {
            var model = new R.FilterModelOption({
                id : checkboxGroup.model.get('description') + '_' + data.id,
                idItem : data.id,
                name : data.name,
                chosen : true
            });
            checkboxGroup.model.get('options').add(model);
        });
        this.initCheckboxOptions(checkboxGroup);
        checkboxGroup.model.collectValues();
        return checkboxGroup;
    },

    initCheckboxGroup : function(checkboxOptions, chosenCollection) {
        var checkboxGroup = new R[this.getClassName()](_.extend({}, checkboxOptions, {
            chosenCollection : chosenCollection
        }));
        var options = new R.FilterItemOptionCollection();
        checkboxGroup.setOptions(options);
        return checkboxGroup;
    },

    initCheckboxOptions : function(checkboxGroup) {
        var self = this;
        checkboxGroup.$el.find('.dd-choose-item-unit-box').each(function() {
            var $el = $(this);
            var model = checkboxGroup.model.get('options').get($el.data('id'));
            if (model == undefined) {
                model = self.initOption(checkboxGroup.model.get('description'), $el);
                checkboxGroup.model.get('options').add(model);
            }
            new R.FilterViewCheckbox({
                model : model,
                el : $el
            });
        });
    },

    initOption : function(description, $el) {
        return new R.FilterModelOption({
            id : description + '_' + $el.data('id'),
            idItem : $el.data('id'),
            name : $el.find('.dd-choose-item-unit-name').text(),
            count : $el.find('.dd-choose-item-count span').text(),
            chosen : $el.find('input').is(':checked')
        });
    },

    getClassName : function() {
        return 'FilterViewCheckboxGroup';
    }

});