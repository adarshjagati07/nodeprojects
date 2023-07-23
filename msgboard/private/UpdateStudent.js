const fs = require("fs");
var thisModule = this;

exports.processRequest = function (request, response) {
	var rollNumber = request.data["rollNumber"];
	var name = request.data["name"];

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
	response.write("<div style='color:violet'>Roll Number:" + rollNumber + "</div>");
	response.write("<div style='color:violet'>Name:" + name + "</div>");
	response.write("<button type='submit'>Ok</button><br><br>");
	response.write("</form>");
	response.write("<a href='AdminHomePage.html'>Home</a>");

	response.write("</body>");
	response.write("</html>");
	response.close();
};
