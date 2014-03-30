/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep"], function(require, deep) {

    deep.jquery = deep.jquery || {};

    deep.jquery.set = function(jq) {
        deep.context.$ = jq;
    };

    deep.$ = function(selector){
        if(!selector)
            return deep.context.$;
        return deep.context.$(selector);
    };

    deep.jquery.DOM = {
        outerHTML : function(selector) {
            var  $ = deep.context.$;
            if ($.html)
                return $.html(selector);
            else
                return $('<div>').append($(selector).clone()).html();
        },
        isInDOM : function(node) {
            return node.parents('html').length > 0;
            //return jQuery.contains(document.documentElement, node[0]);
        },
        appendTo : function(selector, force) {
            return function(rendered, nodes) {
                var  $ = deep.context.$;
                if (!force && nodes && nodes.parents('html').length > 0) {
                    var newNodes = $(rendered);
                    $(nodes).replaceWith(newNodes);
                    return newNodes;
                }
                return $(selector).append(rendered).children().last();
            };
        },
        prependTo : function(selector, force) {
            return function(rendered, nodes) {
                var  $ = deep.context.$;
                if (!force && nodes && nodes.parents('html').length > 0) {
                    var newNodes = $(rendered);
                    $(nodes).replaceWith(newNodes);
                    return newNodes;
                }
                return $(selector).prepend(rendered).children().first();
            };
        },
        replace : function(selector) {
            return function(rendered, nodes) {
                var  $ = deep.context.$;
                var newNodes = $(rendered);
                if (nodes && nodes.parents('html').length > 0)
                    $(nodes).replaceWith(newNodes);
                else
                    $(selector).replaceWith(newNodes);
                return newNodes;
            };
        },
        htmlOf : function(selector) {
            return function(rendered, nodes) {
                var  $ = deep.context.$;
                return $(selector).html(rendered).children();
            };
        }
    };
    deep.jquery.DOM.create = function(name) {
        //console.log("jquery.DOM.create : ", name);
        var protoc =  {
            appendTo:deep.jquery.DOM.appendTo,
            prependTo: deep.jquery.DOM.prependTo,
            htmlOf: deep.jquery.DOM.htmlOf,
            replace: deep.jquery.DOM.replace
        };
        if (name)
            deep.protocol(name, protoc);
    };
    return deep.jquery;
});