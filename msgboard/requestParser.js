const fs = require("fs");
const qs = require("querystring");
const jst2js = require("./jst2js");
exports.parseRequest = function (data, mappings) {
	var request = {}; //created an empty object
	request.error = 0;
	var str = data.toString();
	var splits = str.split("\n");
	var firstLine = splits[0];
	request.isClassMapping = false;
	var w = firstLine.split(" ");
	request.method = w[0].toUpperCase();
	route = w[1];
	request.queryString = null;
	request.data = {};
	request.forwardTo = null;
	request.forward = function (forwardToResource) {
		this.forwardTo = forwardToResource;
	};
	request.isForwarded = function () {
		return this.forwardTo != null;
	};

	if (request.method == "GET") {
		var i = route.indexOf("?");
		if (i != -1) {
			request.queryString = route.substring(i + 1);
			request.data = JSON.parse(JSON.stringify(qs.decode(request.queryString)));
			route = route.substring(0, i);

			//temoporarily for data printing and debugging
			// console.log("******************")
			// console.log(request);
			// console.log("******************")
			// console.log(request.queryString);
			// console.log("--------------------");
			// console.log(request.data);
			//untill here
		}
	}
	if (request.method == "POST") {
		var lastLine = splits[splits.length - 1];
		request.queryString = lastLine;
		request.data = JSON.parse(JSON.stringify(qs.decode(request.queryString)));
	}
	if (route == "/private" || route.startsWith("/private/")) {
		request.resource = route.substring(1);
		request.error = 404;
		return request;
	}
	if (route == "/") {
		request.resource = "index.html";
		request.isClientSideTechnologyResource = true;
		return request;
	} else if (route.endsWith(".jst")) {
		if (fs.existsSync(route.substring(1))) {
			request.isClientSideTechnologyResource = false;
			request.resource = jst2js.prepareJS(route.substring(1));
		} else {
			request.error = 404;
			request.resource = route;
			request.isClientSideTechnologyResource = true;
		}
		return request;
	} else {
		var e = 0;
		while (e < mappings.paths.length) {
			if (mappings.paths[e].path == route) {
				request.resource = mappings.paths[e].resource;
				request.isClientSideTechnologyResource = false;
				console.log("here");
				return request;
			}
			console.log("loop");
			console.log(route);
			if (route.startsWith(mappings.paths[e].path + "/")) {
				console.log("inside mapping");
				console.log(mappings.paths[e].methods);
				if (mappings.paths[e].methods) {
					slashIndex = route.indexOf("/", 1); //after first index which is slash at zeroth index
					operation = route.substring(slashIndex);
					var className = mappings.paths[e].module;
					console.log("operation", mappings.paths[e].methods[operation]);
					if (mappings.paths[e].methods[operation]) {
						if (mappings.paths[e].module) {
							request.isClientSideTechnologyResource = false;
							request.isClassMapping = true;
							request.serviceMethod = mappings.paths[e].methods[operation];
							request.resource = className + ".js";
							console.log(request);
							return request;
						}
					}
				}
			}
			e++;
		}

		request.isClientSideTechnologyResource = true;
		request.resource = route.substring(1);
		return request;
	}
};
