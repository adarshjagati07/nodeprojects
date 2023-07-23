const fs = require("fs");
var thisModule = this;

exports.processRequest = function (request, response) {
	var rollNumber = request.data["rollNumber"];
	var name = request.data["name"];
	var students = [];
	if (fs.existsSync("./private\\data\\student.db")) {
		students = JSON.parse(fs.readFileSync("./private\\data\\student.db")).students;
		var e = 0;
		while (e < students.length) {
			var student = students[e];
			if (student.rollNumber == rollNumber) {
				break;
			}
			e++;
		}
	}

	console.log(e);
	console.log(rollNumber);

	students[e] = {
		"rollNumber": rollNumber,
		"name": name
	};
	var jsonToWrite = {
		"students": students
	};
	fs.writeFileSync("./private\\data\\student.db", JSON.stringify(jsonToWrite));

	response.write("<!Doctype Html>");
	response.write("<HTML lang='en'>");
	response.write("<head>");
	response.write("<title>College Message Board</title>");
	response.write("<meta charset='utf-8'>");
	response.write("</head>");
	response.write("<body>");

	response.write("<h1>Administrator Module</h1>");
	response.write("<a href='StudentAddForm.html'>ADD</a>");
	response.write("<table width='70%' align='center'>");
	response.write("<tr>");
	response.write("<td><h3>Students (Edit Module)</h3></td>");
	response.write("<td align = 'right'><a href='logout'>Logout</a></td>");
	response.write("</tr>");
	response.write("</table>");
	response.write("<form action='getStudents'>");
	response.write("<center><b>Student Updated</b><br><br>");
	response.write("<button type='submit'>OK</button></center>");
	response.write("</form>");
	response.write("<a href='AdminHomePage.html'>Home</a>");
	response.write("</body>");
	response.write("</html>");
	response.close();
};
