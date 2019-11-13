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
function update_tour_images(db, uid, tour_name){
	db.collection("Tour").doc(tour_name).get().then(function(doc){
		var map = {}
		for(var j=0; j<doc.data().images.length; j++)
			map[doc.data().images[j]] = 0.99
		db.collection("User").doc(uid).collection("MyTour").doc(tour_name).update({
			myImages : map
		}).then(function(){
			console.log("Success !");
		}).catch(function(error){
			console.log("Error : ", error);
		});
	}).catch(function(error){
		console.log("Error : ", error);
	});
};
app.post("/test_button", function(req, res){
	console.log("Test Button is clicked. UID : ", req.cookies.uid);
	uid = req.cookies.uid;
	temp = []
	db.collection("User").doc(uid).get().then(function(doc){
		user_tour_lists = doc.data().tour;
		//console.log(user_tour_lists);
		//console.log(JSON.stringify(user_tour_lists));
		temp = JSON.stringify(user_tour_lists).split(",")
		length = temp.length
		//console.log(length)
		for(var i=0; i<length; i++){
			tour_name = temp[i].split('"')[1]
			update_tour_images(db, uid, tour_name)
			console.log("Tour_name1 : ", tour_name)
			/*db.collection("Tour").doc(tour_name).get().then(function(doc){
				console.log(i)
				console.log(temp[i])
				var map = {};
				for(var j=0; j<doc.data().images.length; j++)
					map[doc.data().images[j]] = 0.99
				console.log("Map : ",map)
				console.log("Tour_name : ", tour_name)
			}).catch(function(error){
				console.log("Error : ",error);
			});*/
		}
	}).catch(function(error){
		console.log("Error : ",error);
		res.send({result : "fail"})
	});
	res.send({result : "success"})
});
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
		db.collection("User").doc(uid).get().then(function(doc){
			user_tour_lists = doc.data().tour;
			temp = JSON.stringify(user_tour_lists).split(",")
			length = temp.length
			for(var i=0; i<length; i++){
				tour_name = temp[i].split('"')[1]
				db.collection("User").doc(uid).collection("MyTour").doc(tour_name).set({
					myImages : null,
					thisRef : db.collection("User").doc(uid),
					tourRef : db.collection("Tour").doc(tour_name)
				}).then(function(){
					console.log("Success!")
				}).catch(function(error){
					console.log("Error : ",error)
				});
			}
		}).catch(function(error){
			console.log("Error : ",error);
		});
		console.log("Success");
		db.collection("User").doc(uid).get().then(function(doc){
			if(doc.exists) 
				console.log(doc.data());
			else
				console.log("Doesn't exist user... maybe error.");
		}).catch(function(error){
			console.log("Error : ",error);
		});
		res.cookie("token", token);
		res.cookie("uid", uid);
		res.cookie("url", photo);
		res.send({result : "success", uid:uid});
	}).catch(function(error){
		console.error("Error : ",error);
	});
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
