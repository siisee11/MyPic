$(function(){
	console.log("fire");
	//Cloud Firesotre initialize
	firebaseConfig = config();
	firebase.initializeApp(firebaseConfig);
	
	//Connection with database
	var db = firebase.firestore();
	db.collection("User").doc("seungjun_test").set({
		name: "seungjun"
	});
    var newpostkey = firebase.database().ref().child('posts').push().key;
    var postdata = {
        id : newpostkey,
        writer : "seungjun1",
        wdate : Date.now()
    };
    var updates = {};
    updates['/board/' + newpostkey] = postdata;
    firebase.database().ref().update(updates);
});

function config(){
	console.log("fire/config()");
	var firebaseConfig = {
		apiKey: "AIzaSyBorxVHu3NNxxsPyXc5pNMQyDSeEXaN-ng",
        authDomain: "mypic-92b94.firebaseapp.com",
        projectId: "mypic-92b94",
    	databaseURL: "https://mypic-92b94.firebaseio.com",
    	storageBucket: "mypic-92b94.appspot.com",
	    messagingSenderId: "940807570090",
    	appId: "1:940807570090:web:4987e8bc9c3320903f46d3",
	    measurementId: "G-7SKX7Y9E6T"
    };

	/*
	//maybe realtime storage config...
	var firebaseConfig = {
		apiKey: "AIzaSyBorxVHu3NNxxsPyXc5pNMQyDSeEXaN-ng",
        authDomain: "mypic-92b94.firebaseapp.com",
        projectId: "mypic-92b94",
        databaseURL: "https://mypic-92b94.firebaseio.com",
        storageBucket: "mypic-92b94.appspot.com",
        messagingSenderId: "940807570090",
        appId: "1:940807570090:web:5a0c536d5ac5c8f93f46d3",
        measurementId: "G-1TN3T983MW"
    };
	*/
	return firebaseConfig;
}

function make(){
	var uid;
	var first_name;
	var last_name;
	var email;
	var locale;
	var profile_picture;
	var tours;
	var embeddings;
	
	return postdata;
}

document.getElementById("currentTime").value = new Date().toISOString().slice(0,16);
