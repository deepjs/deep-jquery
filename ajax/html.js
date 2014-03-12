/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "./json"], function(require, deep, jsonStore) {
    deep.jquery.HTML = deep.compose.Classes(jsonStore, {
        headers: {
            "Accept": "text/html; charset=utf-8"
        },
        dataType: "html",
        bodyParser: function(data) {
            if (typeof data === 'string')
                return data;
            if (data.toString())
                return data.toString();
            return String(data);
        },
        responseParser: function(data, msg, jqXHR) {
            return data.toString();
        }
    });
    //__________________________________________________
    deep.jquery.HTML.create = deep.jquery.HTML.createDefault = function(protocol, baseURI, schema, options) {
        var client = new deep.jquery.HTML(protocol || "html", baseURI, schema, options);
        if (protocol)
            deep.utils.up(deep.protocol.SheetProtocoles, client);
        return client;
    };
    return deep.jquery.HTML;

});