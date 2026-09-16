RimMebel.prototype.Filter = Backbone.View.extend({

    _container : undefined,
    _filterItems : undefined,

    _params : [],
    _paramsname : [],

    _baseUrl : '',
    _ajaxUrl : '',
    _timeout : 0,

    setContainer : function(container) {
        if (container instanceof R.FilterContainer) {
            this._container = container;
        }
    },

    setBaseUrl : function(baseUrl) {
        this._baseUrl = baseUrl;
    },

    setAjaxUrl : function(ajaxUrl) {
        this._ajaxUrl = ajaxUrl;
    },

    setFilterItems : function(filterItems) {
        if (filterItems instanceof R.FilterItemCollection) {
            this._filterItems = filterItems;
        }
    },

    bindListeners : function() {
        var self = this;
        this._filterItems.on('filter', function() {
            self._updateParams();
            self._updateUrlState();
            self._updateTitle();
            self._updateMetaDescription();
            self._updateView();
        });
    },

    historyListener : function() {
        var self = this;
        $(window).bind("popstate", function(evt) {
            var state = evt.originalEvent.state;
            if (state && state.module === R.Filter.MODULE_NAME) {
                self._params = state.params;
                self._filterItems.setFilterValues(self._params);
                self._updateTitle();
                self._updateMetaDescription();
                self._updateView();
            }
        });
    },

    _updateParams : function() {
        this._params = this._filterItems.getParams();
        this._paramsname = this._filterItems.getParamsNames();
    },

    _updateView : function() {
        var self = this;
        clearTimeout(this._timeout);
        this._container.loadStart();
        this._timeout = setTimeout(function() {
            $.ajax({
                type : 'post',
                url : self._ajaxUrl,
                data : self._filterItems.getParamsForAjax(),
                dataType : 'json',
                success : function(data) {
                    self._container.renderItems(data.items);
                    self._filterItems.setAjaxData(data);
                    self._container.loadFinish();
                    self._scrollTop();
                }
            });
        }, 500);
    },

    _scrollTop : function() {
        $('html, body').animate({
            scrollTop : 310
        }, 300);
    },

    _updateUrlState : function() {
        if (history.pushState !== undefined) {
            var params = {
                params : this._params,
                module : R.Filter.MODULE_NAME
            };
            history.pushState(
                params,
                document.title,
                this._baseUrl + this._filterItems.getParamsAsUrl(this._params)
            );
        }
    },
    
    _updateTitle : function() {
        $(document).prop('title', 
            this._filterItems.getParamsAsTitle(this._paramsname) 
            + ' | Салон итальянской мебели «Старый Рим»');
    },
    
    _updateMetaDescription : function() {
        $('meta[name=description]')
            .attr('content'
            , 'Каталог итальянской мебели салона «Старый Рим». Поиск по параметрам: ' 
            + this._filterItems.getParamsAsMetaDescription(this._paramsname));        
    }

});

RimMebel.prototype.Filter.MODULE_NAME = 'itemsFilter';

RimMebel.prototype.Filter.initFilters = function(baseUrl, ajaxUrl, factoriesUrl, chosenData, query) {
    var filter = new R.Filter();
    filter.setBaseUrl(baseUrl);
    filter.setAjaxUrl(ajaxUrl);
    filter.setContainer(new R.FilterContainer({
        el : $('#itemsContainer')
    }));
    var collectionClass = query == '' ? 'FilterItemCollection' : 'FilterItemSearchCollection';
    filter.setFilterItems(R[collectionClass].initFilterItems(chosenData, factoriesUrl, {
        query : query
    }));
    filter._updateParams();
    filter._updateUrlState();
    filter._updateTitle();
    filter._updateMetaDescription();
    filter._updateView();
    filter.bindListeners();
    filter.historyListener();
};