RimMebel.prototype.FilterItemCollection = Backbone.Collection.extend({

    model : R.FilterModelAbstract,

    setAjaxData : function(ajaxData) {
        this.each(function(filterItem) {
            filterItem.setAjaxData(ajaxData);
        });
    },

    setFilterValues : function(itemValues) {
        this.each(function(filterItem) {
            filterItem.setValue(itemValues[filterItem.get('description')]);
        });
    },

    getParams : function() {
        var params = {};
        this.each(function(filterItem) {
            if (!_.isEqual(filterItem.get('value'), filterItem.get('defaultValue'))) {
                
                params[filterItem.get('description')] = filterItem.getValue();
            }
        });
        return params;
    },
    
    getParamsNames : function() {
        var params = {};
        this.each(function(filterItem) {
//            alert(JSON.stringify(filterItem));
//            alert(JSON.stringify(filterItem.getValue()));
//            alert(JSON.stringify(filterItem.get('name')));
            
            if (!_.isEqual(filterItem.get('value'), filterItem.get('defaultValue'))) {      
                if((typeof filterItem.get('name') != 'undefined')&&(filterItem.get('name')!='')){
                    params[filterItem.get('description')] = filterItem.get('name');
                }
            }
        });
        return params;
    },

    getParamsForAjax : function() {
        var params = {};
        this.each(function(filterItem) {
            if (!_.isEqual(filterItem.get('value'), filterItem.get('defaultValue'))) {
                params[filterItem.get('description')] = filterItem.getValueForAjax();
            }
        });
        return params;
    },

    getParamsAsUrl : function(params) {
        var prefix = '';
        var url = [];
        $.each(params, function(desc, param) {
            if (desc == 'category') {
                prefix = '/' + param;
            } else if (param && desc) {
                url.push(desc + '=' + param);
            }
        });
        if (url.length == 0) {
            return prefix;
        }
        return prefix + '?' + url.join('&');
    },
    
    getParamsAsTitle : function(params) {
        var title = [];
        $.each(params, function(desc, param) {
            var str = String(param).split(',');       
            var i;
            for (i= 0; i < str.length; ++i) {
                if((str[i] != '')&&(str[i] != 0)) {
                    title.push(str[i]);
                }
            }
        });
        if (title.length == 0) {
            return '';
        }
        return  title.join(' | ');
    },
    
    getParamsAsMetaDescription : function(params) {
        var meta = [];
        $.each(params, function(desc, param) {
            var str = String(param).split(',');       
            var i;
            for (i= 0; i < str.length; ++i) {
                if((str[i] != '')&&(str[i] != 0)) {
                    meta.push(str[i]);
                }
            }
        });
        if (meta.length == 0) {
            return '';
        }
        return  meta.join(',');
    }

}, {

    chosenData : [],

    initFilterItems : function(chosenData, factoriesUrl, collectionOptions) {
        this.chosenData = chosenData;
        this.initCollections(collectionOptions);
        this.initBaseFilters();
        this.initFilters(factoriesUrl);
        this.initChosenView();
        return this.itemCollection;
    },

    initCollections : function(collectionOptions) {
        this.itemCollection = this.initCollection(collectionOptions);
        this.filterItems = new R.FilterViewItems({
            el : $(document)
        });
        this.chosenCollection = new R.FilterItemChosenCollection();
    },

    initBaseFilters : function() {
        this.initPaginator();
    },

    initFilters : function(factoriesUrl) {
        this.initCategory();
        this.initFactory(factoriesUrl);
        this.initType();
        this.initStyle();
        this.initSeries();
        this.initMaterial();
        this.initFormType();
        this.initPrice();
        this.initSize();
        this.initOnPage();
    },

    initChosenView : function() {
        var filterChosenItems = new R.FilterViewChosenCollection({
            collection : this.chosenCollection,
            el : $('#filter-chosen-items-block')
        });
        filterChosenItems.render();
    },

    initPaginator : function() {
        var paginatorModel = new R.FilterModelPaginator();
        this.filterItems.add(new R.FilterViewPaginator({
            model : paginatorModel,
            el : $('#paginator')
        }));
        this.itemCollection.add(paginatorModel);
    },

    initCategory : function() {
        var categoryModel = new R.FilterModelCategoryList({
            description : 'category',
            defaultText : 'Категория'
        });
        this.filterItems.add(R.FilterViewCategoryList.init({
            model : categoryModel,
            el : $('#category-filter'),
            $title : $('#filter-title')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(categoryModel);
    },

    initFactory : function(factoriesUrl) {
        var factoryModel = new R.FilterModelGroupLetter({
            description : 'factories',
            letterUrl : factoriesUrl,
            lettersIndex : 'factoryLettersData'
        });
        this.filterItems.add(R.FilterViewGroupLetter.init({
            model : factoryModel,
            el : $('#factory-filter')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(factoryModel);
    },

    initType : function() {
        var typeModel = new R.FilterModelOptionGroupItem({
            description : 'types'
        });
        this.filterItems.add(R.FilterViewCheckboxGroup.init({
            model : typeModel,
            el : $('#type-filter')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(typeModel);
    },

    initStyle : function() {
        var styleModel = new R.FilterModelOptionGroupItem({
            description : 'styles'
        });
        this.filterItems.add(R.FilterViewCheckboxGroup.init({
            model : styleModel,
            el : $('#style-filter')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(styleModel);
    },

    initSeries : function() {
        var seriesModel = new R.FilterModelGroupLetter({
            description : 'series',
            letterUrl : '/api/series',
            lettersIndex : 'seriesLettersData'
        });
        this.filterItems.add(R.FilterViewGroupLetter.init({
            model : seriesModel,
            el : $('#series-filter')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(seriesModel);
    },

    initMaterial : function() {
        var materialModel = new R.FilterModelOptionGroupItem({
            description : 'materials'
        });
        this.filterItems.add(R.FilterViewCheckboxGroup.init({
            model : materialModel,
            el : $('#material-filter')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(materialModel);
    },

    initFormType : function() {
        var formTypeModel = new R.FilterModelListGroupItem({
            description : 'form',
            defaultText : 'Тип формы'
        });
        this.filterItems.add(R.FilterViewListItemGroup.init({
            model : formTypeModel,
            el : $('#form-type-filter')
        }, this.chosenCollection, this.chosenData));
        this.itemCollection.add(formTypeModel);
    },

    initOnPage : function() {
        var onPageModel = new R.FilterModelOnPage();
        this.filterItems.add(new R.FilterViewOnPage({
            model : onPageModel,
            el : $('#on-page-filter')
        }));
        this.itemCollection.add(onPageModel);
    },

    initPrice : function() {
        var $priceFilter = $('#price-filter');
        if ($priceFilter.length > 0) {
            var priceModel = new R.FilterModelRangeItem({
                description : 'prices',
                name : 'Цена'
            });
            var price = new R.FilterViewInputRange({
                model : priceModel,
                el : $('#price-range-filter')
            });
            this.filterItems.add(new R.FilterViewPriceInputRange({
                price : price,
                el : $priceFilter
            }));
            this.chosenCollection.add(priceModel);
            this.itemCollection.add(priceModel);
        }
    },

    initSize : function() {
        this.filterItems.add(R.FilterViewInputRangeGroup.init({
            el : $('#size-filter')
        }, this.chosenCollection, this.itemCollection));
    },

    initCollection : function(collectionOptions) {
        return new R.FilterItemCollection();
    }

});