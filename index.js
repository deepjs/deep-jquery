/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(['require', 'deepjs/deep'], function(require, deep) {

	'use strict';

	deep.jquery = deep.jquery || {};

	deep.jquery.set = function(jq) {
		deep.Promise.context.$ = jq;
	};

	deep.$ = function(selector) {
		if (!selector)
			return deep.Promise.context.$;
		return deep.Promise.context.$(selector);
	};

	deep.jquery.upattr = function(object, selector) {
		deep.$(selector).each(function() {
			for (var i in object)
				deep.Promise.context.$(this).attr(i, object[i]);
		});
	};
	deep.jquery.bottomattr = function(object, selector) {
		deep.$(selector).each(function() {
			for (var i in object)
				if (!$(this).attr(i))
					$(this).attr(i, object[i]);
		});
	};

	return deep.jquery;
});