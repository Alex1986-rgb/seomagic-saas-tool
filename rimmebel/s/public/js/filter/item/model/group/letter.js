RimMebel.prototype.FilterModelGroupLetter = RimMebel.prototype.FilterModelOptionGroupItem.extend({

    setNewLetter : function(newLetter) {
        if (newLetter != this.get('letter')) {
            this.set('letter', newLetter);
        }
    },

    setAjaxData : function(data) {
        var lettersData = data[this.get('lettersIndex')];
        this.set('letters', lettersData['letters']);
        this.setNewLetter(lettersData['currentLetter']);
        RimMebel.prototype.FilterModelGroupLetter.__super__.setAjaxData.apply(this, arguments);
    },

    loadGroupLetterData : function() {
        var self = this;
        var params = this.collection.getParamsForAjax();
        params['letter'] = this.get('letter');
        $.ajax({
            type : 'post',
            url : this.get('letterUrl'),
            data : params,
            dataType : 'json',
            success : function(data) {
                self.set('letters', data[self.get('lettersIndex')]);
                self.setCountData(data[self.get('description')]);
            }
        });
    }

});