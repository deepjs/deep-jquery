/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "./json"], function(require, deep, jsonStore) {
	deep.jquery.ajax.HTML = deep.compose.Classes(jsonStore, {
		headers: {
			"Accept": "text/html; charset=utf-8"
		},
		dataType: "html",
		cache:true,
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
	}, function(protocol, baseURI, schema, options){
		this.cacheName = protocol || this.cacheName || ("ns"+Date.now().valueOf());
	});
	//__________________________________________________
	deep.jquery.ajax.html = function(protocol, baseURI, schema, options) {
		var client = new deep.jquery.ajax.HTML(protocol || "html", baseURI, schema, options);
		return client;
	};
	return deep.jquery.ajax.html;

});