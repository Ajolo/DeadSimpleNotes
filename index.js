document.addEventListener("DOMContentLoaded", function(event) { 
// // Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


//////////
// Globals
//////////

var currentNote = "0001";
var currentUID = "ajolo";
var currentAuthor = "Alex"


//////////
// Init Firebase
//////////

// this will vary with alternate firebase deployments, 
var config = {
    apiKey: "AIzaSyCsLrXpxhUZ3ZitlaYYnIS8YAF2ypWQK1w",
    authDomain: "dead-simple-notes.firebaseapp.com",
    databaseURL: "https://dead-simple-notes.firebaseio.com",
    projectId: "dead-simple-notes",
    storageBucket: "dead-simple-notes.appspot.com",
    messagingSenderId: "780929896918"
};

firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();


//////////
// Initialize app values based on existing data
//////////

function initCurrentNote () {
    // title
    var noteTitle = document.getElementById('noteTitleInput');    
    getCurrentNoteTitle();
    
    // body
    var noteBody = document.getElementById('noteBody');
    getCurrentNoteBody();
}   
initCurrentNote();


//////////
// Listeners
//////////

// get note body when done typing
// autosave every 5 seconds 
var thisNoteBody = document.getElementById('noteBody');
var timeout = null;
// listen for keystroke events
thisNoteBody.onkeyup = function (e) {
    // clear the timeout if it has already been set.
    // this will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 5000ms
    timeout = setTimeout(function () {
        console.log('Input Value:', thisNoteBody.value);
    }, 5000);

    // make a post/push to database with new notebody
    setNoteBody(thisNoteBody.value);
};

// get document title when done typing in nameTitleInput
// autosave every 5 seconds
var thisNoteTitle = document.getElementById('noteTitleInput');
var timeout = null;
// listen for keystroke events
thisNoteTitle.onkeyup = function (e) {
    // clear the timeout if it has already been set.
    // this will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 5000ms
    timeout = setTimeout(function () {
        console.log('Input Value:', thisNoteTitle.value);
    }, 5000);

    setNoteTitle(thisNoteTitle.value);
};


//////////
// GET
//////////

function testGetMethodOnce () {
    var userId = firebase.auth().currentUser.uid;
    database.ref("userData").once('value').then((response) => {
        console.log(response);
    });;
}
// testGetMethodOnce(); 

function testGetMethodListen () {
    database.ref('userData/numUsers').on('value', function(snapshot) {
        console.log(snapshot.val());
    });

    database.ref('userData/numUsers').on('value', snapshot => {
        console.log(snapshot.val());
    });
    
    var dbRef = database.ref().child('userData/numUsers');
    dbRef.on('value', snapshot => {
    console.log(snapshot.val());
    });
}
// testGetMethodListen(); 

async function getCurrentNoteTitle (){    
    var titleRef = database.ref('userData/notes/' + currentNote + '/title').once('value').then(function(snapshot) {{
        return snapshot.val();
    }}); 
    var snapshotVal = await titleRef; 
    
    var noteTitle = document.getElementById('noteTitleInput');
    noteTitle.value = snapshotVal;
    // console.log("title has been set as:", noteTitle.value);
    return;
}

async function getCurrentNoteBody (){
    var bodyRef = database.ref('userData/notes/' + currentNote + '/body').once('value').then(function(snapshot) {{
        return snapshot.val();
    }}); 
    var snapshotVal = await bodyRef; 
    
    var noteBody = document.getElementById('noteBody');
    noteBody.value = snapshotVal;
    // console.log("body has been set as:", noteBody.value);
    return;
}


//////////
// SET
//////////

// careful not to set over existing data by specifying userData/ instead
//      of userData/numUsers
function setUserCount (newNum) {
    database.ref('userData/numUsers').set(newNum);
}
// setUserCount(1);

function setNoteCount (newNum) {
    database.ref('userData/numNotes').set(newNum);
}
// setNoteCount(1);

function setNoteTitle (newTitle) {
    database.ref('userData/notes/' + currentNote + '/title').set(newTitle);
}
// setNoteTitle("even better title");

function setCurrentNoteAuthor (currentAuthor) {
    database.ref('userData/notes/' + currentNote + '/author').set(currentAuthor);
}
// setCurrentNoteAuthor("Alex")

function setNoteBody (newBody) {
    database.ref('userData/notes/' + currentNote + '/body').set(newBody);
}

async function iterateNoteCount () {
    // get current num
    var currentNumRef = database.ref('userData/numNotes/').once('value').then(function(snapshot) {{
        return snapshot.val();
    }}); 
    var currentNum = await currentNumRef; 
    console.log("currentNum =", currentNum+1); 
    database.ref('userData/numNotes').set(currentNum+1);
}
// iterateNoteCount();

async function decrementNoteCount () {
    // get current num
    var currentNumRef = database.ref('userData/numNotes/').once('value').then(function(snapshot) {{
        return snapshot.val();
    }}); 
    var currentNum = await currentNumRef; 
    database.ref('userData/numNotes').set(currentNum-1);
}
// decrementNoteCount();

//////////
// PUSH (POST)
//////////

// for creation of new notes
function pushNoteData (author, title, noteID, body) {
    var postData = {
        author: author,
        body: body,
        noteID: noteID,
        title: title
    };
    // Get a key for a new Post.
    var newPostKey = database.ref().child('notes').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/userData/notes/' + newPostKey] = postData;
    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    return database.ref().update(updates);    
}

// pushNoteData("Alex", "my first note", "0001", "success of push from javascript")
// this method will push data correctly, but generates the ID of the note
//      based on the .push().key


//////////
//  Create new note
//////////

// first must post/push with pertinent info so that all future changes are handled as push/POSTs
// behavior triggered on button (+) press from sidebar (to be added)


//////////
// Tab behavior for note body 
//////////

// the following allows the user to enter 'tabs' into the textarea without moving
//      the tab focus to the next tabIndex
var textareas = document.getElementsByTagName('textarea');
var count = textareas.length;
for (var i = 0; i < count; i++) {
    textareas[i].onkeydown = function(e) {
        if (e.keyCode == 9 || e.which == 9) {
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            // for a full tab:
            this.selectionEnd = s+1; 
            // for a tab of custom length:
            // this.selectionEnd = s + "\t".length;
        }
    }
}
});
