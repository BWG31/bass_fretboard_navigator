const STRINGS = ['E', 'A', 'D', 'G'];
const FRETS = 20;
const DOTS = [3, 5, 7, 9, 12, 15, 17, 19];
const NOTE_MODS = ['𝄫','♭', '','♯','𝄪'];
const INTERVALS = [
    {name: 'unison', degree: 'unison', steps: 0, alphaSteps: 0, clashSteps: 0, color: '#EC2B2E'},
    {name: 'min2', degree: 'second', steps: 1, alphaSteps: 1, clashSteps: 1, color: '#25BAFA'},
    {name: 'maj2', degree: 'second', steps: 2, alphaSteps: 1, clashSteps: 2, color: '#25BAFA'},
    {name: 'min3', degree: 'third', steps: 3, alphaSteps: 2, clashSteps: 3, color: '#FDDB2E'},
    {name: 'maj3', degree: 'third', steps: 4, alphaSteps: 2, clashSteps: 4, color: '#FDDB2E'},
    {name: 'p4', degree: 'fourth', steps: 5, alphaSteps: 3, clashSteps: 5, color: '#6F74DF'},
    {name: 'aug4', degree: 'fourth', steps: 6, alphaSteps: 3, clashSteps: 6, color: '#6F74DF'},
    {name: 'dim5', degree: 'fifth', steps: 6, alphaSteps: 4, clashSteps: 6, color: '#65D14D'},
    {name: 'p5', degree: 'fifth', steps: 7, alphaSteps: 4, clashSteps: 7, color: '#65D14D'},
    {name: 'aug5', degree: 'fifth', steps: 8, alphaSteps: 4, clashSteps: 8, color: '#65D14D'},
    {name: 'min6', degree: 'sixth', steps: 8, alphaSteps: 5, clashSteps: 8, color: '#F56674'},
    {name: 'maj6', degree: 'sixth', steps: 9, alphaSteps: 5, clashSteps: 9, color: '#F56674'},
    {name: 'dim7', degree: 'seventh', steps: 9, alphaSteps: 6, clashSteps: 9, color: '#FF9310'},
    {name: 'min7', degree: 'seventh', steps: 10, alphaSteps: 6, clashSteps: 10, color: '#FF9310'},
    {name: 'maj7', degree: 'seventh', steps: 11, alphaSteps: 6, clashSteps: 11, color: '#FF9310'},
    {name: 'flat9', degree: 'ninth', steps: 13, alphaSteps: 1, clashSteps: 1, color: '#55D2EB'},
    {name: 'nat9', degree: 'ninth', steps: 14, alphaSteps: 1, clashSteps: 2, color: '#55D2EB'},
    {name: 'sharp9', degree: 'ninth', steps: 15, alphaSteps: 1, clashSteps: 3, color: '#55D2EB'},
    {name: 'nat11', degree: 'eleventh', steps: 17, alphaSteps: 3, clashSteps: 5, color: '#5977C5'},
    {name: 'sharp11', degree: 'eleventh', steps: 18, alphaSteps: 3, clashSteps: 6, color: '#5977C5'},
    {name: 'flat13', degree: 'thirteenth', steps: 20, alphaSteps: 5, clashSteps: 8, color: '#DC6788'},
    {name: 'nat13', degree: 'thirteenth', steps: 21, alphaSteps: 5, clashSteps: 9, color: '#DC6788'},
];
const OCT = 12;
const MINPITCH = 0;
var MAXPITCH = 0;

