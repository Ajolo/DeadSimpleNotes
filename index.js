document.addEventListener("DOMContentLoaded", function(event) { 
    // console.log("document var", document);
// // Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//////////
// Globals
//////////

// const functions = require('firebase-functions');

var currentNote = "0001";
var currentUID = "ajolo";


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
    if (getCurrentNoteTitle() != null) {
        noteTitle.value = getCurrentNoteTitle();
    }
    else {
        noteTitle.value = "";
    }
    // noteTitle.value = getCurrentNoteTitle();

    // body
    var noteBody = document.getElementById('noteBody');
    if (getCurrentNoteBody() != null) {
        noteBody.value = getCurrentNoteBody();
    }
    else {
        noteBody.value = "";
    }
}   
initCurrentNote();

getCurrentNoteTitle();

/*
var userDataRef = firebase.database().ref("userData").orderByKey();
userDataRef.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();              // childData will be the actual contents of the child

        var name_val = childSnapshot.val().Name;
        var id_val = childSnapshot.val().AssignedID;
    document.getElementById("name").appendChild = name_val;
    document.getElementById("id").innerHTML = id_val;
    });
});
*/


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

// alternatively . . .

/* 
To read data at a path and listen for changes, use the on() or once() methods 
of firebase.database.Reference to observe events.

You can use the value event to read a static snapshot of the contents at a given 
path, as they existed at the time of the event. This method is triggered once when 
the listener is attached and again every time the data, including children, changes. 
The event callback is passed a snapshot containing all data at that location, including 
child data. If there is no data, the snapshot will return false when you call exists() 
and null when you call val() on it.
*/

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
/*
function getCurrentNoteTitle (){
    return database.ref('userData/notes/' + currentNote + '/title').on('value', function(snapshot) {
        console.log(snapshot.val());
    });
}
// getCurrentNoteTitle();
*/

function getCurrentNoteTitle (){
    var returnMe = console.log(database.ref('userData/notes/' + currentNote + '/title').once('value'));
    return returnMe;
}

function getCurrentNoteBody (){
    // return database.ref('userData/notes/' + currentNote + '/body').once('value');
    /*
    database.ref('userData/notes/' + currentNote + '/body').on('value', snapshot => {
        return(snapshot.val());
    });
    */
    /*
    database.ref('userData/notes/' + currentNote + '/body').on('value').then((response) => {
        return (response);
    });;
    /*
    return database.ref('/userData/notes' + currentNote + '/body').once('value').then(function(snapshot) {
        var value = (snapshot.val()) || 'Anonymous';
    });
    */
}


//////////
// SET
//////////

// careful not to set over existing data by specifying userData/ instead
//      of userData/numUsers
function setUserCount (newNum) {
    database.ref('userData/numUsers').set(newNum);
}
setUserCount(1);

function setNoteCount (newNum) {
    database.ref('userData/numNotes').set(newNum);
}
// setNoteCount(1);

function setNoteTitle (newTitle) {
    database.ref('userData/notes/' + currentNote + '/title').set(newTitle);
}
// setNoteTitle("even better title");

function setNoteBody (newBody) {
    database.ref('userData/notes/' + currentNote + '/body').set(newBody);
}


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
for(var i=0;i<count;i++){
    textareas[i].onkeydown = function(e){
        if(e.keyCode==9 || e.which==9){
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            // for a full tab:
            this.selectionEnd = s+1; 
            // for a tab of custom length
            // this.selectionEnd = s + "\t".length;
        }
    }
}
});
