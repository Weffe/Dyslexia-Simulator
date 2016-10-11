"use strict";

$(document).ready(function()
{
    // global variables for this scope
    var textNodesList = getTextNodes($("body"));
    var textMetaDict = buildTextMetaDict(textNodesList);
    var intervalID; // holds interval obj
    // default values for options page
    var pluginState_val; // this controls if the plugin is enabled/disabled
    var intervalValue_val; // this controls how often a text node is modified
    var chanceOfModification_val; // this controls the chance of a word in a text node is modified

    // returns: a list of text nodes
    // example output: ["2 points", "Finland", ...]
    function getTextNodes(el)
    {
        // find text nodes only
        return $(el).find(":not(iframe, script)").addBack().contents().filter( function()
        {
            var re = /\S/;
            return this.nodeType == 3 && re.test(this.nodeValue);
        });
    }

    /*
     *  returns: an array of arrays holding dicts
     *  [ [{wordLength : index}, {wordLength : index}, ...], [{wordLength : index}, {wordLength : index}, ...], ... ]
     */
    function buildTextMetaDict(textNodesList)
    {
        var metaDict = [];  // array of arrays to hold our result. Needed for non-unique keys
                            // e.g. {"key1":"value2", "key1":"value4"}

        for (var i = 0; i < textNodesList.length; i++)
        {
            var node = textNodesList[i];

            var metaInfo = [];  // array of separated words to store as the value of node
                                // e.g. [{length:index}, {length:index}]
            var re = /\w+/g; // regex to match 1 or more characters
            var match;

            // loop through current node's nodeValue and separate into dicts to store into separatedWords[]
            while ((match = re.exec(node.nodeValue)) != null)
            {
                var word = match[0];
                var position = match.index;

                metaInfo.push({
                    length: word.length,
                    position: position
                });
            }

            metaDict.push(metaInfo);
        }

        return metaDict;
    }

    // randomly go over every text node and randomly every word
    function modifyTextNode()
    {
        // randomly select a text Node to modify
        var randomIndex = getRandomInt(0, textNodesList.length);
        var node = textNodesList[randomIndex];

        // loop through node's meta info
        for (var j = 0; j < textMetaDict[randomIndex].length; j++)
        {
            // For every word there is a % chance that it will or will not be modified
            // this is controlled by chanceOfModification set via the options page.
            // we need to divide by 100 to convert from percentage to decimal
            if (Math.random() > (chanceOfModification_val/100))
                continue;

            var metaInfo = textMetaDict[randomIndex][j];
            // separate text into 3 different parts
            var word = node.nodeValue.slice(metaInfo.position, metaInfo.position + metaInfo.length);
            var textBeforeWord = node.nodeValue.slice(0, metaInfo.position);
            var textAfterWord  = node.nodeValue.slice(metaInfo.position + metaInfo.length);
            var shuffledWord = shuffle(word);

            // modify "word" and concatenate before assigning node it's new nodeValue
            node.nodeValue = textBeforeWord + shuffledWord + textAfterWord;
        }
    }

    // iteratively go over every text node and randomly every word
    function mTN()
    {
        for (var i = 0; i < textNodesList.length; i++)
        {
            var node = textNodesList[i];

            for (var j = 0; j < textMetaDict[i].length; j++) {
                // Only change a tenth of the words each round.
                //if (Math.random() > 1 / 10)
                //    continue;

                var metaInfo = textMetaDict[i][j];
                // separate text into 3 different parts
                var word = node.nodeValue.slice(metaInfo.position, metaInfo.position + metaInfo.length);
                var textBeforeWord = node.nodeValue.slice(0, metaInfo.position);
                var textAfterWord = node.nodeValue.slice(metaInfo.position + metaInfo.length);
                var shuffledWord = shuffle(word);

                // modify "word" and concatenate before assigning node it's new nodeValue
                node.nodeValue = textBeforeWord + shuffledWord + textAfterWord;
            }
        }
    }

    function shuffle (word)
    {
        // swap 2 letters in the word
        // this includes all letters
        // e.g. apple can be ppael
        if ( word.length >= 3)
        {
            var arr = [...word];
            var i = getRandomInt(0, arr.length+1);
            var j = getRandomInt(0, arr.length+1);

            // check to make sure a != b
            while (i == j)
            {
                i = getRandomInt(0, arr.length+1);
                j = getRandomInt(0, arr.length+1);
            }

            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            // return joined list of shuffled characters as string
            return arr.join('');
        }

        // by default
        return word;
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // load settings from google storage
    function initiatePlugin()
    {
        // First load our default values
        // pass in a dict with default values for each key if its empty
        var params = {"pluginState_val":false, "intervalValue_val":20, "chanceOfModification_val":10};

        chrome.storage.sync.get(params, function (data) {
            // update vars
            pluginState_val = data.pluginState_val;
            intervalValue_val = data.intervalValue_val;
            chanceOfModification_val = data.chanceOfModification_val;

            // with our loaded values, eval the plugin state and run script
            evalPluginState();
        });
    }

    function evalPluginState()
    {
        if (pluginState_val) {
            // this means the user wants to disable the plugin
            try {
                // Sloppy fix for the on/off bug
                chanceOfModification_val = 0;
                //clearInterval(intervalID);
            }
            catch (error) {
                console.log ("Error from evalPLuginState: " + error);
            }
        }
        else
        {
            // enable the plugin
            intervalID = setInterval(modifyTextNode, intervalValue_val);
        }
    }

    // add listener to recieve messages from options.js
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        // update settings values that are sent from options.js
        pluginState_val = request.pluginState_val;
        intervalValue_val = request.intervalValue_val;
        chanceOfModification_val = request.chanceOfModification_val;

        // eval the plugin state again with new settings
        evalPluginState();

        sendResponse("Hello, from Content.js... Got your message!: " + JSON.stringify(request));
    });


    //********************************************************
    // on-ready
    initiatePlugin();
});
