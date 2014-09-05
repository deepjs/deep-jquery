/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(['require', 'deepjs/deep', "../index"], function(require, deep) {

	'use strict';

	var managePreviousNodes = function(rendered, nodes) {
		var $ = deep.$();
		if (nodes._deep_html_merged_) {
			var root = $(rendered).first();
			var head = root.find('head'),
				body = root.find('body');

			if (nodes.head.parents('html').length > 0) {
				head = $(head.html());
				$(nodes.head).replaceWith(head);
			}
			if (nodes.body.parents('html').length > 0) {
				body = $(body.html());
				$(nodes.body).replaceWith(body);
			}
			return {
				_deep_html_merged_: true,
				head: head,
				body: body
			};
		} else if (nodes.parents('html').length > 0) {
			var newNodes = $(rendered);
			$(nodes).replaceWith(newNodes);
			return newNodes;
		}
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

	deep.jquery.DOM = {

		outerHTML: function(selector) {
			var $ = deep.$();
			if ($.html)
				return $.html(selector);
			else
				return $('<div>').append($(selector).clone()).html();
		},
		isInDOM: function(node) {
			return node.parents('html').length > 0;
			//return jQuery.contains(document.documentElement, node[0]);
		},
		appendTo: function(selector, force) {
			return function(rendered, nodes) {
				if (!force && nodes) {
					var r = managePreviousNodes(rendered, nodes);
					if (r)
						return r;
				}
				var $ = deep.$();
				if (!selector) {
					var root = $(rendered),
						tagName = (deep.isBrowser) ? root.get(0).tagName : root[0].name;
					//console.log("appendTo : no selector : tagName : ", tagName, root );
					switch (tagName) {
						case '!doctype':
							//root = (deep.isBrowser)?root.get(1):root[1];
							//console.log("doctype : catch html ? ", $(root).children())
						case 'html':
							var head = $(root).find('head'),
								body = $(root).find('body');
							//console.log("body + head : ", body, head)
							return {
								_deep_html_merged_: true,
								head: $('head').append(head).children().last(),
								body: $('body').append(body).children().last()
							};
						case 'head':
							return $('head').append($(root).html()).children().last();
						case 'body':
							return $('body').append($(root).html()).children().last();
					}
					var id = $(root).attr('id');
					if (id) {
						var target = $('#' + id);
						if (target.length > 0)
							return target.append($(root).html()).children().last();
					}
					console.warn("couldn't place rendered output : no selector provided for dom.appendTo (and no way to guess). Rendered : ", rendered);
					return null;
				}
				//console.log("appendTo : selector : ", selector, " rendered : ",rendered);
				return $(selector).append(rendered).children().last();
			};
		},
		prependTo: function(selector, force) {
			return function(rendered, nodes) {
				if (!force && nodes) {
					var r = managePreviousNodes(rendered, nodes);
					if (r)
						return r;
				}
				var $ = deep.$();
				if (!selector) {
					var root = $(rendered),
						tagName = (deep.isBrowser) ? root.get(0).tagName : root[0].name;
					switch (tagName) {
						case '!doctype':
						case 'html':
							var head = $(root).find('head'),
								body = $(root).find('body');
							return {
								_deep_html_merged_: true,
								head: $('head').prepend(head).children().first(),
								body: $('body').prepend(body).children().first()
							};
						case 'head':
							return $('head').prepend($(root).html()).children().first();
						case 'body':
							return $('body').prepend($(root).html()).children().first();
					}
					var id = root.attr('id');
					if (id) {
						var target = $('#' + id);
						if (target.length > 0)
							return target.prepend($(root).html()).children().first();
					}
					console.warn("couldn't place rendered output : no selector provided for dom.prependTo (and no way to guess). Rendered : ", rendered);
					return null;
				}
				return $(selector).prepend(rendered).children().first();
			};
		},
		replace: function(selector) {
			return function(rendered, nodes) {

				if (nodes) {
					var r = managePreviousNodes(rendered, nodes);
					if (r)
						return r;
				}
				var $ = deep.$();
				var newNodes = $(rendered);
				if (!selector) {
					var root = newNodes,
						tagName = root.tagName;
					switch (tagName) {
						case '!doctype':
						case 'html':
							// take head and body : appendTo previous ones
							var head = root.find('head'),
								body = root.find('body');
							return {
								_deep_html_merged_: true,
								head: $('head').replaceWith(head),
								body: $('body').replaceWith(body)
							};
						case 'head':
							// head appendTo previous head
							$('head').replaceWith(newNodes);
							break;
						case 'body':
							// body appendTo previous body
							$('body').replaceWith(newNodes);
							break;
					}
					var id = root.attr('id'),
						ok = true;
					if (id) {
						var target = $('#' + id);
						if (target.length > 0)
							target.replaceWith(newNodes);
						else
							ok = false;
					} else
						ok = false;
					if (!ok) {
						console.warn("couldn't place rendered output : no selector provided for dom.replace. Rendered : ", rendered);
						return null;
					}
				} else
					$(selector).replaceWith(newNodes);
				return newNodes;
			};
		},
		htmlOf: function(selector) {
			return function(rendered, nodes) {

				if (nodes) {
					var r = managePreviousNodes(rendered, nodes);
					if (r)
						return r;
				}
				var $ = deep.$();
				if (!selector) {
					var root = $(rendered),
						tagName = root.tagName;
					switch (tagName) {
						case '!doctype':
						case 'html':
							var head = root.find('head'),
								body = root.find('body');
							return {
								_deep_html_merged_: true,
								head: $('head').html(head.html()).children(),
								body: $('body').html(body.html()).children()
							};
						case 'head':
							return $('head').html(root.html()).children();
						case 'body':
							return $('body').html(root.html()).children();
					}
					var id = root.attr('id');
					if (id) {
						var target = $('#' + id);
						if (target.length > 0)
							return target.first().html(root.html()).children();
					}
					console.warn("couldn't place rendered output : no selector provided for dom.htmlOf (and no way to guess). Rendered : ", rendered);
					return null;
				}
				//console.log("DOM htmlOf : ", selector, rendered);
				return $(selector).html(rendered).children();
			};
		}
	};
	deep.jquery.dom = function(name) {
		//console.log('jquery.DOM.create : ', name);
		name = name || "dom";
		var protoc = {
			get:function(request, options){
				options = options || {};
				if(options.entry)
					return deep.$(options.entry).find(request);
				return deep.$(request);
			},
			appendTo: deep.jquery.DOM.appendTo,
			prependTo: deep.jquery.DOM.prependTo,
			htmlOf: deep.jquery.DOM.htmlOf,
			replace: deep.jquery.DOM.replace,
			upattr: function(selector) {
				return function(object) {
					return deep.jquery.upattr(object, selector);
				};
			},
			bottomattr: function(selector) {
				return function(object) {
					return deep.jquery.bottomattr(object, selector);
				}
			}
		};
		if (name)
			deep.protocol(name, protoc);
	};
	return deep.jquery.dom;
});