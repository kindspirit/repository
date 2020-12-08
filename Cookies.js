// new Cookies() creates an object containing site cookies as key-value pairs.
// If you don't use new keyword, it adds cookies as properties to the window object
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
