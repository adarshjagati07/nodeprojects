const fs=require('fs');
var usersJSONString = fs.readFileSync("users.data","utf-8");
console.log(usersJSONString);

var users=JSON.parse(usersJSONString).users;
users.forEach(function(user){
console.log(user.username);
console.log(user.password);
console.log("-----------");
});