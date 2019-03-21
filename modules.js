
var UTIL = UTIL || {};
UTIL.________________start________________ = function(){}

// @return A cloned object of param obj.
UTIL.deepcopy = function(obj){
    var obj_by_str = JSON.stringify(obj);
    var new_obj_by_str = obj_by_str;
    var new_obj = JSON.parse(new_obj_by_str);
    return new_obj;
};

// @return A random number between 0 to n-1
UTIL.rnd = function(n){
    return Math.floor(Math.random()*n);
};

// @param charlist_by_str A string but must not have duplicated chars
UTIL.construct_non_duplicated_random_word = function(wordlen, charlist_by_str){
    var word = '';
    var current_charlist = charlist_by_str;
    for(var i=0;i<wordlen;i++){
        var upbound = current_charlist.length;
        var pickee_index = UTIL.rnd(upbound);
        var pickee_char = current_charlist.charAt(pickee_index);
        word = word + pickee_char;
        current_charlist = current_charlist.replace(pickee_char, '');
    }
    return word;
};

UTIL.number2alignedstr = function(n, digit, fillchar){
    var not_filled_str = n.toString();
    var filled_str = not_filled_str;
    for(var i=0;i<digit-not_filled_str.length;i++){
        filled_str = fillchar + filled_str;
    }
    return filled_str;
};

UTIL.number2alignedstr_with_2len_and_space = function(n){
    var digit = 2;
    var fillchar = ' ';
    return UTIL.number2alignedstr(n, digit, fillchar);
};


var HITANDBLOW = HITANDBLOW || {};
HITANDBLOW.________________start________________ = function(){}

HITANDBLOW.get_new_answer = function(){
    return UTIL.construct_non_duplicated_random_word(4, '0123456789');
};

// Hardcoded with 0-9 and 4-digit
HITANDBLOW.Game = (function(){
    var Game = function(){
    }

    var p = Game.prototype;

    p.reset = function(){
        this._answer = HITANDBLOW.get_new_answer();
        console.log('[DEBUG] Answer:' + this._answer);
        this._turn = 0;
    }

    // @retval false not 4-digit
    // @retval false has invalid number, not 0 and 9
    // @retval false has duplicated
    // @retval true a valid answer
    p.validate_your_answer = function(your_answer){
        if(your_answer.length != 4){
            return false;
        }
        var hash_for_validation = {};
        var d1 = your_answer.charAt(0);
        var d2 = your_answer.charAt(1);
        var d3 = your_answer.charAt(2);
        var d4 = your_answer.charAt(3);
        hash_for_validation[d1] = 10;
        hash_for_validation[d2] = 10;
        hash_for_validation[d3] = 10;
        hash_for_validation[d4] = 10;
        var checksum = 0;
        for(var i=0;i<10;i++){
            var k = i;
            var v = hash_for_validation[k];
            if(v === void 0){
                v = 0;
            }
            checksum = checksum + v;
        }
        return checksum==40;
    }

    p.is_your_answer_correct = function(your_answer){
        // @todo impl first conglatulation guard with make answer if turn==0
        this._turn += 1;
        return your_answer==this._answer;
    }

    // @retval An object with {'hit': hit, 'blow': blow}
    p.get_hint_from_your_answer = function(your_answer){
        var count_hit = 0;
        var count_blow = 0;
        for(var i=0;i<4;i++){
            var char_real_answer = this._answer.charAt(i);
            var char_your_answer = your_answer.charAt(i);
            if(char_real_answer == char_your_answer){
                count_hit += 1;
                continue;
            }
            if(this._answer.indexOf(char_your_answer) != -1){
                count_blow += 1;
                continue;
            }
            continue;
        }
        return {
            'hit'  : count_hit,
            'blow' : count_blow
        };
    }

    return Game;
})();

HITANDBLOW.Printer = (function(){
    var Printer = function(){
        this.reset();
    }

    var p = Printer.prototype;

    p.reset = function(){
        this._results = [];
    }

    p.set_trialresult = function(your_answer, hitblow_object){
        var h = hitblow_object.hit;
        var b = hitblow_object.blow;
        var t = this._results.length + 1;

        var result = 'Turn' + mod_util.number2alignedstr_with_2len_and_space(t) + ':' +
                     ' ' +
                     'H ' + h + ' ' + 'B ' + b +
                     ' <- ' + your_answer;
        this._results.push(result);
    }

    p.get_trialresults_with_text = function(){
        var text = '';
        for(var i=0;i<this._results.length;i++){
            var result = this._results[i];
            if(i==0){
                text = result;
                continue;
            }
            text = result + '\n' + text;
        }
        return text;
    }

    p.get_turn = function(){
        return this._results.length;
    }

    return Printer;
})();
