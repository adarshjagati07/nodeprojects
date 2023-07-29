const path = require("path");
const fs = require("fs");
const mimeTypes = require("mime-types");
const net = require("net");
const configuration = require("./configuration");
const errors = require("./errors");
const requestParser = require("./requestParser");
const jst2js = require("./jst2js");
var mappings = configuration.getConfiguration();

function Response(socket) {
	var isSocketClosed = false; //flag variable for closing socket
	this.responseInitiated = false;
	this.$$$socket = socket;
	this.contentType = "text/html";
	this.setContentType = function (str) {
		this.contentType = str;
	};
	this.write = function (data) {
		if (this.responseInitiated == false) {
			this.$$$socket.write("HTTP/1.1 200 OK\n");
			this.$$$socket.write(new Date().toGMTString() + "\n");
			this.$$$socket.write("Server: AJWebProjector\n");
			this.$$$socket.write("Content-Type: " + this.contentType + "\n");
			this.$$$socket.write("Connection: close\n\n");
			this.responseInitiated = true;
		}
		this.$$$socket.write(data);
	};
	this.close = function () {
		if (isSocketClosed) return;
		socket.end();
		isSocketClosed = true;
	};
}

function serverResource(socket, resource) {
	if (!fs.existsSync(resource)) {
		errors.send404(socket, resource);
		return;
	}

	var file = resource;
	var header = "HTTP/1.1 200 OK\n";
	header = header + `Content-Type: ${mimeTypes.lookup(resource)}\n`;
	header = header + "\n";
	socket.write(header);
	var bufferSize = 1024;
	var buffer = Buffer.alloc(bufferSize);
	var fileDescriptor = fs.openSync(file, "r");
	var data;
	var bytesExtracted;
	while (true) {
		bytesExtracted = fs.readSync(fileDescriptor, buffer, 0, bufferSize);
		if (bytesExtracted == 0) {
			fs.closeSync(fileDescriptor);
			break;
		} else if (bytesExtracted < bufferSize) {
			data = buffer.slice(0, bytesExtracted);
		} else {
			data = buffer;
		}
		socket.write(data);
	}
	socket.end();
}

var httpServer = net.createServer(function (socket) {
	socket.on("data", function (data) {
		var request = requestParser.parseRequest(data, mappings);
		while (true) {
			request.forwardTo = null;
			if (request.error != 0) {
				errors.processError(request.error, socket, request.resource);
				return;
			}
			if (request.isClientSideTechnologyResource) {
				serverResource(socket, request.resource);
				return;
			} else {
				console.log("Server side resource : " + request.resource + " will be processed ");
				//these two lines of code will ensure that older version is removed from cache
				var absolutePath = path.resolve("./private/" + request.resource);
				delete require.cache[absolutePath];

				var service = require("./private/" + request.resource);
				if (request.isClassMapping) {
					var object = new service();
					object[request.serviceMethod]();
					break; //can be changed later on
					//lot more programming yet to be implemented
				}
				service.processRequest(request, new Response(socket));
				if (request.isForwarded() == false) return;
				var forwardTo = request.forwardTo;
				request.isClientSideTechnologyResource = true;

				if (
					forwardTo == "/private" ||
					forwardTo.startsWith("/private/" || forwardTo.startsWith("private/"))
				) {
					request.error = 500;
				}
				if (forwardTo == "/") {
					request.resource = "index.html";
				} else if (forwardTo.endsWith(".jst")) {
					if (fs.existsSync(forwardTo)) {
						request.isClientSideTechnologyResource = false;
						request.resource = jst2js.prepareJS(forwardTo, request);
					} else {
						request.error = 404;
						request.resource = forwardTo;
					}
				} else {
					var e = 0;
					while (e < mappings.paths.length) {
						if (mappings.paths[e].path == "/" + forwardTo) {
							request.resource = mappings.paths[e].resource;
							request.isClientSideTechnologyResource = false;
							break;
						}
						e++;
					}
					if (request.isClientSideTechnologyResource) {
						request.resource = forwardTo;
					}
				}
			}
		} //infinite loop ends
	});
	socket.on("end", function () {
		console.log("Connection closed by Client");
	});
	socket.on("error", function () {
		console.log("Some error on Client Side");
	});
});

httpServer.listen(8080, "localhost");
console.log("AJHttpServer is up : port 8080");
