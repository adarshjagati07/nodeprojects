const net = require("net");
const readline = require("readline");
const events = require("events");

function acceptInput(q, ioInterface) {
   var promise = new Promise(function (resolve, reject) {
      ioInterface.question(q, function (answer) {
         resolve(answer);
      });
   });
   return promise;
}

class DataModel {
   constructor() {
      this.user = null;
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

function processAction(action) {
   if (action == "login") processLoginAction();
   if (action == "logout") processLogoutAction();
   if (action == "acceptCommand") processAcceptCommandAction();
}

async function processLoginAction() {
   let ioInterface = readline.createInterface({
      "input": process.stdin,
      "output": process.stdout
   });
   let username = await acceptInput("Username : ", ioInterface);
   let password = await acceptInput("Password : ", ioInterface);
   ioInterface.close();
   let request = new Request();
   request.action = "login";
   request.username = username;
   request.password = password;
   client.write(JSON.stringify(request));
}
function processLoginActionResponse(response) {
   if (response.success == false) {
      console.log(response.error);
      processAction("login");
   } else {
      model.user = response.result;
      eventEmitter.emit("loggedIn");
   }
}

function processLogoutAction() {}
function processLogoutActionResponse(response) {}

async function processAcceptCommandAction() {
   let ioInterface = readline.createInterface({
      "input": process.stdin,
      "output": process.stdout
   });
   let command = await acceptInput(
      `${model.user.username}(${model.user.id})>`,
      ioInterface
   );
   ioInterface.close();
   let request = new Request();
   request.action = command;
   client.write(JSON.stringify(request));
}
function processAcceptCommandActionResponse(response) {
   if (response.action == "getUsers") {
      eventEmitter.emit("usersListArrived", response.result);
   }
   if (response.action == "logout") {
      eventEmitter.emit("loggedOut");
   }
}

//event
function loggedIn() {
   console.log(`Welcome ${model.user.username}`);
   processAction("acceptCommand");
}
function usersListArrived(users) {
   console.log("List of online users :");
   for (var e = 0; e < users.length; e++) {
      console.log(users[e]);
   }
   processAction("acceptCommand");
}

//setting up events
eventEmitter.on("loggedIn", loggedIn);
eventEmitter.on("usersListArrived", usersListArrived);

client = new net.Socket();
client.connect(5500, "localhost", function () {
   console.log("Connected to Chat server");
   processAction("login");
});

client.on("data", function (data) {
   var response = JSON.parse(data);
   if (response.action == "login") processLoginActionResponse(response);
   else if (response.action == "logout") processLogoutActionResponse(response);
   else if (response.action == "getUsers")
      processAcceptCommandActionResponse(response);
});

client.on("end", function () {});
client.on("error", function () {});
