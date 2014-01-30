/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(["require", "deepjs/deep"], function(require, deep) {

	deep.jquery = {
		appendTo: function(selector, force) {
			return function(rendered, nodes) {
				if (!force && nodes && nodes.parents('html').length > 0) {
					var newNodes = $(rendered);
					$(nodes).replaceWith(newNodes);
					return newNodes;
				}
				nodes = $(rendered).appendTo(selector);
				return nodes;
			};
		},
		prependTo: function(selector, force) {
			return function(rendered, nodes) {
				if (!force && nodes && nodes.parents('html').length > 0) {
					var newNodes = $(rendered);
					$(nodes).replaceWith(newNodes);
					return newNodes;
				}
				return $(rendered).prependTo(selector);
			};
		},
		replace: function(selector) {
			return function(rendered, nodes) {
				var newNodes = $(rendered);
				if(nodes && nodes.parents('html').length > 0)
					$(nodes).replaceWith(newNodes);
				else
					$(selector).replaceWith(newNodes);
				return newNodes;
			};
		},
		htmlOf: function(selector) {
			return function(rendered, nodes) {
				$(selector).empty();
				return $(rendered).appendTo(selector);
			};
		},
		isInDOM : function($node)
		{
			return $node.parents('html').length > 0;
			//return jQuery.contains(document.documentElement, $node[0]);
		}
	};
	deep.jquery.addDomProtocols = function(){
		deep.protocols.dom = {
			appendTo : function (selector, options) {
				return deep.jquery.appendTo(selector);
			},
			prependTo : function (selector, options) {
				return deep.jquery.prependTo(selector);
			},
			htmlOf : function (selector, options) {
				return deep.jquery.htmlOf(selector);
			},
			replace : function (selector, options) {
				return deep.jquery.replace(selector);
			}
		};
	};
	return deep.jquery;
});

