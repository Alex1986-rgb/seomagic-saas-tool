RimMebel.prototype.FilterViewList = RimMebel.prototype.FilterViewAbstract.extend({

    tagName : 'li',
    className : 'dd-choose-item-unit-box',

    events : {
        'click' : 'choose'
    },

    initialize : function() {
        this.model.on('change:chosen', this.reset, this);
        this.model.on('clearView', this.clearView, this);
    },

    template : function() {
        var $template = $('#list-item-template');
        if ($template[0] !== undefined) {
            return _.template($template.html());
        } else {
            return '';
        }
    }(),

    getHTML : function() {
        return this.template(this.model.toJSON());
    },

    choose : function() {
        this.model.chooseItem();
    },

    reset : function() {
        if (this.model.get('chosen')) {
            this.$el.addClass('current');
        } else {
            this.$el.removeClass('current');
        }
    },

    render : function() {
        this.$el.html(this.getHTML());
        this.delegateEvents(this.events);
        this.reset();
        return this;
    }

});