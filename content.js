<<<<<<< 9ad78061f1e2f48a399e553dfea9ece2e4cae15f
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
=======
"use strict";

$(document).ready(function() {
    function shuffle(word) {
        var a, b, temp, nloops;
        nloops = getRandomInt(0, word.length); // max amount of shuffling is length of word-1

        for(var i = 0; i < nloops; i++)
        {
            a = getRandomInt(0, word.length-1);
            b = getRandomInt(0, word.length-1);
            temp = word[a];
            word[a] = word[b];
            word[b] = temp;
        }

        return word;
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // Returns a random integer between min (excluded) and max (excluded)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // returns: a list of text nodes
    // example output: ["2 points", "Finland", ...]
    function getTextNodes(el) {
        // find text nodes only
        return $(el).find(":not(iframe, script)").addBack().contents().filter(function() {
            // return any non-whitespace characters
            var re = /\S/;
            return this.nodeType == 3 && re.test(this.nodeValue);
        });
    }

    //var textNodes = getTextNodesIn($("p, h1, h2, h3"));
    var textNodesList = getTextNodes($("body"));
    var newList = []
    $.each(textNodesList, function() {
        newList.push( this.nodeValue );
    });

    console.log(newList);
    // expand textNodesList by splitting sentences into individual nodes ***!!!!

    //setInterval(messUpWords, 50);

});
>>>>>>> 7c20aa437ec99c7de03dcaa5197c1c8285741816
