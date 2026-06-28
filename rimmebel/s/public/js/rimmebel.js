var RimMebel = function() {

};

RimMebel.Helpers = {};

RimMebel.prototype.resize = function(path, width, height) {
    return ['/image.php?', 'width=', width, '&', 'height=', height, '&', 'crop&', 'image=', path].join('')
};

RimMebel.prototype.parsePhotoPath = function(path) {
    return path.replace(/\&amp\;/g, "&");
};

var R = new RimMebel();