/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require","deepjs/deep", "./json"],function (require, deep, jsonStore)
{
    deep.client.jquery.XML = deep.compose.Classes(jsonStore, {
        headers:{
            "Accept": "application/xml; charset=utf-8",
            "Content-Type": "application/xml; charset=utf-8"
        },
        dataType:"xml",
        bodyParser : function(data){
            if(typeof data === 'string')
                return data;
            if(data.toString())
                return data.toString();
            return String(data);
        },
        responseParser : function(data, msg, jqXHR){
           return jQuery.parseXML( data );
        }
    });
    //__________________________________________________
    deep.extensions.push({
        extensions:[
            /(\.xml(\?.*)?)$/gi
        ],
        client:deep.client.jquery.XML
    });
    deep.client.jquery.XML.create = deep.client.jquery.XML.createDefault =  function(protocol, baseURI, schema, options){
        var client = new deep.client.jquery.XML(protocol || "xml", baseURI, schema, options);
        if(protocol)
            deep.utils.up(deep.protocol.SheetProtocoles, client);
        return client;
    };
    return deep.client.jquery.XML;

});

