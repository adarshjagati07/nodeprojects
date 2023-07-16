const fs = require("fs");
var thisModule = this;
exports.processRequest = function (request, response) {
	response.setContentType("text/html");
	response.write("<!Doctype Html>");
	response.write("<HTML lang='en'>");
	response.write("<head>");
	response.write("<title>College Message Board</title>");
	response.write("<meta charset='utf-8'>");

	if (fs.existsSync("./private\\data\\admin.conf")) {
		response.write("<body>");
		response.write("<h1>Administrator Module</h1>");
		response.write("<h3>Authentication</h3>");
		response.write("<form action'authenticateAdmin' method='post'>");
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
	} else {
		response.write("<body>");
		response.write("<h1>Administration Module</h1>");
		response.write("<h3>Authentication</h3>");
		response.write("<form action'authenticateAdmin' method='post'>");
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
		response.write("<td>Re-Enter Password</td>");
		response.write(
			"<td><input type = 'password' id='repassword' name='repassword' maxlength='15' size ='16'</td>"
		);
		response.write("</tr>");
		response.write("<tr>");
		response.write("<td colspan='2' align='center'><button type='submit'>Login</button></td>");
		response.write("</tr>");
		response.write("</table>");
		response.write("</form>");
	}
	response.write("</body>");
	response.write("</html>");
};
