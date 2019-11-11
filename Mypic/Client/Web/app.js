const hostname = '192.168.1.142';
const port = 4000;

var http = require('http');
var express = require('express');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('views/assets'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());
/* Date */
require("date-utils");

/* GOOGLE START*/
var firebase_app = require('firebase/app');
var firebase_auth = require('firebase/auth');
var firebase_db = require('firebase/database');
var firebase_store = require('firebase/firestore');
var firebase_storage = require('firebase/storage');

function config(){
	console.log("config");
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
	return firebaseConfig;
};
firebaseConfig = config();
firebase_app.initializeApp(firebaseConfig);
var db = firebase_app.firestore();
var storage = firebase_app.storage();

app.get('/test', function(req, res) {
	console.log("test.html");
	var storageRef = storage.refFromURL();
	storageRef.child("images/sea.jpg").getDownloadURL().then(function(url) {
		/*var xhr = new XMLHttpRequesst()
		xhr.responseType = 'blob';
		xhr.onload = function(event){
			var blob = xhr.response;
		};
		xhr.open('GET', url);
		xhr.send();*/
		var img = document.getElemnetById("tests");
		img.src = url;
	}).catch(function(error){
		console.log("Error : ",error);
	});
	/*var storageRef = storage.ref();
	var seafRef = storageRef("images/sea.jpg")
	//console.log(storageRef.child("images"));
	storageRef.putString("asdfasdf", 'base64').then(function(a) {
		console.log("up");
	});*/
	/*var url = path.child("images/sea.jpg").getDownloadURL()
	.then(function(url) {
		console.log("url : ", url);
	}).catch(function(error) {
		console.log("Error : ",error);
	});*/
	/*path.put("aa").then(function(){
		console.log("success");
	}).catch(function(error) {
		console.log("Error : ",error);
	});*/
	/*fs.readFile("./views/assets/images/avatar.jpg", function(error, data) {	
	});*/
	res.render("test");
});

/* PYTHON SHEEL */
var PythonShell = require("python-shell");
var options = {
	mode: 'text',
	pythonPath: '',
	pythonOptions: ['-u'],
	scriptPath: './.',
};

/* Create User Account */
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
app.post('/user/create', function(req, res){
	token = req.body.token;
	email = req.body.email;
	name = req.body.name;
	uid = req.body.uid;
	photo = req.body.photo;
	var newDate = new Date();
	var time = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
	console.log(time);
	db.collection("User").doc(uid).set({
		first_name : name[1]+name[2],
		last_name : name[0],
		locale : "ko",
		gmail : email,
		profile_picture : photo,
		tour : ["jaepiltour", "test_tour1", "test_tour2"],
		last_logged_in : time,
		timestamp : time
	}).then(function(){
		console.log("success");
		db.collection("User").doc(uid).get().then(function(doc){
			if(doc.exists) {
				console.log(doc.data());
			}else{
				console.log("??");
			}
		}).catch(function(error){
			console.log("Error : ",error);
		});
	}).catch(function(error){
		console.error("Error : ",error);
	});
	res.send({result : "success"});
});

app.get('/', function(req, res) {
	console.log("index.html");	
	res.render('index');
});
app.get('/index', function(req, res) {
	console.log("index.html");	
	res.render('index');
});

app.get('/explain', function(req, res) {
	console.log("explain.html");
	res.render('explain');
});

app.get('/client', function(req, res) {
	console.log("client.html");
	res.render('client');
});

app.get('/profile', function(req, res) {
	console.log("profile.html");
	res.render('profile');
});

app.get('/travel_load', function(req, res){
	console.log("travel_load");
	//connect with firebase and then load whole travel list of user's
	res.send({result:"fail"});
});
app.get('/travel', function(req, res) {
	console.log("travel.html");
	res.render('travel');
});

app.get('/search', function(req, res) {
	console.log("search.html");
	res.render('search');
});

app.listen(port, hostname, function() {
	console.log("Server is ready on "+hostname+" "+port);
});

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
