const fs = require("fs");
var thisModule = this;
exports.processRequest = function (request, response) {
	var username = request.data["username"];
	var password = request.data["password"];
	var administrator = JSON.parse(fs.readFileSync("./private\\data\\admin.conf"));
	if (administrator.username != username || administrator.password != password) {
		response.setContentType("text/html");
		response.write("<!Doctype Html>");
		response.write("<HTML lang='en'>");
		response.write("<head>");
		response.write("<title>College Message Board</title>");
		response.write("<meta charset='utf-8'>");

		//this js code runs on client side
		response.write("<script>");
		response.write("function validateForm(f){");
		response.write("var username = f.username.value.trim();");
		response.write("var password = f.password.value.trim();");
		response.write("if(username.length==0){");
		response.write("alert('Username required');");
		response.write("f.username.focus();");
		response.write("return false;");
		response.write("}");
		response.write("if(password.length==0){");
		response.write("alert('Password required');");
		response.write("f.password.focus();");
		response.write("return false;");
		response.write("}");
		response.write("return true;");
		response.write("}");
		response.write("</script>");
		//js code on client side ends here
		response.write("<body>");
		response.write("<h1>Administrator Module</h1>");
		response.write("<h3>Authentication</h3>");
		response.write("<div style='color:red'> Invalid username/password</div>");
		response.write(
			"<form action='authenticateAdmin' method='post' onsubmit='return validateForm(this)'>"
		);
		response.write("<table border = '0'>");
		response.write("<tr>");
		response.write("<td>Username</td>");
		response.write(
			"<td><input type = 'text' id='username' name='username' maxlength='15' size ='16'</td>"
		);
		response.write("</tr>");
		response.write("<tr>");
		response.write("<td>Password</td>");
		response.write(
			"<td><input type = 'password' id='password' name='password' maxlength='15' size ='16'</td>"
		);
		response.write("</tr>");
		response.write("<tr>");
		response.write("<td colspan='2' align='center'><button type='submit'>Login</button></td>");
		response.write("</tr>");
		response.write("</table>");
		response.write("</form>");
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
	response.write("<body>");
	response.write("<h1>Administrator Module</h1>");
	response.write("<a href='StudentAddForm.jst'>Add Student</a><br>");
	response.write("<a href='getStudents'>Students List</a><br>");
	response.write("<a href='MessageForm.html>Post Message</a><br>");
	response.write("<a href='messageBoard'>Message Board</a><br>");
	response.write("<a href='logout'>Logout</a><br>");

	response.write("</body>");
	response.write("</html>");
	response.close();
};
