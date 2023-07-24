const fs = require("fs");
var thisModule = this;

exports.processRequest = function (request, response) {
	var rollNumber = request.data["rollNumber"];
	var name = request.data["name"];
	var students = [];
	if (fs.existsSync("./private\\data\\student.db")) {
		students = JSON.parse(fs.readFileSync("./private\\data\\student.db")).students;
	}
	var i;
	var found = false;
	for (i = 0; i < students.length; i++) {
		if (students[i].rollNumber == rollNumber) {
			found = true;
			break;
		}
	}
	if (found) {
		request.forward("StudentAddForm.html");
		return;
	}
	//save and send back acknowlegement
	students[students.length] = {
		"rollNumber": rollNumber,
		"name": name
	};
	var jsonToWrite = {
		"students": students
	};
	fs.writeFileSync("./private\\data\\student.db", JSON.stringify(jsonToWrite));
	request.forward("StudentAddedNotification.html");
	response.close();
};
