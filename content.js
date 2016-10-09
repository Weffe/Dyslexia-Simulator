"use strict";

$(document).ready(function()
{
    // global variables for this scope
    var textNodesList, textMetaDict;

    // returns: a list of text nodes
    // example output: ["2 points", "Finland", ...]
    function getTextNodes(el)
    {
        // find text nodes only
        var textNodes = $(el).find(":not(iframe, script)").addBack().contents().filter( function()
        {
            var re = /\S/;
            return this.nodeType == 3;// && re.test(this.nodeValue);
        });

        textNodesList = textNodes;
    }

    /*
     *  returns: an array of arrays holding dicts
     *  [ [{wordLength : index}, {wordLength : index}, ...], [{wordLength : index}, {wordLength : index}, ...], ... ]
     */
    function buildTextMetaDict(textNodesList)
    {
        var metaDict = []; // array of arrays to hold our result. Needed for non-unique keys
                                // e.g. {"key1":"value2", "key1":"value4"}

        for (var node in textNodesList)
        {
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

        textMetaDict = metaDict;
    }

    function mTN()
    {
        // randomly select a text Node to modify
        var randomIndex = getRandomInt(0, textNodesList.length);
        var node = textNodesList[randomIndex];

        // loop through node's meta info
        for (var j = 0; j < textMetaDict[randomIndex].length; j++)
        {
            // Only change a tenth of the words each round.
            if (Math.random() > 1/10)
                continue;

            var metaInfo = textMetaDict[randomIndex][j];
            // separate text into 3 different parts
            var word = node.nodeValue.slice(metaInfo.position, metaInfo.position + metaInfo.length);
            var textBeforeWord = node.nodeValue.slice(0, metaInfo.position);
            var textAfterWord  = node.nodeValue.slice(metaInfo.position + metaInfo.length);
            var shuffled_word = shuffle(word);

            // modify "word" and concatenate before assigning node it's new nodeValue
            node.nodeValue = textBeforeWord + shuffled_word + textAfterWord;
        }
    }

    function modifyTextNode()
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
                var shuffled_word = shuffle(word);

                // modify "word" and concatenate before assigning node it's new nodeValue
                node.nodeValue = textBeforeWord + shuffled_word + textAfterWord;
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

    function start()
    {
        getTextNodes($("body"));
        buildTextMetaDict(textNodesList);

        //modifyTextNode();
        setInterval(modifyTextNode, 50);
    }

    // Start the plugin
    start();

});
