const STRINGS = ['E', 'A', 'D', 'G'];
const FRETS = 17;
const DOTS = [3, 5, 7, 9, 12, 15, 17];
const NOTE_MODS = ['𝄫','♭', '','♯','𝄪'];
var MAXPITCH = 0;
const INTERVALS = [
    {name: 'min3', steps: 3, alphaSteps: 2},
    {name: 'maj3', steps: 4, alphaSteps: 2},
    {name: 'p5', steps: 7, alphaSteps: 4},
    {name: 'min7', steps: 10, alphaSteps: 6},
    {name: 'maj7', steps: 11, alphaSteps: 6},
];

window.onload = function () {
    // Build fretboard
    var table = document.getElementById("fretboard2");
    var pitch = 0;
    for (var s = 0; s < STRINGS.length; s++) {
        var string = table.insertRow(0);
        string.setAttribute('stringName', STRINGS[s]);

        for (var f = 0; f <= FRETS; f++, pitch++) {
            var square = string.insertCell();
            buttonId = STRINGS[s] + f;
            square.innerHTML = '<button id="' + buttonId + '" type="button" class="btn btn-light shadow-none note" pitchIndex="'+pitch+'">' + buttonId + '</button>';
        }
        pitch = pitch - 13;
    }
    // Set value for highest pitch available
    MAXPITCH = pitch;
    //Add row of fretboard dots
    var dotrow = table.insertRow(-1);
    for (var f = 0; f <= FRETS; f++) {
        var square = dotrow.insertCell(-1);
        if (DOTS.includes(f)) {
            if (f == 12) square.innerHTML = "••";
            else square.innerHTML = "•";
        }
    }
}

$(document).ready(function(){
    // listen for clicks on notes (class="note")
    $(".note").click(function () {
        // get id clicked cell
        var root = {};
        root.id = this.id;
        root.pitchIndex = parseInt($(this).attr('pitchIndex'));
        // reset all colors & background
        $('.note').css('background-color', '#f8f9fa');
        $('.note').css('border-color', 'transparent');

        // var majThird = root.pitchIndex + 4;
        // $('td[pitchIndex="'+majThird+'"]').children().css('background-color', 'red');
        // var octdown = root.pitchIndex - 12;
        // $('[pitchIndex="'+octdown+'"]').css('background-color', 'rgb(6, 160, 6)');

        
        // Set clicked note to green & border
        $(this).css('border-color', 'black');
        $('[pitchIndex="'+root.pitchIndex+'"]').css('background-color', 'rgb(6, 238, 6)');

        // TESTING INTERVAL BUTTONS
        $(".addInterval").click(function () {
            $('#testArea2').text('NULL');
            var roots = $('[pitchIndex="'+root.pitchIndex+'"]');
            $('.note').not(roots).css('background-color', 'cyan');
            // $('[pitchIndex="'+root.pitchIndex+'"]').css('background-color', 'rgb(6, 238, 6)');
            var interval = INTERVALS.find(element => element.name == this.value);
            var intervalIndex = root.pitchIndex + interval.steps;
            $('#testArea2').text(root.pitchIndex);
            $('[pitchIndex="'+intervalIndex+'"]').css('background-color', 'yellow');
        });
    });
    $("#tableReset").click(function () {
        $('.note').css('background-color', '#f8f9fa');
        $('.note').css('border-color', 'transparent');
    })
});