/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
    
define(["require", "deepjs/deep", "deepjs/lib/stores/http/client"],function (require, deep)
{
	/**
	 * TODO : patch/put with query
	 *
	 * manage redirections
	 */
	var writeHeaders = function (req, headers)
	{
		for(var i in headers)
			req.setRequestHeader(i, headers[i]);
	};

	var ajaxCall = function(uri, body, method, options){
		// console.log("ajax call : ", uri, body, method);
		if(body instanceof Error)
			return body;
		var def = deep.Deferred();
		var self = this;
		var toSend = {
			beforeSend :function(req) {
				writeHeaders(req, options.headers);
			},
			url:uri,
			method:method
		};
		if(body !== null)
		{
			toSend.dataType = options.dataType || this.dataType || "json";
			toSend.data = this.parseBody(body);
		}
		$.ajax(toSend)
		.done(function(data, msg, jqXHR){
			def.resolve(self.responseParser(data, msg, jqXHR));
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			if(jqXHR.status < 400)
				def.resolve(self.responseParser(jqXHR.responseText, textStatus, jqXHR));
			else
				def.reject(deep.errors.Error(jqXHR.status, textStatus));
		});
		return def.promise();
	};

	var client = {
		dataType:"json",
		responseParser : function(data, msg, jqXHR){
			//console.log("parsing : ", data, msg);
			// try{
			// 	if(typeof data === 'string')
			// 		data = JSON.parse(data);
			// }
			// catch(e) { return e; }
			return data;
		},
		parseBody : function(data){
			try{
				//if(typeof data !== 'string')
					data = JSON.stringify(data);
			}
			catch(e)
			{
				return e;
			}
			return data;
		},
		get:function(id, options){
			return ajaxCall.call(this, id, null, "GET", options);
		},
		post:function(uri, body, options)
		{
			return ajaxCall.call(this, uri, body, "POST", options);
		},
		put:function(uri, body, options)
		{
			return ajaxCall.call(this, uri, body, "PUT", options);
		},
		patch:function(uri, body, options)
		{
			return ajaxCall.call(this, uri, body, "PATCH", options);
		},
		del:function(id, options){
			return ajaxCall.call(this, id, null, "DELETE", options);
		},
		range:function(start, end, uri, options)
		{
			console.log("juqery json range uri : ", uri);
			var def = deep.Deferred();
			var self = this;
			$.ajax({
				beforeSend :function(req) {
					writeHeaders(req, options.headers);
				},
				url:uri,
				method:"GET"
			})
			.done(function(data, msg, jqXHR)
			{
				var res = {
					contentRange:jqXHR.getResponseHeader("content-range"),
					data:self.responseParser(data, msg, jqXHR)
				};
				def.resolve(res);
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				if(jqXHR.status < 400)
				{
					var res = {
						contentRange:jqXHR.getResponseHeader("content-range"),
						data:self.responseParser(jqXHR.responseText, textStatus, jqXHR)
					};
					def.resolve(res);
				}
				else
					def.reject(deep.errors.Error(jqXHR.status, textStatus));
			});
			return def.promise();
		},
		rpc:function(uri, body, options){
			return ajaxCall.call(this, uri, body, "POST", options);
		},
		bulk:function(uri, body, options)
		{
			return ajaxCall.call(this, uri, body, "POST", options);
		}
	};
	deep.client.jquery = {};
	deep.client.jquery.JSON = deep.compose.Classes(client, deep.client.ClientStore);
	deep.client.jquery.JSON.create = function(protocol, baseURI, schema, options){
		var client = new deep.client.jquery.JSON(protocol, baseURI || "", schema, options);
		if(protocol)
            deep.utils.up(deep.protocol.SheetProtocoles, client);
        return client;
	};
	deep.client.jquery.JSON.createDefault = function(){
		var client = new deep.client.jquery.JSON("json");
        deep.utils.up(deep.protocol.SheetProtocoles, client);
        return client;
	};
	return deep.client.jquery.JSON;
});

