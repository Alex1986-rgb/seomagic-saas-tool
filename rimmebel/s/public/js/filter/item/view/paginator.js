RimMebel.prototype.FilterViewPaginator = RimMebel.prototype.FilterViewAbstract.extend({

    events : {
        'click [data-page]' : 'changePage'
    },

    initialize : function() {
        this.initValue(this.$el.find('.current').data('page'));
        this.model.on('updateView', this.updatePaginator, this);
        this.model.on('change:value', this.updateCurrent, this);
    },

    changePage : function(e) {
        this.model.set('value', $(e.currentTarget).data('page'));
        this.model.triggerChange();
        // hide seo text
        if ($(e.currentTarget).data('page') == 1)
            $(".seo-text-box").show();
        else
            $(".seo-text-box").hide();
    },

    updateCurrent : function() {
        this.$el.find('.current').removeClass('current');
        this.$el.find('[data-page=' + this.model.get('value') + ']').addClass('current');
    },

    updatePaginator : function() {
        var data = this.model.get('paginationData');
        if (data != undefined) {
            if (data.pageCount < 2) {
                this.$el.addClass('hide');
            } else {
                var html = [];
                html.push(this._setPreDots(data));
                html.push(this._setPages(data));
                html.push(this._setPostDots(data));
                this.$el
                    .removeClass('hide')
                    .html(html.join(''));
            }
        }
    },

    _setPages : function(data) {
        var html = [], self = this;
        $.each(data.pagesInRange, function(i, page) {
            var $page = $(self._getPageHtml(page));
            if (data.current === page) {
                $page.addClass('current');
            }
            html.push($page.prop('outerHTML'));
        });
        return html.join('');
    },

    _setPreDots : function(data) {
        var html = [], self = this;
        if (data.firstPageInRange > data.first) {
            html.push(self._getPageHtml(data.first));
            if (data.firstPageInRange > data.first + 1) {
                html.push('<span class="pagination-item unstyled"><span>...</span></span>');
            }
        }
        return html.join('');
    },

    _setPostDots : function(data) {
        var html = [], self = this;
        if (data.lastPageInRange < data.last) {
            if (data.lastPageInRange < data.last - 1) {
                html.push('<span class="pagination-item unstyled"><span>...</span></span>');
            }
            html.push(self._getPageHtml(data.last));
        }
        return html.join('');
    },

    _getPageHtml : function(page) {
        return [
            '<a data-page="', page, '" class="pagination-item" href="javascript:void(0);">',
                '<span>', page, '</span>',
            '</a>'
        ].join('')
    }

});
