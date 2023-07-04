const net = require("net");
const fs = require("fs");
const { json } = require("stream/consumers");
class Response {
   constructor() {
      this.action = "";
      this.success = false;
      this.error = null;
      this.result = null;
   }
}

class DataModel {
   constructor() {
      this.users = [];
      this.userID = 0;
   }
   getUserByUsername(username) {
      var user = this.users.find(function (user) {
         return user.username == username;
      });
      return user;
   }
   getLoggedInUsers() {
      var loggedInUsers = [];
      for (var e = 0; e < this.users.length; e++) {
         if (this.users[e].loggedIn == true) {
            loggedInUsers.push(this.users[e].username);
         }
      }
      return loggedInUsers;
   }
}

var model = new DataModel();

function populateDataStructure() {
   var usersJSONString = fs.readFileSync("users.data", "utf-8");
   var users = JSON.parse(usersJSONString).users;
   users.forEach(function (user) {
      user.loggedIn = false;
      user.id = 0;
      model.users.push(user);
   });
}

function processRequest(requestObject) {
   if (requestObject.action == "login") {
      let username = requestObject.username;
      let password = requestObject.password;
      let user = model.getUserByUsername(username);
      var success = false;
      if (user) {
         if (password == user.password) success = true;
      }
      let response = new Response();
      response.action = requestObject.action;
      if (success) {
         response.error = "";
         model.userID++;
         requestObject.socket.userID = model.userID;
         userID = model.userID;
         user.loggedIn = true;
         response.result = {
            "username": user.username,
            "id": userID
         };
      } else {
         response.error = "Invalid username/password";
         response.result = "";
      }
      console.log(response.result.username, response.result.id); //extra comment added to show users that have been logged in.
      response.success = success;
      requestObject.socket.write(JSON.stringify(response));
   }
   if (requestObject.action == "logout") {
   } //logout part ends here
   if (requestObject.action == "getUsers") {
      var response = new Response();
      response.action = requestObject.action;
      response.result = model.getLoggedInUsers();
      requestObject.socket.write(JSON.stringify(response));
   } //getUsers part ends here
}

populateDataStructure();
var server = net.createServer(function (socket) {
   socket.on("data", function (data) {
      var requestObject = JSON.parse(data);
      requestObject.socket = socket;
      try {
         processRequest(requestObject);
      } catch (e) {
         console.log(e);
      }
   });
   socket.on("end", function () {
      console.log("Client closed Connection");
   });
   socket.on("error", function () {
      console.log("Some error on Client Side");
   });
});

server.listen(5500, "localhost");
console.log("Chat Sever is ready to accept request on port 5500");
