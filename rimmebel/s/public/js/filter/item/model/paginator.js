RimMebel.prototype.FilterModelPaginator = RimMebel.prototype.FilterModelAbstract.extend({

    defaults : {
        description : 'page',
        defaultValue : 1,
        paginationData : undefined
    },

    setAjaxData : function(data) {
        this.set('paginationData', data.paginator, {silent : true});
        this.trigger('updateView');
    }

});