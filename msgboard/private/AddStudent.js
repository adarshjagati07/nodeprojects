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
		response.write("<!Doctype Html>");
		response.write("<HTML lang='en'>");
		response.write("<head>");
		response.write("<title>College Message Board</title>");
		response.write("<meta charset='utf-8'>");
		response.write("<script>");
		response.write("function validateForm(frm) {");
		response.write("var rollNumber = frm.rollNumber.value.trim();");
		response.write("var name = frm.name.value.trim();");
		response.write(
			"var rollNumberErrorSection = document.getElementById('rollNumberErrorSection');"
		);
		response.write("var nameErrorSection = document.getElementById('nameErrorSection')");
		response.write("rollNumberErrorSection.innerHTML = '';");
		response.write("nameErrorSection.innerHTML = '';");
		response.write("var valid = true;");
		response.write("if (rollNumber.length == 0) {");
		response.write("valid = false;");
		response.write("rollNumberErrorSection.innerHTML = 'Required field';");
		response.write("}");
		response.write("if (name.length == 0) {");
		response.write("valid = false;");
		response.write("nameErrorSection.innerHTML = 'Required field';");
		response.write("}");
		response.write("if (rollNumber.length > 0) {");
		response.write("var e = 0;");
		response.write("var validSet = '0123456789';");
		response.write("while (e < rollNumber.length) {");
		response.write("if (validSet.indexOf(rollNumber.charAt(e)) == -1) {");
		response.write("valid = false;");
		response.write("rollNumberErrorSection.innerHTML = 'Should be a number.';");
		response.write("break;");
		response.write("}");
		response.write("e++;");
		response.write("}");
		response.write("}");
		response.write("return valid;");
		response.write("}");
		response.write("</script>");
		response.write("</head>");
		response.write("<body>");
		response.write("<h1>Administration</h1>");
		response.write("<table width='90%' border='0'>");
		response.write("<tr>");
		response.write("<td>");
		response.write("<h3>Student (Add Module)</h3>");
		response.write("</td>");
		response.write("<td align='right'><a href='logout'>Logout</a></td>");
		response.write("</tr>");
		response.write("</table>");
		response.write("<div style='color:red'>RollNumber already exists.</div>");
		response.write("<form action='addStudent' onsubmit='return validateForm(this)'>");
		response.write("<table>");
		response.write("<tr>");
		response.write("<td>Roll Number : </td>");
		response.write(
			"<td><input type='text' id='rollNumber' name='rollNumber' maxlength='20' size='22'></td>"
		);
		response.write("<td><span id='rollNumberErrorSection' style='color: red;''></span></td>");
		response.write("</tr>");
		response.write("<tr>");
		response.write("<td>Name : </td>");
		response.write(
			"<td><input type='text' id='name'name='name' maxlength='20' size='22'></td>"
		);
		response.write("<td><span id='nameErrorSection' style='color: red;''></span></td>");
		response.write("</tr>");
		response.write("<tr>");
		response.write("<td colspan='2' align='center'>");
		response.write("<button type='submit'>Add</button>");
		response.write("</td>");
		response.write("</tr>");
		response.write("</table>");
		response.write("</form>");
		response.write("<br>");
		response.write("<br>");
		response.write("<a href='AdminHomePage.html'>Home</a>");
		response.write("</body>");
		response.write("</html>");
		response.close();
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

	response.write("<!Doctype Html>");
	response.write("<HTML lang='en'>");
	response.write("<head>");
	response.write("<title>College Message Board</title>");
	response.write("<meta charset='utf-8'>");
	response.write("<h1>Administration</h1>");
	response.write("<table width='70%' align='center'>");
	response.write("<tr>");
	response.write("<td><h3>Students</h3></td>");
	response.write("<td align = 'right'><a href='logout'>Logout</a></td>");
	response.write("</tr>");
	response.write("</table>");
	response.write("<p>Want to add more Students?</p>");
	response.write("<table>");
	response.write("<tr>");
	response.write("<td>");
	response.write("<form action='StudentAddForm.html'>");
	response.write("<button type='submit'>Yes</button>");
	response.write("</form>");
	response.write("</td>");
	response.write("<td>");
	response.write("<form action='AdminHomePage.html'>");
	response.write("<button type='submit'>No</button>");
	response.write("</form>");
	response.write("</td>");
	response.write("</tr>");
	response.write("</table>");
	response.write("</body>");
	response.write("</html>");
	response.close();
};
