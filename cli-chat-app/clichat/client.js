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

function processSpaces(command) {
   command = command.trim();
   while (true) {
      var i = command.indexOf("  "); //two spaces
      if (i == -1) break;
      command = command.replace("  ", " "); //two spaces followed by 1 space
   }
   return command;
}
function isValidCommand(command) {
   if (command == "logout") return true;
   if (command == "getUsers") return true;
   if (command.startsWith("send ")) {
      //command = processSpaces(this.command);
      var pcs = command.split(" "); //one space
      if (pcs.length >= 3) return true;
   }
   if (command.startsWith("broadcast ")) {
      while (true) {
         var i = command.indexOf("  ");
         if (i == -1) break;
         command = command.replace("  ", " "); //two spaces followed by one space
      }
      var pcs = command.split(" ");
      if (pcs.length >= 2) return true;
   }
   return false;
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

async function processAcceptCommandAction() {
   let ioInterface = readline.createInterface({
      "input": process.stdin,
      "output": process.stdout
   });
   while (true) {
      let command = await acceptInput(
         `${model.user.username}(${model.user.id})>`,
         ioInterface
      );
      command = processSpaces(command);
      if (isValidCommand(command) == false) {
         console.log("Invalid Command/Syntax!!!");
         continue;
      }
      let request = new Request();
      if (command.startsWith("send ")) {
         var spc1 = command.indexOf(" ");
         var spc2 = command.indexOf(" ", spc1 + 1);
         var message = command.substring(spc2 + 1);
         var toUser = command.substring(spc1 + 1, spc2);
         request.action = "send";
         request.toUser = toUser;
         request.fromUser = model.user.username;
         request.message = message;
         client.write(JSON.stringify(request));
      }
      if (command.startsWith("broadcast ")) {
         request.action = "broadcast";
         request.fromUser = model.user.username;
         request.message = command.substring(10);
         client.write(JSON.stringify(request));
      }
      if (command == "getUsers" || command == "logout") {
         request.action = command;
         request.userID = model.user.id;
         client.write(JSON.stringify(request));
      }
      if (command == "logout") break;
   }
   ioInterface.close();
   processAction("login");
}

//event
function loggedIn() {
   console.log(`Welcome ${model.user.username}`);
   processAction("acceptCommand");
}

//setting up events
eventEmitter.on("loggedIn", loggedIn);

client = new net.Socket();
client.connect(5500, "localhost", function () {
   console.log("Connected to Chat server");
   processAction("login");
});

client.on("data", function (data) {
   var response = JSON.parse(data);
   if (response.action == "login") processLoginActionResponse(response);
});

client.on("end", function () {});
client.on("error", function () {});
