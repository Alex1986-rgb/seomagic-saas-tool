RimMebel.prototype.FilterViewChosen = RimMebel.prototype.FilterViewAbstract.extend({

    className : 'checked-item',

    events : {
        'click .ico-filter-del' : 'clear'
    },

    getHTML : function() {
        return [
            '<span class="checked-item-text">',
                this.model.getShowedValue(),
            '</span>',
            '<i class ="ico ico-filter-del"></i>'
        ].join('');
    },

    render : function() {
        this.$el.html( this.getHTML() );
        this.delegateEvents(this.events);
        return this;
    },

    clear : function() {
        this.model.clear();
    }

});