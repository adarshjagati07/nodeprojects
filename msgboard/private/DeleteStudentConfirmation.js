const fs = require("fs");
var thisModule = this;

exports.processRequest = function (request, response) {
	var rollNumber = request.data["rollNumber"];
	var students;
	var name = "";
	var found = false;
	if (rollNumber) {
		if (fs.existsSync("./private\\data\\student.db")) {
			students = JSON.parse(fs.readFileSync("./private\\data\\student.db")).students;
			var e = 0;
			while (e < students.length) {
				var student = students[e];
				if (student.rollNumber == rollNumber) {
					name = students[e].name;
					found = true;
					break;
				}
				e++;
			}
		}
	}
	if (!found) {
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
		response.write("<td><h3>Students (Delete Module)</h3></td>");
		response.write("<td align = 'right'><a href='logout'>Logout</a></td>");
		response.write("</tr>");
		response.write("</table>");
		response.write("<form action='getStudents'>");
		response.write(
			"<span style='color:red'>Roll Number:" + rollNumber + "does not exists. </span>"
		);
		response.write("<button type='submit'>Ok</button>");
		response.write("</form>");
		response.write("<a href='AdminHomePage.html'>Home</a>");

		response.write("</body>");
		response.write("</html>");
		response.close();
		return;
	}

	response.write("<!Doctype Html>");
	response.write("<HTML lang='en'>");
	response.write("<head>");
	response.write("<title>College Message Board</title>");
	response.write("<meta charset='utf-8'>");

	response.write("<script>");
	response.write("function cancelDeletion(){");
	response.write("document.getElementById('cancelDeletionForm').submit();");
	response.write("}");
	response.write("</script>");

	response.write("</head>");
	response.write("<body>");
	response.write("<h1>Administrator Module</h1>");
	response.write("<table width='90%' border='0'>");
	response.write("<tr>");
	response.write("<td>");
	response.write("<h3>Student (Delete Module)</h3>");
	response.write("</td>");
	response.write("<td align='right'><a href='logout'>Logout</a></td>");
	response.write("</tr>");
	response.write("</table>");

	response.write("<form action='deleteStudent'>");
	response.write("<table>");
	response.write("<tr>");
	response.write("<td>Roll Number : </td>");
	response.write(
		"<td><input type='text' style='border:none' id='rollNumber' value='" +
			rollNumber +
			"' name='rollNumber' maxlength='20' size='22' readonly></td></tr>"
	);
	response.write("<tr><td>Name : </td>");
	response.write(
		"<td><input type='text' style='border:none' id='name' value='" +
			name +
			"' name='name' maxlength='20' size='22' readonly></td></tr>"
	);
	response.write("</tr>");
	response.write("<tr>");
	response.write("<td colspan='2' align='center'>");
	response.write("<button type='submit' style='margin:5px'>Delete</button>");
	response.write(
		"<button type='button' style='margin:5px' onclick='cancelDeletion()'> Cancel </button>"
	);
	response.write("</td>");
	response.write("</tr>");
	response.write("</table>");
	response.write("</form>");
	response.write("<form action='getStudents' id='cancelDeletionForm'></form>");
	response.write("<br><br><a href='AdminHomePage.html>Home</a>");
	response.write("</body>");
	response.write("</html>");
	response.close();
};
