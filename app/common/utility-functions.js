'use strict';

var utility = {
    //This is to creata comma seperated list of options from those the user has entered
    RegexpString: function(str){
        var regex = /\r\n/g;
		str = str.replace(regex, ','+' ').trim();
		return str;
    },
    
    //This is to count the number of options the user has entered
    CountOptions: function(str){
        var count = (str.match(/,/g) || []).length;
	    return count+1;
    }, 
    
    //this is to create an object with a counter for each of the options the user has entered
    CounterObject: function(count){
        var counters = {};
		for(var i = 0; i < count; i++){
			counters[i] = 0;
		}
		return counters;
    }
    
}

module.exports = utility;