window.onload = function () {
    buildFretboard();
}
// Build fretboard
function buildFretboard(){
    var table = document.getElementById("fretboard");
    var pitch = 0;
    for (var s = 0; s < STRINGS.length; s++, pitch = s * 5) {
        var string = table.insertRow(0);
        string.setAttribute('stringName', STRINGS[s]);

        for (var f = 0; f <= FRETS; f++, pitch++) {
            var square = string.insertCell();
            buttonId = STRINGS[s] + f;
            square.innerHTML = '<button id="' + buttonId + '" type="button" class="btn btn-light shadow-none note" pitchIndex="' + pitch + '">' + buttonId + '</button>';
            MAXPITCH = pitch;
        }
    }
    // Set value for highest pitch available
    //Add row of fretboard dots
    var dotrow = table.insertRow(-1);
    for (var f = 0; f <= FRETS; f++) {
        var square = dotrow.insertCell(-1);
        if (DOTS.includes(f)) {
            if (f == 12) square.innerHTML = "••";
            else square.innerHTML = "•";
        }
    }
    $("#maxpitch").text(MAXPITCH);
}

$(document).ready(function() {
    var root = {active: false, color: '#EC2B2E', unison: true};
    var activeIntervals = [];
    var clashes = []; // clashes currently disabled

    // listen for clicks on notes (class="note") in table
    $(".note").click(function () {

        if (this.id === root.id){ return }

        // reset all colors & background
        $('.note').css({'background-color':'#f8f9fa', 'border-color':'transparent'});
 
        // set root values
        root.id = this.id;
        root.pitchIndex = parseInt($(this).attr('pitchIndex'));
        root.active = true;

        // color root
        colorIn (root);
        
        // color active intervals if any
        if (activeIntervals.length > 0) {
            for (let i = 0; i < activeIntervals.length; i++){
                activeIntervals[i].pitchIndex = root.pitchIndex + activeIntervals[i].steps;
                colorIn (root, activeIntervals[i]);
                
            }
        }

        // enable interval buttons
        $(".btn-check, .rootOption, .add-oct-button").prop('disabled', false);

        // DISABLE CLASHES
        if (clashes.length > 0) {
            for (let j = 0; j < clashes.length; j++){
                $('input[value="' + clashes[j].name + '"]').prop('disabled', true);
            }
        }
    });

    // listen for clicks on intervals section
    $(".addInterval").click(function () {
        if (activeIntervals.find(element => element.name === this.value)) { return }
        addInterval(this.value);
    });

    function addInterval(input){
        // set interval values : JSON so that deep copy is made
        let interval = JSON.parse(JSON.stringify(INTERVALS.find(element => element.name === input)));
        interval.pitchIndex = root.pitchIndex + interval.steps;
        interval.isOct = false;
        
        // Check for clashes with other degrees
        let clash = INTERVALS.filter(element => element.clashSteps === interval.clashSteps && element.name !== input);
        // If clashes were found
        if (clash.length > 0) {
            for (let i = 0; i < clash.length; i++) {
                // Disable the buttons for non-selected intervals that clash with selected interval
                $('input[value="' + clash[i].name + '"]').prop('disabled', true);
                clashes.push(clash[i]);
            }
        }

        //check if interval degree & octaves already active. if so: remove previous ones
        var j = activeIntervals.findIndex(element => element.degree === interval.degree && element.clashSteps != interval.clashSteps);
        var octUpOn = false, octDownOn = false;
        while (j != -1){ 
            if (!activeIntervals[j].isOct){
                removeDegree(interval.degree);
            }
            else if (activeIntervals[j].isOctUp){
                removeOctave(interval.degree, 'octUp');
                octUpOn = true; // keeping track of active octaves (to re-add to new interval selected)
            }
            else if (activeIntervals[j].isOctDown){
                removeOctave(interval.degree, 'octDown');
                octDownOn = true; // keeping track of active octaves (to re-add to new interval selected)
            }
            j = activeIntervals.findIndex(element => element.degree === interval.degree && element.clashSteps != interval.clashSteps);
        }

        // color interval
        colorIn(root, interval);
        
        //add interval to activeIntervals
        activeIntervals.push(interval);

        // add octaves if already active
        if (octUpOn) { 
            addOctave(interval.degree, 'octUp');
            $("#" + interval.degree + "OctUp").prop('checked', true);
        }
        if (octDownOn) {
            addOctave(interval.degree, 'octDown');
            $("#" + interval.degree + "OctDown").prop('checked', true);
        }

        // enable octave checkboxes
        $("." + interval.degree + "Oct").prop('disabled', false);
    }

    function addOctave (input, octave){

         // set interval values : JSON so that deep copy is made
         if (input === 'unison'){
             var interval = JSON.parse(JSON.stringify(INTERVALS.find(element => element.name === input)));
         }
         else { var interval = JSON.parse(JSON.stringify(activeIntervals.find(element => element.degree === input)));}
         
         // set octave-specific values
         if (octave === 'octUp') {
             interval.steps = interval.steps + OCT;
             interval.isOctUp = true;
        }
        else if (octave === 'octDown') {
            interval.steps = interval.steps - OCT;
            interval.isOctDown = true;
        }
        // append octave pitchindex
        interval.pitchIndex = root.pitchIndex + interval.steps;
        interval.isOct = true;

        // color octave
        colorIn(root, interval);

        // add octave to activeIntervals
        activeIntervals.push(interval);
    }

    // when click remove interval buttons (-)
    $(".degreeOff").click(function () {
        while (activeIntervals.find(element => element.degree === this.name && element.isOctUp === true)) {
            removeOctave(this.name, 'octUp');
        }
        while (activeIntervals.find(element => element.degree === this.name && element.isOctDown === true)) {
            removeOctave(this.name, 'octDown');
        }
        while (activeIntervals.find(element => element.degree === this.name)) {
            removeDegree(this.name);
        }
    });

    // apply colors
    function colorIn(root, interval){
        // if only given root, color root based on id
        if (interval === undefined) {
            $('#'+root.id).css({'background-color': root.color, 'border-color': 'gold'});
        }
        // else color interval based on pitchIndex (.not() avoids Root getting overwritten by unison)
        else if (interval.pitchIndex <= MAXPITCH && interval.pitchIndex >= MINPITCH) {
            if (!interval.isOct){
                $('[pitchIndex="' + interval.pitchIndex + '"]').not('#'+root.id).css({'background-color': interval.color});
            }
            else {
                $('[pitchIndex="' + interval.pitchIndex + '"]').not('#'+root.id).css({'background-color': interval.color});
            }
        }
    }

    // remove degree
    function removeDegree(degreeToRemove) {
        // get index of match
        var i = activeIntervals.findIndex(element => element.degree === degreeToRemove && element.isOct === false);
        // reset match color
        if (activeIntervals[i].pitchIndex <= MAXPITCH && activeIntervals[i].pitchIndex >= MINPITCH) {
            $('[pitchIndex="' + activeIntervals[i].pitchIndex + '"]').not('#'+root.id).css({'background-color': '#f8f9fa'});
        }

        // clear clash if any
        while (clashes.find(element => element.clashSteps === activeIntervals[i].clashSteps && element.name != activeIntervals[i].name)) {
            // if clash(es) found
            let j = clashes.findIndex(element => element.clashSteps === activeIntervals[i].clashSteps && element.name != activeIntervals[i].name);
                // Enable button(s) for interval that used to clash with removed interval
                $('input[value="' + clashes[j].name + '"]').prop('disabled', false);
                // remove clash from list of active clashes
                clashes.splice(j, 1);
        }
        // disable octave checkboxes
        $("." + activeIntervals[i].degree + "Oct").prop('checked', false);
        $("." + activeIntervals[i].degree + "Oct").prop('disabled', true);

        //remove match from activeIntervals
        activeIntervals.splice(i, 1);
    }

    function removeOctave(degreeToRemove, octType){
        // get index of match
        if (octType === 'octUp'){
            var i = activeIntervals.findIndex(element => element.degree === degreeToRemove && element.isOctUp === true);
        }
        else if (octType === 'octDown'){
            var i = activeIntervals.findIndex(element => element.degree === degreeToRemove && element.isOctDown === true);
        }
        else { return }
        if (i === -1){ return }
         // reset match color
        if (activeIntervals[i].pitchIndex <= MAXPITCH && activeIntervals[i].pitchIndex >= MINPITCH) {
            $('[pitchIndex="' + activeIntervals[i].pitchIndex + '"]').not('#'+root.id).css({'background-color': '#f8f9fa'});
        }
        //remove match from activeIntervals
        activeIntervals.splice(i, 1);
    }

    // reset all colors & data
    $("#tableReset").click(function () {
        $('.note').css({'background-color':'#f8f9fa', 'border-color':'transparent'});
        root = {active: false, color: 'crimson'};
        activeIntervals = [];
        clashes = [];
        $(".btn-check, .rootOption, .octUp, .octDown, .add-oct-button").prop('disabled', true);
        $(".degreeOff").prop('checked', true);
        $(".rootOption, .octUp, .octDown").prop('checked', false);
    })

    // reset all octaves
    function removeAllOctavesUp() {
        $(".octUp").each(function () {
            removeOctave(this.value, 'octUp');
            $("#" + this.value + "OctUp").prop('checked', false);
        })
    }
    function removeAllOctavesDown() {
        $(".octDown").each(function () {
            removeOctave(this.value, 'octDown');
            $("#" + this.value + "OctDown").prop('checked', false);
        })
    }

    // add all upper octaves (of active intervals)
    function addAllOctavesUp() {
        $(".octUp").each(function () {
            if (!$(this).is(':checked') && (!$(this).is(':disabled'))) { 
                addOctave(this.value, 'octUp');
                $("#" + this.value + "OctUp").prop('checked', true);
            }
        })
    }

    // add all lower octaves (of active intervals)
    function addAllOctavesDown() {
        $(".octDown").each(function () {
            if (!$(this).is(':checked') && (!$(this).is(':disabled'))) {
                addOctave(this.value, 'octDown');
                $("#" + this.value + "OctDown").prop('checked', true);
            }
        })
    }

    // "Add all octaves"
    $("#addAllOct").click(function () {
        addAllOctavesUp();
        addAllOctavesDown();
    })

    // "Add all octaves Up"
    $("#addAllOctUp").click(function () {
        addAllOctavesUp();
    })

    // "Add all octaves Down"
    $("#addAllOctDown").click(function () {
        addAllOctavesDown();
    })

    // "Remove all octaves"
    $("#octavesAllReset").click(function () {
        removeAllOctavesUp();
        removeAllOctavesDown();
    })

    // "Reset Octaves Up"
    $("#octavesUpReset").click(function () {
        removeAllOctavesUp();
    })
    
    // "Reset Octaves Up"
    $("#octavesDownReset").click(function () {
        removeAllOctavesDown();
    })

    $("#intervalsAllReset").click(function () {
        $('.note').not('#' + root.id).css({'background-color':'#f8f9fa', 'border-color':'transparent'});
        activeIntervals = [];
        clashes = [];
        $(".octUp, .octDown").not(".rootOption").prop('disabled', true);
        $(".degreeOff").prop('checked', true);
        $(".rootOption, .octUp, .octDown").prop('checked', false);
    })

    // Listen for clicks on "Alternative Root Notes" checkbox
    $("#altRoots").click(function () {
        if ($(this).is(':checked')) {
            // Do this when checked
            addInterval(this.value);
        }
        else if (!$(this).is(':checked')) {
            // Do this when unchecked
            removeDegree(this.value);
        }
    })

    // "[n]th Oct Up]"
    $(".octUp").click(function () {
        if ($(this).is(':checked')) { addOctave(this.value, 'octUp') }
        else if (!$(this).is(':checked')) { removeOctave(this.value, 'octUp') }
    })
    // "[n]th Oct Down"
    $(".octDown").click(function () {
        if ($(this).is(':checked')) { addOctave(this.value, 'octDown') }
        else if (!$(this).is(':checked')) { removeOctave(this.value, 'octDown') }
    })
});

