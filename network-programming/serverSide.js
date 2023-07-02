const net = require("net");
var server = net.createServer(function (socket) {
  socket.on("data", function (data) {
    console.log("Client says: " + data);
  });
  socket.on("end", function () {
    console.log("Client closed connection");
  });
  socket.write("HI Client");
  socket.end();
});

server.listen(5500);
console.log("Server is ready on port:5500");
