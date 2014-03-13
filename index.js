/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep"], function(require, deep) {

    deep.jquery = deep.jquery || {};

    deep.jquery.init = function(jq) {};


    deep.jquery.DOM = {
        outerHTML : function(selector) {
            if (deep.context.$.html)
                return deep.context.$.html(selector);
            else
                return deep.context.$('<div>').append(deep.context.$(selector).clone()).html();
        },
        isInDOM : function(node) {
            return node.parents('html').length > 0;
            //return jQuery.contains(document.documentElement, node[0]);
        },
        protocol:{
            appendTo: function(selector, options) {
                return deep.jquery.DOM.appendTo(selector);
            },
            prependTo: function(selector, options) {
                return deep.jquery.DOM.prependTo(selector);
            },
            htmlOf: function(selector, options) {
                return deep.jquery.DOM.htmlOf(selector);
            },
            replace: function(selector, options) {
                return deep.jquery.DOM.replace(selector);
            }
        },
        appendTo : function(selector, force) {
            return function(rendered, nodes) {
                if (!force && nodes && nodes.parents('html').length > 0) {
                    var newNodes = deep.context.$(rendered);
                    deep.context.$(nodes).replaceWith(newNodes);
                    return newNodes;
                }
                return deep.context.$(selector).append(rendered).children().last();
            };
        },
        prependTo : function(selector, force) {
            return function(rendered, nodes) {
                if (!force && nodes && nodes.parents('html').length > 0) {
                    var newNodes = deep.context.$(rendered);
                    deep.context.$(nodes).replaceWith(newNodes);
                    return newNodes;
                }
                return deep.context.$(selector).prepend(rendered).children().first();
            };
        },
        replace : function(selector) {
            return function(rendered, nodes) {
                var newNodes = deep.context.$(rendered);
                if (nodes && nodes.parents('html').length > 0)
                    deep.context.$(nodes).replaceWith(newNodes);
                else
                    deep.context.$(selector).replaceWith(newNodes);
                return newNodes;
            };
        },
        htmlOf : function(selector) {
            return function(rendered, nodes) {
                return deep.context.$(selector).html(rendered).children();
            };
        }
    };
    deep.jquery.DOM.create = function(name) {
        //console.log("jquery.DOM.create : ", name);
        if (name)
            deep.protocol(name, deep.jquery.DOM.protocol);
    };
    return deep.jquery;
});