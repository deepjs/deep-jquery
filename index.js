/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(["require", "deepjs/deep"], function(require, deep) {

	// todo : add deep.login(...)  et deep.logout()
	deep.jquery = {
		outerHTML:function(selector){
			if(deep.context.$.html)
				return deep.context.$.html(selector);
			else
				return deep.context.$('<div>').append(deep.context.$(selector).clone()).html();
		},
		init:function(jq){

		},
		appendTo: function(selector, force) {
			return function(rendered, nodes) {
				if (!force && nodes && nodes.parents('html').length > 0) {
					var newNodes = deep.context.$(rendered);
					deep.context.$(nodes).replaceWith(newNodes);
					return newNodes;
				}
				//if(typeof jQuery !== 'undefined' && jQuery.fn.appendTo)
					nodes = deep.context.$(selector).append(rendered).children().last();
				//else

				return nodes;
			};
		},
		prependTo: function(selector, force) {
			return function(rendered, nodes) {
				if (!force && nodes && nodes.parents('html').length > 0) {
					var newNodes = deep.context.$(rendered);
					deep.context.$(nodes).replaceWith(newNodes);
					return newNodes;
				}
				return deep.context.$(selector).prepend(rendered).children().first();
				//return deep.context.$(rendered).prependTo(selector);
			};
		},
		replace: function(selector) {
			return function(rendered, nodes) {
				var newNodes = deep.context.$(rendered);
				if(nodes && nodes.parents('html').length > 0)
					deep.context.$(nodes).replaceWith(newNodes);
				else
					deep.context.$(selector).replaceWith(newNodes);
				return newNodes;
			};
		},
		htmlOf: function(selector) {
			return function(rendered, nodes) {
				//deep.context.$(selector).empty();

				return deep.context.$(selector).html(rendered).children();
			};
		},
		isInDOM : function(node)
		{
			return node.parents('html').length > 0;
			//return jQuery.contains(document.documentElement, node[0]);
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

