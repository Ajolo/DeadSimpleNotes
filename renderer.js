// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Initialize Firebase
// this will vary with alternate firebase deployments, 
// do not use the values below
var config = {
    apiKey: "redacted",
    authDomain: "dead-simple-notes.firebaseapp.com",
    databaseURL: "https://dead-simple-notes.firebaseio.com",
    projectId: "dead-simple-notes",
    storageBucket: "dead-simple-notes.appspot.com",
    messagingSenderId: "780929896918"
};
firebase.initializeApp(config);

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
