const net = require("net");
const events = require("events");

class DataModel {
   constructor() {
      this.id = null;
      this.username = null;
   }
}
class Request {
   constructor() {
      this.action = "";
   }
}
var model = new DataModel();
var eventEmitter = new events.EventEmitter();
var client = null;

//events
function loggedOut() {
   console.log(`User ${model.username} logged out successfully..`);
   process.exit(0);
}
function usersListArrived(users) {
   console.log("List of Online users..");
   for (var e = 0; e < users.length; e++) {
      if (users[e] != model.username) {
         console.log(users[e]);
      }
      // console.log(users[e]);
   }
   if (users.length == 1) {
      console.log("OOPS, only you are online now!!");
   }
}
function monitorCreated(username) {
   model.username = username;
   console.log("Monitor Screen for user : " + username);
}
function monitorDenied() {
   console.log(`Unable to create monitor as id : ${model.id} is invalid.`);
   process.exit(0);
}

//setting up events
eventEmitter.on("loggedOut", loggedOut);
eventEmitter.on("usersListArrived", usersListArrived);
eventEmitter.on("monitorCreated", monitorCreated);
eventEmitter.on("monitorDenied", monitorDenied);

model.id = process.argv[2];
client = new net.Socket();
client.connect(5500, "localhost", function () {
   console.log("Connected to CLI Chat Server");
   let request = new Request();
   request.action = "createMonitor";
   request.userID = model.id;
   client.write(JSON.stringify(request));
});
client.on("data", function (data) {
   var response = JSON.parse(data);
   if (response.action == "createMonitor") {
      if (response.result != null && response.result.length > 0) {
         eventEmitter.emit("monitorCreated", response.result);
      } else {
         eventEmitter.emit("monitorDenied");
      }
   }
   if (response.action == "logout") eventEmitter.emit("loggedOut");
   if (response.action == "getUsers")
      eventEmitter.emit("usersListArrived", response.result);
});

client.on("end", function () {});
client.on("error", function () {});
