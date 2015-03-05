/***
 * @author Andrew Osiname osinamea@gmail.com
 * @description jQuery Kwicks controller
 */

// a few global variables needed throughout the animation sequence

/**********************SETTINGS**********************/
// self explanatory!
var kwickAutoPlay = true;

// time for panel to expand in ms
var milliSec = 1000; 

// time for panel to stay open (when expanded) in ms
var stayOpen = 5000;

// font size of closedPanelText
var closeTextFontSize = "20px";

// space between panels - id leave this alone!
var panelSpacing = 5;

// left to right(1) or right to left(-1) or random(0)
// it feels soo weird after seeing +1 for so long
var kwicksDirection = 1;

// this should be false in production site.
var log = false;
var placeToShowLog = ".kwickLog";
var placeToAddButton = ".kwickLogButton";
/**********************SETTINGS**********************/

// do NOT change the below
var total = 0; // use this to determine the order in which the animation occured
var li;
var state;
var ms;
var version;
var msAndLTE8; // IE and version lte 8

$(document).ready(function() {
    ms = $.browser.msie;
    version =  $.browser.version;
    
	msAndLTE8 = (ms && (version <= 8.0));
	
    var degrees = "rotate(-90deg)";
    var titleToRotate = $(".aocbTitle");
    
    if(msAndLTE8) {
        if(version == 8.0) {
            //$(titleToRotate).css("bottom", "12px");
        }
        if(version == 7.0) {
           //$(titleToRotate).css("bottom", "182px"); 
        }
    }
    else {
        $(titleToRotate).css("-o-transform", degrees);
        $(titleToRotate).css("-khtml-transform", degrees);
        $(titleToRotate).css("-webkit-transform", degrees);
        $(titleToRotate).css("-moz-transform", degrees);
        $(titleToRotate).css("transform", degrees);
        $(titleToRotate).css("-ms-transform", degrees);
        $(titleToRotate).css("font-size", closeTextFontSize);
        $(titleToRotate).css("font-weight", "bold");        
        $(titleToRotate).css("width", "335px");
        $(titleToRotate).css("position", "absolute");
        $(titleToRotate).css("bottom", "152px");
        $(titleToRotate).css("left", "-154px");
        $(titleToRotate).css("padding", "10px 5px");
    }    
    
    // use these later...read on

        
    // animation general settings - all kwicks need this to work! taken directly from demo page
    // http://mottie.github.com/Kwicks/
    // more info here http://trendyent.com/wp-content/themes/DICE/js/jquery.kwicks.2.0/README.markdown
    $('.kwicks').kwicks({
      //min:192,
      max:350,
      duration:milliSec,
      spacing:panelSpacing,
      showNext:kwicksDirection,
      showDuration:stayOpen,
      expanding : function(){
      } 
    });
    
    // binding all possible events to call my toggleTitle
    $('.kwicks').bind('kwicks-init kwicks-expanding kwicks-collapsing kwicks-completed kwicks-playing kwicks-paused', function(e, kwicks){        
        state = e.type;
        li = ".kwick" + (kwicks.active + 1);
        toggleTitleAndDescription(); 
    });
    
    // auto play / other controls
    $('.kwicksController input').click(function(){
            playButtonFade($("#kwickStart"), "out");
            var fxn, val = $(this).val();
            if (!val.match('Collapse|Play|Pause')) {
                    $('#kwicksBasic').data('kwicks').openKwick(val);
            } else {
                fxn = (val === 'Collapse') ? 'closeKwick' : val.toLowerCase();
                $('#kwicksBasic').data('kwicks')[fxn]();
            }
            return false;
    });
    
    if(kwickAutoPlay) {
        // once the animation has been interrupted - this happens
        $("#kwicksBasic").mouseout(function() {
            playButtonFade($("#kwickStart"), "in");
        });
        $("#kwicksBasic").mouseover(function() {
            playButtonFade($("#kwickStart"), "in");
        });
        
        // start the animation on page load
        $("#kwickStart").click();
        
        logState(1);
    }
    
    /*Functions down below*/
    /********************************************************/
    /********************************************************/
    /********************************************************/
    
    /***
     * A nice log to show what the kwick anime is doing
     */
    function logState(addButton) {
        if(log == true) {
            if(addButton == 1) {
                $(placeToAddButton).prepend('<input id="kwickLogg" type="button" value="reset" />');
                $("#kwickLogg").click(function() {
                    $(placeToShowLog).empty();
                });            
            }
            else {
                $(placeToShowLog).append("<br>" + state + "(" + total + ")");
            }            
        }
    }
    
    //  im sure .toggle could do this...!?
    function playButtonFade(button, direction) {
        if(direction == "in") {
            $(button).fadeIn(milliSec);    
        }
        else {
            $(button).fadeOut(milliSec);    
        }
    }
    
    // toggles titlesAndDescription while a panel opens (returns 0)
    function opening() {                
        // hide my title and show my desciption (only if not IE 7 or 8)
		var msAndLTE8 = (ms && (version <= 8.0));
		
		if (!msAndLTE8) {
			$(li + " .aocbTitle").fadeOut(milliSec / 2);
		}
        
        
        // delay example
        //$(li + " .aocbDesc").delay(milliSec/10).slideDown(milliSec);
        $(li + " .aocbDesc").slideDown(milliSec);
        
		if (!msAndLTE8) {
			$(li + " .aocbTitleBottom").slideDown(milliSec);
		}
        
        return 0;
    }

    // toggles titlesAndDescription while a panel closes (returns 0)
    function closing() {
        // just show all titles to re-display the last items title
        $(".aocbTitle").fadeIn(milliSec);
        
        // hide this panels opened state text
        $(".aocbDesc").slideUp(milliSec);
        $(".aocbTitleBottom").slideUp(milliSec);
        return 0;
    }
    
    /***
     *  This is where the title and description are toggled depending on what is happening to the
     *  kwick panel. Have a look here: http://mottie.github.com/Kwicks/ to see the different sequences
     *  and you will see how I came up with the case values in the switch later on
     *  @example a panel goes through init-expanding-complete means it takes the values assigned below
     *  the total would be 10 + 100 + 1000 = 1110
     *  so we do something in second switch(total) later...
     */
    function toggleTitleAndDescription() {
        // these are all the possible states of the kwicks animation
        switch(state) {
            case "kwicks-playing" : total += 1;
                break;
            case "kwicks-init" : total += 10;
                break;
            case "kwicks-expanding" : total += 100;
                break;
            case "kwicks-completed" : total += 1000;
                break;
            case "kwicks-collapsing" : total += 10000;
                break;
            case "kwicks-paused" : total += 100000;
                break;
            default :
                // should never get here unless kwicks library is modified...
                total += 0;
                break;
        }
         
        // this is for logging while debugging
        logState(0);
        
        // the totals have been added up on each call to this function using the switch below
        // the key is that default does not reset total to 0 (otherwise, the state values would not be added up)
        switch(total) {
            case 1 : // just playing
                total = 0;
            break;
        
            case 1000 : // comp
                total = 0;
            break;
            
            case 110 : // init-exp
                closing();
            break;
        
            case 1110 : // init-exp-comp
                total = opening();
            break;
        
            case 1120 : // init-exp-init-coll
                total = closing();
            break;
        
            case 10010 : // init-coll
                total = closing();
            break;
        
            case 11010 : // init-coll-comp
                total = closing();
            break;
        
            case 1220 : // init-exp-init-exp-completed
                total = opening();
            break;        
        
            case 10120 : // init-exp-init-coll
                total = 0;
            break;        
        
            case 100000 : // pau
                total = 0
            break;
        
            case 100110 : // init-exp-pau
                total = opening();
            break;          
            
            default : "";
                break;
        }
    }    
});