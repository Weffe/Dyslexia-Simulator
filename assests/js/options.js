"use strict";

$(document).ready(function()
{
    // defualt settings
    var pluginState_val;
    var intervalValue_val
    var chanceOfModification_val

    $("#options_form").submit(function (event)
    {
        // reassign vars in case of changes
        pluginState_val = $('#pluginState').is(':checked');
        intervalValue_val = $('#intervalValue').val();
        chanceOfModification_val = $('#chanceOfModification').val();

        var intervalValue_flag = false, chanceOfModification_flag = false;

        if (intervalValue_val <= 0 || !$.isNumeric(intervalValue_val))
        {
            intervalValue_flag = true;
        }
        if (chanceOfModification_val < 0  || chanceOfModification_val > 100 || !$.isNumeric(chanceOfModification_val))
        {
            chanceOfModification_flag = true;
        }

        processFlags(intervalValue_flag, chanceOfModification_flag);

        saveSettings();

        event.preventDefault();
    });


    function processFlags(intervalValue_flag, chanceOfModification_flag)
    {
        var intervalValue_msg = "The value for <u>Interval Value</u> must be equal or greater than 1.";
        var chanceOfModification_msg = "The value for <u>Chance of Modification</u> must be between 0 to 100.";

        var form_error_ul = $('.form-error ul');
        form_error_ul.empty(); // empty errors before adding again.

        if (intervalValue_flag)
        {
            form_error_ul.append('<li class="intervalValue_msg">' + intervalValue_msg +'</li>');
        }
        else
        {
            form_error_ul.remove('.intervalValue_msg');
        }

        if (chanceOfModification_flag)
        {
            form_error_ul.append('<li class="chanceOfModification_msg">' + chanceOfModification_msg +'</li>');
        }
        else
        {
            form_error_ul.remove('.chanceOfModification_msg');
        }

        //special check if the form was complete on the first try
        if(!intervalValue_flag && !chanceOfModification_flag)
        {
            $('.form-response').text('Saved your changes!').stop()
                .fadeIn(1000, function() {
                    $(this).fadeOut(1000);
            });
        }

    }

    function saveSettings()
    {
        chrome.storage.sync.set({ "pluginState_val": pluginState_val}, function(){
            console.log("saved plugin state", pluginState_val)
        });
        chrome.storage.sync.set({ "intervalValue_val": intervalValue_val}, function(){
            console.log("saved interval value", intervalValue_val)
        });
        chrome.storage.sync.set({ "chanceOfModification_val": chanceOfModification_val}, function(){
            console.log("saved chance of mod", chanceOfModification_val)
        });
    }

    function loadSettings(pluginState_val, intervalValue_val, chanceOfModification_val)
    {
        chrome.storage.sync.get("pluginState_val", function(data){
            if (typeof data.pluginState_val === "undefined")
                pluginState_val = false;
            pluginState_val = data.pluginState_val;
        });
        chrome.storage.sync.get("intervalValue_val", function(data){
            if (typeof data.intervalValue_val === "undefined")
                intervalValue_val = 20;
            intervalValue_val = data.intervalValue_val;
        });
        chrome.storage.sync.get("chanceOfModification_val", function(data){
            if (typeof data.chanceOfModification_val === "undefined")
                chanceOfModification_val = 10;
            chanceOfModification_val = data.chanceOfModification_val;

            //**********************************
            //data actually loads but only inside this function scope.
            //cant get it to return the data to the global variable
            console.log(chanceOfModification_val);

        });
    }


    //on-ready
    loadSettings(pluginState_val, intervalValue_val, chanceOfModification_val);
    /*
    console.log("pluginState_val: ", pluginState_val);
    console.log("intervalValue_val: ", intervalValue_val);
    console.log("chanceOfModification_val: ", chanceOfModification_val);
    */

});
