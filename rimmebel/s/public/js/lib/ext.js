var inArray = function(e, array) {
	var l = array.length;
	for(var i = 0; i < l; i++) {
		if (parseInt(array[i], 10) === parseInt(e,10)) {
			return true;
		}
	}
	return false;
};
Function.prototype.of = function (b) {
	var a = this;
	return function () {
		return a.apply(b, arguments);
	};
};
Array.prototype.swap = function (d, c) {
	var e = this[d];
	this[d] = this[c];
	this[c] = e;
};
Array.prototype.unsetByContent = function(content) {
	var s = this.length;
	for (var i=0; i < s; i++) {
		if (this[i] === content) {
			this.splice(i, 1);
			return ;
		}
	};
};
jQuery.fn.swapWith = function(to) {
    return this.each(function() {
        var copy_to = $(to).clone(true);
        var copy_from = $(this).clone(true);
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};
jQuery.fn.setTo = function(to) {
    return this.each(function() {
    	var $e = $(this);
        $(to).replaceWith( $e.clone(true) );
        return $e;
    });
};

String.prototype.url = function() {
	return str_replace([
	    ' ', '"', "'"
	], [
	    '+', '', ''
	], this);
};

var str_replace = function (search, replace, subject, count) {
    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }
    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }
    return sa ? s : s[0];
};