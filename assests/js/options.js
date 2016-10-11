"use strict";

$(document).ready(function()
{
    // defualt settings
    var pluginState_val;
    var intervalValue_val;
    var chanceOfModification_val;

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

        //special check if the form is complete
        if(!intervalValue_flag && !chanceOfModification_flag)
        {
            $('.form-response').text('Saved your changes!').stop()
                .fadeIn(1000, function() {
                    $(this).fadeOut(1000);
            });

            // everything is good to save
            saveSettings();
        }

    }

    function saveSettings()
    {
        var params = {"pluginState_val": pluginState_val, "intervalValue_val": intervalValue_val, "chanceOfModification_val": chanceOfModification_val};
        chrome.storage.sync.set(params, function(){
            console.log("saving values from Form... Sending them to Content.js");
            // send our updated settings
            sendSettings(params);
        });


    }

    function loadSettings()
    {
        // pass in a dict with default values for each key if its empty
        var params = {"pluginState_val":false, "intervalValue_val":20, "chanceOfModification_val":10};

        chrome.storage.sync.get(params, function (data) {
            // update vars
            pluginState_val = data.pluginState_val;
            intervalValue_val = data.intervalValue_val;
            chanceOfModification_val = data.chanceOfModification_val;

            // update UI
            $('#pluginState').prop("checked", pluginState_val);
            $('#intervalValue').val(intervalValue_val);
            $('#chanceOfModification').val(chanceOfModification_val);

            // loaded/updated values for params
            var loadedParams = {"pluginState_val": pluginState_val, "intervalValue_val": intervalValue_val, "chanceOfModification_val": chanceOfModification_val};

            // send our loaded settings as a dict with the updated values
            sendSettings(loadedParams);
        });
    }

    // send updated values to content.js
    // takes in a params variable of type dict {}
    function sendSettings(params) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, params, function (response) {
                if (chrome.runtime.lastError) {
                    console.log('ERROR: ' + chrome.runtime.lastError.message);
                } else {
                    console.log(response);
                }
            });
        });
    }

    //on-ready
    loadSettings();
});
