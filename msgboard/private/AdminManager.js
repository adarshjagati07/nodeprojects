const fs = require("fs");
module.exports = class AdminManager {
	constructor() {}
	index() {
		// if (fs.existsSync("./private\\data\\admin.conf")) {
		// 	return {
		// 		"forward": "/private/AdminIndex.html"
		// 	};
		// } else {
		// 	return {
		// 		"forward": "/private/AdministratorCreationForm.html"
		// 	};
		// }
		console.log("Index method got called");
		return {
			"forward": "/private/AdminIndex.html"
		};
	}
	createAdministrator(administrator) {
		console.log("Create Administrator got called");
	}
	checkCredentials(administrator) {
		console.log("Check credentials got called");
	}
	logout() {
		console.log("logout got called");
	}
};
