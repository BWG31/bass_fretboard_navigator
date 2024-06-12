# BASS FRETBOARD NAVIGATOR
#### Video Demo:  https://youtu.be/UWzoPnOy2M0

</br>

## **Description**:
---

The Bass Fretboard Navigator (BFN) is designed to help bass players & teachers to visualise/demonstrate intervallic concepts across the fretboard of the bass guitar. Intervals constitute an essential part of music and are the building blocks for all chords & scales. Being able to visualise these intervals on the fretboard, or commit them to muscle memory, is a key ingredient to becomming a more proficient bass player.

This program generates an interactive "fretboard" in the users' browser, mimicing the layout of a typical 4 string "Fender" bass guitar with 4 strings & 20 frets, and provides a number of options below to tailor the layout to the needs of the user.

Typically a "root note" is selected first on the fretboard, turning the selected note red (with a golden border) and it's "unison"s red. Once a "root note" has been selected, all the interval options are enabled.

</br>

## **FILES**:
---

#### **1. index.html**

<br>

The entire page layout.

The two key areas are:
```
<div class="container fretboard-container">
        <table id="fretboard"></table>
    </div>
```
This is where the "fretboard" will be generated and interacted with.

And:
```
<div class="container control-panel">
```
Where all the "controls" are to be laid out.

<br>

---

### **2. styles.css**

<br>

Most of the design elements are taken from bootstrap.

Tweaks made to get the "fretboard" to look more life-like, such as colors and sizing.

A few basic implementations to ensure some degree of useability on different device sizes but ultimately this has been designed for a computer-sized display.

<br>

---

### **3. fretboardScript.js**

<br>

- #### **GLOBALS**


<br>

- - ##### **STRINGS**
    Represents the strings (table rows) generated on the fretboard. Named according to the standard-tuning of a 4-string bass.

<br>

- - ##### **FRETS**
    Represents the frets (table columns) generated on the fretboard.

    This prototype uses constants for STRINGS & FRETS but a future implementation could use variables to make the fretboard customizable.

<br>

- - ##### **DOTS**
    Marker points for where "dots" are to appear below the fretboard columns. These mimic the placement of the dots on a real bass fretboard neck that are used as reference point to help the user keep track of their position on the fretboard. Typically, a double dot ("••") will occur on the 12th fret, signalling a full octave from the open string.

    <br>

- - ##### **NOTE_MODS**
    Currently unused. These will be used for a future implementation of "real note names" (i.e. "B♭") on the fretboard as opposed to fretnumbers and "real note names" only appearing on the "0th" frets, aka open strings.
    The implementation of "real note names" for such an interactive tool falls way beyond the scope of this first edition for musical reasons (any given note can have different names depending on musical context).

<br>

- - ##### **INTERVALS**
    Defining all the intervals used by the program, matching the most commonly used intervals in western music. The only property not used is the "alphaSteps" property intended for future use with the "NOTE_MODS" above.

<br>

- - ##### **SCALES**
    Defines the scales by naming all the intervals (per INTERVALS) that constitute them.

<br>

- - ##### **OCT**
    Defines an octave, measured in musical "semitones".

<br>

- - ##### **MINPITCH**
    Defines the lower-bound limit of a "pitch", used in the ".pitchIndex" parameter. The "lowest note" of the fretboard (FRET 0 on the "E" STRING) has a .pitchIndex value of 0. This avoids wasting computing power looking for "notes" with a .pitchIndex, below 0.

<br>

- - ##### **MAXPITCH**
    Defines the upper-bound limit of a "pitch". Set as a variable as to be adjustable for future implementations of customizable fretboards with smaller or larger ranges.

<br>

- #### **INITIALIZATION**
    Once the DOM is ready:
    1. buildFretboard() is called. Building the fretboard in the "fretboard" table in index.html.
    2. Three variables are initialized:
        - root: ready to store/replace/remove the selected "root note" chosen by the user on the fretboard.
        - activeIntervals: ready to store/replace/remove any interval added to the board by the user.
        - clashes: ready to store/replace/remove intervals deemed a "clash", preventing the user from calling two intervals of different names that would utilise the same note twice (i.e. "Aug 4th" & "Dim 5th").

    Thereafter the program simply waits for any interactions with the fretboard (selecting a new "root note") or the controls once a "root note" has been selected.

<br>

