const net = require("net");
var clientSocket = new net.Socket();
clientSocket.connect(5500, "localhost", function () {
  console.log("Connected to the server");
  clientSocket.write("Hi, I am your new Client Adarsh");
});

clientSocket.on("data", function (data) {
  console.log("Server says: " + data);
});
clientSocket.on("end", function () {
  console.log("Connection to server closed");
});
