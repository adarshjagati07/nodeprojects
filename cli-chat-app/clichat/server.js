const net = require("net");
const fs = require("fs");

class DataModel {
   constructor() {
      this.users = [];
      this.userID = 0; //counter variable for alotting id to logged in user
   }
   getUserByUsername(username) {
      var users = this.users.find(function (user) {
         return user.username == username;
      });
      return user;
   }
   getLoggedInUsers() {
      var loggedInUsers = [];
      for (var e = 0; e < this.users.length; e++) {
         if (this.users[e].loggedIn) {
            loggedInUsers.push(this.users[e].username);
         }
         return loggedInUsers;
      }
   }
}
class Response {
   //whatever we have to pass or return we will use this wrapper
   constructor() {
      this.action = "";
      this.success = false;
      this.error = null;
      this.result = null;
   }
}

var model = new DataModel(); //now creating its global variable
//populating the data structure by reading from users.data file
function populateDataStructure() {
   var usersJSONString = fs.readFileSync("users.data", "utf-8");
   var users = JSON.parse(usersJSONString).users;
   users.forEach(function (user) {
      users.loggedIn = false;
      users.id = 0;
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
      response.success = success;
      if (success) {
         response.error = "";
         response.result = "";
         model.userID++;
         requestObject.socket.userID = model.userID;
         user.ID = model.userID;
         user.loggedIn = true;
         response.result = {
            "username": user.username,
            "id": user.id
         };
      } else {
         response.error = "Invalid username/password";
         response.result = "";
      }
      requestObject.socket.write(JSON.stringify(response));
   } //login part ends here
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
      var requestObject = JSON.parse(data); //some more programming is required to handle fragments of data
      requestObject.socket = socket;
      try {
         processRequest(requestObject);
      } catch (e) {
         console.log(e);
      }
   });
   socket.on("end", function () {
      console.log("Client closed connection"); //more programming is required
   });
   socket.on("error", function () {
      console.log("There is some error occured at client side!!!!."); //(we will change this later on)
   });
});

server.listen(5500, "localhost");
console.log("Chat server is ready to accept request on port 5500");
