$(document).ready(function() {
	console.log("Hello World from Dyslexia Simulator");
	
	var getTextNodes = function(el) {
		$(el).find(":not(iframe,script)").addBack().contents().filter(function() {
			return this.nodeType == 3
		});
	};
	
	var test = getTextNodes($("*"));
	console.log(test);

});
