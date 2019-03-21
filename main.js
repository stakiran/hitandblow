'use strict';

var PRODUCT_NAME = 'Hit and Blow'
var VERSION      = 'v0.0.1';
var CAPTION      = PRODUCT_NAME + ' - ' + VERSION;

var mod_util = UTIL;
var mod_hitandblow = HITANDBLOW;

var K = {
    'TAB'    : 9,
    'ENTER'  : 13,
    'ESC'    : 27,
};

$(function(){
    document.title = CAPTION;

    var selector_inputarea = '#input_your_trial';
    var selector_messagearea = '#p_message';
    var selector_trialresult = '#ta_trialresult';
    var selector_turncountarea = '#p_info_countvalue';

    var stickflags = {};

    function initialize(){
        $(selector_trialresult).val('');
        game.reset();
        printer.reset();
        update_turn(printer);
        focus_on_input();
        $(selector_messagearea).html('');
    }

    function clear_input(){
        $(selector_inputarea).val('');
    }

    function update_turn(printer){
        $(selector_turncountarea).html(printer.get_turn());
    }

    function focus_on_input(){
        $(selector_inputarea).focus();
    }

    $(selector_inputarea).keydown(function(e){
        var keycode = e.keyCode;
        var mod_alt = e.altKey;
        var mod_ctrl = e.ctrlKey;
        var mod_shift = e.shiftKey;

        // Shift
        if(!mod_alt && mod_shift && !mod_ctrl){
            if(keycode==K.ESC){
                if(!('s_esc' in stickflags)){
                    stickflags['s_esc'] = '';

                    initialize();
                }
                e.preventDefault();
            }
        }

        if(keycode==K.ESC){
            if(!('esc' in stickflags)){
                stickflags['esc'] = '';

                clear_input();
            }
            e.preventDefault();
        }

        if(keycode==K.ENTER){
            if(!('enter' in stickflags)){
                stickflags['enter'] = '';

                $(selector_messagearea).html('');

                var answer = $(selector_inputarea).val();
                if(!game.validate_your_answer(answer)){
                    $(selector_messagearea).html('Invalid input!');
                    return;
                }
                if(game.is_your_answer_correct(answer)){
                    $(selector_messagearea).html('Conglatulation!');
                }
                var hintobj = game.get_hint_from_your_answer(answer);
                printer.set_trialresult(answer, hintobj);
                var text = printer.get_trialresults_with_text();

                $(selector_trialresult).val(text);
                update_turn(printer);
                clear_input();
            }
            e.preventDefault();
        }
    });

    $(selector_inputarea).keyup(function(e){
        var keycode = e.keyCode;
        var mod_alt = e.altKey;
        var mod_ctrl = e.ctrlKey;
        var mod_shift = e.shiftKey;
        if(('s_esc' in stickflags) && keycode==K.ESC){
            delete stickflags['s_esc'];
        }
        if(('enter' in stickflags) && keycode==K.ENTER){
            delete stickflags['enter'];
        }
        if(('esc' in stickflags) && keycode==K.ESC){
            delete stickflags['esc'];
        }
    });

    var game = new mod_hitandblow.Game();
    var printer = new mod_hitandblow.Printer();
    initialize();
});