- #### **KEY PARAMETERS FOR UNDERSTANDING**
    - buttonId / .id : When the fretboard is being built, each HTML "note" (button) is assigned a unique id ("STRING + FRET). So the first 3 buttons of the "E" string would be ids "E0", "E1", "E2", "E3", and so forth.

    - pitch / pitchIndex : The "note" buttons are also assigned a "pitchIndex" property, as per the "pitch" variable. Starting at 0 for the lowest possible note ("E0") and incrementing by one for each rising note.

    - On a standard bass guitar, the tuning of each string is 5 semitones appart. Meaning a note on the 5th fret of a string would have the same pitch as the next open string (i.e. "E5" and "A0", or "A5" and "D0").

    - This system of ids and pitches allows us to access each note individually whilst retaining the ability to find any other existing notes with the same pitch.

    - An example of this in action is when the user selects a root note (shown in red with gold border), we can tell it apart from it's unison(s), aka any note with the same pitchIndex but a different id.

<br>

- #### **EVENT-LISTENERS**
-  - ##### **.note**
        Detects when the user clicks a note on the fretboard and sets it as the new "root note". Also re-allocates any existing active intervals (if moving the root note from one location to another).

        Serves as the trigger to enable interval controls if no root note was previously selected. Clashes need to be re-disabled if present.

<br>

- - ##### **.addInterval**
    Adds the selected interval via the addInterval() function.

<br>

- - ##### **.degreeOff**
    Removes interval when the "-" button to the left of said interval is clicked. Has to first remove any existing octaves of said interval.

<br>

- - ##### **#tableReset**
    Reset the entire table & page to origin state.

<br>

- - ##### **#addAllOct/#addAllOctUp/#addAllOctDown**
    Adds octaves of all intervals and root that are not already on the fretboard.

<br>

- - ##### **#octavesAllReset/#octavesUpReset/#octavesDownReset**
    Removes any active octaves.

<br>

- - ##### **#intervalsAllReset**
    Calls the clearIntervals() function, clearing all intervals from the fretboard & control panel.

<br>

- - ##### **#altRoots**
    "Unison" checkbox that either adds or removes the unison interval (other notes with the same pitch as the root note).

    Why a checkbox? If this was set-up like the other intervals, with a "-" button to reset, it would also reset any root note octaves selected. The root note octaves are actually treated as unison octaves, per the INTERVALS list. We need to have a seperate functionality for the non-octave unison interval. When the "Unison" checkbox is active, we actually have two copies of the "unison" interval in the activeIntervals[], one for the interval itself, another as an anchor point for the octaves (if present). Having it as a checkbox highlights it as a "root note option" as opposed to an interval with the same functionality as the rest of the intervals in the control section.

<br>

- - ##### **.octUp/.octDown**
    Adds/removes the octaves of the relevant interval. These are only accessible if a selection of the relevant degree (i.e. "minor 2nd" & "Major 2nd" share the same degree of a "second") has been made.

<br>

- - ##### **.scale-option**
    clears the board of all intervals and calls the addScale () function for the relevant scale

<br>

- #### **FUNCTIONS**
- - ##### **buildFretboard()**
    Builds a "fretboard" table in the HTML document.
    Variables:
    - **pitch**: used to set the pitchIndex of each note. Set to mimic the tuning of a bass per the "pitch = s * 5" each time we beging new row (aka string). Thus E = 0, A = 5, D = 10 and G = 15 in pitchIndex terms.
    - **s**: the string index number. E = 0, A = 1, D = 2, G = 3.
    - **f**: the fret number.
    - **buttonId**: The concatenation of s + f, giving each "note" a unique ID that can be subsequently referenced.
    - **nut**: used to create the "nut" visual element found between the "open strings" (fret 0) and fret 1, adding a more realistic display.
    - **dotRow**: used to create an extra row below the notes, replicating the dots found on the neck of a bass as a visual aid.

    Will build according to the STRINGS & FRETS const values fed to it.

<br>

- - ##### **addAllOctavesUp()**
    Will call the addOctave() function to add an octave up of any interval who's "↑" checkbox is enabled but not checked.

<br>

- - ##### **addAllOctavesDown()**
    As above but for "↓" checkboxes adding octaves down.

<br>

- - ##### **addInterval(input)**
    Adds an interval that is fed to it. Making a deep copy of the matching object in the INTERVALS [] so it can be manipulated independantly.

    Has to be able to handle many different scenarios when called upon. See JS file notes for more details.

<br>

- - ##### **addOctave(input, octave)**
    A simplified version of the addInterval() function with some changes to handle octaves. Boolean values are assigned to the interval for future indentification.

<br>

- - ##### **addScale(scaleName)**
    displays all the intervals that make up the relevant scale calling the addInterval () function for each element in the scale as defined in the SCALES object. Also adds the octave of the chosen root note to complete the scale through the addOctave() function.

    <br>

- - ##### **clearIntervals**
    Resets everything except for the root note and the coloring of the "Root" button in controls.

- - ##### **colorIn(root, interval)**
    Sets the relevant background color (and border if root) of any note by matching:
    - for root note: the root.id to the note id (on the fretboard) and the "Root" display button in the controls.
    - for interval: the interval.pitchIndex to the pitchIndex values existing on the fretboard (avoiding overwriting the root note in the case of a unison).

<br>

- - ##### **removeAllOctavesUp()/removeAllOctavesDown()**
    Calls the removeOctave() function for all intervals feeding it "octUp" or "octDown" as desired. Resets checkboxes affected.

<br>

- - ##### **removeDegree(degreeToRemove)**
    Removes any interval present in activeIntervals [] that matches degreeToRemove. Resets colors, clears clashes if any and disables octave options for this degree.

<br>

- - ##### **removeOctave(degreeToRemove, octType)**
    Searches for matching octave in activeIntervals [] and removes it if found, resetting color.
