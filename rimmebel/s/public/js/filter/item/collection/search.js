RimMebel.prototype.FilterItemSearchCollection = RimMebel.prototype.FilterItemCollection.extend({

    _query : '',

    setQuery : function(query) {
        this._query = query;
    },

    getParams : function() {
        var params = RimMebel.prototype.FilterItemSearchCollection.__super__.getParams.apply(this, arguments);
        params['q'] = this._query;
        return params;
    },

    getParamsForAjax : function() {
        var params = RimMebel.prototype.FilterItemSearchCollection.__super__.getParamsForAjax.apply(this, arguments);
        params['q'] = this._query;
        return params;
    },

    getParamsAsUrl : function(params) {
        var prefix = '';
        var url = [];
        $.each(params, function(desc, param) {
            if (param && desc) {
                url.push(desc + '=' + param);
            }
        });
        if (url.length == 0) {
            return prefix;
        }
        return prefix + '?' + url.join('&');
    }

}, {

    initFilters : function() {
        //empty
    },

    initCollection : function(collectionOptions) {
        var collection = new R.FilterItemSearchCollection();
        collection.setQuery(collectionOptions.query);
        return collection;
    }

});