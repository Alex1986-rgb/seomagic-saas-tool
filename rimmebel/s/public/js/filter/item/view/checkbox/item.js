RimMebel.prototype.FilterViewCheckbox = RimMebel.prototype.FilterViewAbstract.extend({

    tagName : 'li',
    className : 'dd-choose-item-unit-box',

    events : {
        'click' : 'mark'
    },

    initialize : function() {
        this.model.on('reset', this.reset, this);
        this.model.on('clearView', this.clearView, this);
    },

    template : function() {
        var $template = $('#checkbox-item-template');
        if ($template[0] !== undefined) {
            return _.template($template.html());
        } else {
            return '';
        }
    }(),

    getHTML : function() {
        return this.template(this.model.toJSON());
    },

    reset : function() {
        var count = this.model.get('count');
        this.$el
            .find('input').prop('checked', this.model.get('chosen')).end()
            .find('.dd-choose-item-count span').text(count)
        ;
        if (count == 0) {
            this.$el.addClass('hide');
        } else {
            this.$el.removeClass('hide');
        }
    },

    render : function() {
        this.$el.html(this.getHTML());
        this.delegateEvents(this.events);
        return this;
    },

    mark : function() {
        this.model.mark(this.$el.find('input').is(':checked'));
    }

});