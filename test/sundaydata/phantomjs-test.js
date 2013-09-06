/* jshint node:true */
/* global phantom, console */

// PhantomJS driver for loading Enyo core tests and checking for failures
var page = require('webpage').create();

page.onConsoleMessage = function (msg) {
    console.log("JS: " + msg);
    if (msg === "TEST RUNNER FINISHED") {
		var pass = page.evaluate(function() {
			return (document.querySelector(".enyo-testcase-failed") === null);
		});
		var passed = page.evaluate(function() {
			try {
				var cells = document.querySelectorAll(".enyo-testcase-passed");
				var ret = "";
				var length, spaces, text;
				for(var i = 0; i < cells.length; i++) {
					if(cells[i] !== null) {
						text = cells[i].innerText.replace(/ *$/,"").replace(/\t$/,"");
						text = text.replace(/\: PASSED[ \t]*Execution Time: /, "\t\t\t\t\ŧ\t");
						length = text.length;
						length = length < 75?length:1;

						spaces = Array(75-length).join(" ");
						ret += text.replace("\t\t\t\t\ŧ\t", spaces) + "\n";
					}
				}
				return ret;
			} catch (e) {
				return "";
			}
		});
		var failed = page.evaluate(function() {
			try {
				var cells = document.querySelectorAll(".enyo-testcase-failed");
				var ret = "";
				for(var i = 0; i < cells.length; i++) {
					if(cells[i] !== null) {
						ret += cells[i].innerText + "\n";
					}
				}
				return ret;
			} catch (e) {
				return "";
			}
		});
		if (pass) {
			console.log(passed);
			console.log("SundayData tests passed!");
			phantom.exit(0);
		} else {
			console.log(failed);
			console.log("SundayData tests failed. :(");
			phantom.exit(1);
		}
    }
};

page.onError = function(msg, trace) {
	console.log("Error:", msg);
	console.log("Trace:", JSON.stringify(trace));
	phantom.exit(1);
};

page.open("http://localhost:8000/test/sundaydata/index.html", function(status) {
	if (status !== "success") {
		console.log("Error loading page, status: " + status);
		phantom.exit(1);
	}
});

setTimeout(function() {
	console.log("timed out after 1 minute");
	phantom.exit(1);
}, 60 * 1000);

