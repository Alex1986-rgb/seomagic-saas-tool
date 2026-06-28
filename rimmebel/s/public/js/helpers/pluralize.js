RimMebel.Helpers.pluralize = function(count, pluralItems) {
    var index;
    if (count % 1 == 0) {
        var lastNumber = count % 10;
        var lastPairNumber = count % 100;
        if (lastNumber == 0 || (5 <= lastNumber && lastNumber <= 9) || (11 <= lastPairNumber && lastPairNumber <= 14)) {
            index = 2;
        } else if (lastNumber == 1) {
            index = 0;
        } else {
            index = 1;
        }
    } else {
        index = 2;
    }
    return pluralItems[index]
};