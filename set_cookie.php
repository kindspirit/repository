<?php
/**
 *
 * Set a cookie with a set-cookie HTTP response header.
 *
 * Works similarly to alternative setcookie() signature that became available in PHP 7.3 supporting the samesite attribute.
 * One difference is that you can specify "two years" as the max-age and it will convert that to seconds for you.
 * If you try and set a max-age longer than two years (the max) it will use the expires directive instead.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * 
 *
 * @param	string     	$name The name of the cookie.
 * @param	string|bool	$value The value you wish to set or boolean false to delete a cookie.
 * @param	array      	$options array containing directives like max-age, path, secure, httponly, and samesite. e.g. ['path'=>'/','secure'=>true]
 * @return	null
 *
 */


function set_cookie($name, $value, $options = array()) {
	$options = array_change_key_case(array_filter($options, 'strlen'));// Remove 0-length values. Convert keys to lowercase.
	if ($value===false) {// Delete cookie
		$options['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
		unset($options['max-age']);
	}
	else {
		if (isset($options['max-age'])) {
			if (is_string($options['max-age'])) {// supports "20 years" instead of int
				$options['max-age'] = strtotime($options['max-age'])-$_SERVER['REQUEST_TIME'];
			}
			$options['expires'] = $options['max-age']+$_SERVER['REQUEST_TIME'];
			if ($options['max-age']>63072000 || explode('MSIE ', $_SERVER['USER_AGENT'].'MSIE 9', 2)[1]<9) {
				// The max-age maximum is 2 years (around 63072000 seconds) so remove values greater than that.
				// Internet Explorer < 9 doesn't support the max-age directive so remove it. Expires is set below.
				unset($options['max-age']);
			}
		}
		if (is_numeric($options['expires'])) {
			$options['expires'] = substr(gmdate('r', $options['expires']), 0, -5).'GMT';// Convert to string.
		}
	}

	$escape_matches = function ($matches) {// Returns matches as % followed by two hex digits.
		return '%'.bin2hex($matches[0]);
	};
	// Encode control characters, spaces, non-ascii, and ( ) < > @ , ; : \ " /  [ ] ? = { } %
	$name = preg_replace_callback('#[\x00-\x20\x7F-\xFF()<>@,;:\\\\"/\\[\\]?={}%]#', $escape_matches, $name);

	// Encode control characters, spaces, non-ascii, double quotes, comma, semicolon, backslash and %
	$value = preg_replace_callback('#[\x00-\x20\x7F-\xFF",;\\\\%]#', $escape_matches, $value);

	$cookie = "set-cookie: $name=$value";// Use lower case for better compression with HTTP/2
	foreach ($options as $attr => $value) {
		$cookie.= ";$attr";
		if ($value!==true) {// True is implied. Skip true values.
			$cookie.= '='.$value;
		}
	}
	header($cookie, false);
}
