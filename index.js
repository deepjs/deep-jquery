/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep"], function(require, deep) {

    deep.jquery = deep.jquery || {};

    deep.jquery.init = function(jq) {};
    deep.jquery.outerHTML = function(selector) {
        if (deep.context.$.html)
            return deep.context.$.html(selector);
        else
            return deep.context.$('<div>').append(deep.context.$(selector).clone()).html();
    };
    deep.jquery.isInDOM = function(node) {
        return node.parents('html').length > 0;
        //return jQuery.contains(document.documentElement, node[0]);
    };

    var DOM = {};
    DOM.appendTo = function(selector, force) {
        return function(rendered, nodes) {
            if (!force && nodes && nodes.parents('html').length > 0) {
                var newNodes = deep.context.$(rendered);
                deep.context.$(nodes).replaceWith(newNodes);
                return newNodes;
            }
            return deep.context.$(selector).append(rendered).children().last();
        };
    };
    DOM.prependTo = function(selector, force) {
        return function(rendered, nodes) {
            if (!force && nodes && nodes.parents('html').length > 0) {
                var newNodes = deep.context.$(rendered);
                deep.context.$(nodes).replaceWith(newNodes);
                return newNodes;
            }
            return deep.context.$(selector).prepend(rendered).children().first();
        };
    };
    DOM.replace = function(selector) {
        return function(rendered, nodes) {
            var newNodes = deep.context.$(rendered);
            if (nodes && nodes.parents('html').length > 0)
                deep.context.$(nodes).replaceWith(newNodes);
            else
                deep.context.$(selector).replaceWith(newNodes);
            return newNodes;
        };
    };
    DOM.htmlOf = function(selector) {
        return function(rendered, nodes) {
            return deep.context.$(selector).html(rendered).children();
        };
    };
    deep.jquery.DOM = {};
    deep.jquery.DOM.create = function(name) {
        var protoc = {
            appendTo: function(selector, options) {
                return DOM.appendTo(selector);
            },
            prependTo: function(selector, options) {
                return DOM.prependTo(selector);
            },
            htmlOf: function(selector, options) {
                return DOM.htmlOf(selector);
            },
            replace: function(selector, options) {
                return DOM.replace(selector);
            }
        };
        if (name)
            deep.protocols[name] = protoc;
    };
    return deep.jquery;
});