// new Cookies() creates an object containing cookies as key-value pairs.
function Cookies() {
	var a, i, p;
	if (typeof document.cookie=='string') {
		a = document.cookie.split(';');
		for (i=0; i<a.length; i++) {
			while (a[i].charAt(0)==' ') {// trim leading spaces
				a[i] = a[i].substring(1);
			}
			if (a[i]) {
				p = a[i].indexOf('=');
				// Split into key-value pair. If no '=' is found in a[i], use empty string as the key.
				this[p==-1? '': unescape(a[i].substring(0, p))] = unescape(a[i].substring(p+1));
			}
		}
	}
}

/*
	this.set = function(cookieName, cookieValue) {// Set a cookie with the given options
		var i, j, k, key, value, array, options = arguments[2] || o.options, s = cookieName+'='+cookieValue;
		for (key in options) {
			value = options[key];
			if (options.hasOwnProperty(key) && (value || typeof value=='number')) {
				s+= '; '+key+'=';
				if (typeof value!='boolean') {
					s+= value;
				}
			}
		}
		document.cookie = s;
		array = document.cookie.split(';');
		while (i--) {
			while (array[i].charAt(0)==' ') {// trim spaces
				array[i] = array[i].substring(1);
			}
			j = array[i].indexOf('='), k = j==-1? '': array[i].substring(0, j);
			if (k==key) {
				o[name] = value;
				return true;
			}
		}
		return false;		
	}
	this.enabled = function() {
		var i, j, array, found;
		document.cookie = 'testarrayenabled=1';
		for (i=0; i<2; i++) {
			found = false;
			j = array.length;
			while(j--) {
				while (array[j].charAt(0)==' ') {// trim spaces
					array[j] = array[j].substring(1);
				}
				if (array[j].indexOf('testarrayenabled=')==0) {
					found = true;
					break;
				}
			}
			if (!found) {
				return i;
			}
			// Delete test cookie.
			document.cookie = 'testarrayenabled=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
		}
	}
}
*/