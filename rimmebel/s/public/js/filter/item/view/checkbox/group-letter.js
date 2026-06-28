RimMebel.prototype.FilterViewGroupLetter = RimMebel.prototype.FilterViewCheckboxGroup.extend({

    events : function() {
        return _.extend({}, R.FilterViewCheckboxGroup.prototype.events(), {
            'click .letter-choose-item' : 'choose'
        });
    },

    initialize : function() {
        RimMebel.prototype.FilterViewGroupLetter.__super__.initialize.apply(this, arguments);
        this.initLetters();
        this.model.on('change:letter', this.changeLetter, this);
    },

    choose : function(e) {
        this.model.setNewLetter($.trim($(e.currentTarget).text()));
    },

    initLetters : function() {
        var self = this;
        var letters = [];
        this.$el.find('.letter-choose-item').each(function(index, letterEl) {
            var $letter = $(letterEl);
            var letter = $letter.text();
            letters.push(letter);
            if ($letter.hasClass('current')) {
                self.model.set('letter', letter);
            }
        });
        this.model.set('letters', letters);
    },

    changeLetter : function(model) {
        this.$el
            .find('[data-letter="' + model.get('letter') + '"]').addClass('current').end()
            .find('.current').removeClass('current').end()
        ;
        this.model.loadGroupLetterData();
    },

    render : function() {
        var self = this;
        var $letters = this.$el.find('.letter-choose-list');
        var html = '';
        _.each(this.model.get('letters'), function(letter) {
            html += self.getLetterHML(letter);
        });
        html += '<li class="clear"></li>';
        $letters.html(html);
        RimMebel.prototype.FilterViewGroupLetter.__super__.render.apply(this, arguments);
    },

    getLetterHML : function(letter) {
        var isCurrent = this.model.get('letter') == letter;
        return [
            '<li class="letter-choose-item', isCurrent ? ' current' : '', '">',
                '<span>', letter, '</span>',
            '</li>'
        ].join('');
    }

}, {

    getClassName : function() {
        return 'FilterViewGroupLetter';
    }

});