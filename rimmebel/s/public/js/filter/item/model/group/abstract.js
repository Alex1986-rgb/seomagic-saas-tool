RimMebel.prototype.FilterModelGroupItem = RimMebel.prototype.FilterModelAbstract.extend({

    setCountData : function(countData) {
        var self = this;
        this.getList().each(function(model) {
            var count;
            var itemCountDataIndex = self.getItemCountDataIndex(countData, model.get(self.getUniqueField()));
            if (itemCountDataIndex !== undefined) {
                var itemCountData = countData[itemCountDataIndex];
                count = itemCountData.count;
                delete countData[itemCountDataIndex];
            } else {
                count = 0;
            }
            model.set('count', count);
        });
        _.each(countData, function(itemCountData) {
            self.initNewModel(itemCountData);
        });
        this.trigger('render');
    },

    getItemCountDataIndex : function(countData, id) {
        var self = this;
        var itemCountDataIndex;
        $.each(countData, function(index, itemCountData) {
            if (itemCountData != undefined && itemCountData[self.getUniqueField()] == id) {
                itemCountDataIndex = index;
                return false;
            }
        });
        return itemCountDataIndex;
    },

    initNewModel : function(itemCountData) {
        var modelOptions = {
            id : this.get('description') + '_' + itemCountData[this.getUniqueField()],
            name : itemCountData.name,
            count : itemCountData.count
        };
        modelOptions[this.getUniqueField()] = itemCountData[this.getUniqueField()];
        var model = new R[this.getModelClassName()](modelOptions);
        this.getList().add(model);
    },

    getModelClassName : function() {

    },

    getUniqueField : function() {

    },

    getList : function() {

    }

});