RimMebel.prototype.CityAutocomplete = function() {

    var self = this;
    var _source, _$cityInput, _$chosenCityInput;

    this.setSource = function(source) {
        _source = source;
    };

    this.setCityInputs = function($cityInput, $chosenCityInput) {
        _$cityInput = $cityInput;
        _$chosenCityInput = $chosenCityInput;
    };

    this.initAutocomplete = function() {
        _$cityInput.autocomplete({
            source : _source,
            select : function(event, ui) {
                _$cityInput.val(ui.item.label);
                self._chooseCity();
                return false;
            },
            focus : function(event, ui) {
                this.value = ui.item.label;
                event.preventDefault();
            },
            change : function() {
                self._chooseCity();
            }
        });
    };

    this._chooseCity = function() {
        var chosenCity = _.find(_source, function(sourceData) {
            return _$cityInput.val() == sourceData.label;
        });
        _$chosenCityInput.val(chosenCity ? chosenCity.value : 0)
    }

};

RimMebel.prototype.CityAutocomplete.init = function($cityInput, $chosenCityInput, source) {
    var cityAutocomplete = new R.CityAutocomplete();
    cityAutocomplete.setSource(source);
    cityAutocomplete.setCityInputs($cityInput, $chosenCityInput);
    cityAutocomplete.initAutocomplete();
    return cityAutocomplete;
};