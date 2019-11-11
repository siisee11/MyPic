function googlesign(){
	provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;
		$.ajax({
			type : "POST",
			url : "/user/create",
			data : {'token' : token, 'email' : user.email, 'name' : user.providerData[0].displayName, 'uid' : user.uid, 'photo' : user.photoURL},
			traditional : true,
			success : function(res){
				if(res.result == "success"){
					console.log("success! ", res.uid);
				}else{
					console.log("fail");
				}
			}
		});
		console.log("Token : ", token);
		console.log("User : ", user);
	}).catch(function(error){
		console.log("Error : ",error);
	});
};
function loadXHR(url) {
    return new Promise(function(resolve, reject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function() {reject("Network error.")};
            xhr.onload = function() {
                if (xhr.status === 200) {resolve(xhr.response)}
                else {reject("Loading error:" + xhr.statusText)}
            };
            xhr.send();
        }
        catch(err) {reject(err.message)}
    });
}

function storage(uid){
	console.log(uid);
	var storageRef = firebase.storage().ref();
	//const imagesRef = storageRef.child("images");
	//var filename = "sea.jpg";
	//var spaceRef = imagesRef.child(filename);
	//var path = spaceRef.fullPath;
	//var name = spaceRef.name;
	var metadata = {
		contentType : "image/jpg",
	};
	loadXHR("../images/bg.jpg").then(function(blob){
		var uploadTask = storageRef.child("images/jihye.jpg").put(blob, metadata);
	});
	//var imagesRef = spaceRef.parent;
	console.log(path);
	console.log(name);
	//console.log(imagesRef);
};

function src(uid){
	console.log(uid);
	var storageRef = firebase.storage().ref();
	var imageRef = storageRef.child("images/sea.jpg");
	imageRef.getDownloadURL().then(function(url) {
		console.log("URL : ", url);
		document.getElementById("tests").src = url;
	}).catch(function(error){
		console.log("Error", error);
	});
};

function getCookie(name){
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
};

function readURL(input) {
	var storageRef = firebase.storage().ref();
	var metadata = {
		contentType : "image/png",
	};
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#blah').attr('src', e.target.result);
			console.log(typeof(loadXHR(e.target.result)));
			loadXHR(e.target.result).then(function(blob){	
				var uploadTask = storageRef.child("images/jihye_test.jpg").put(blob, metadata);
			});
    	};
		reader.readAsDataURL(input.files[0]);
		console.log("::", input.files[0]);
	}
};

$(function(){
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
	firebase.initializeApp(firebaseConfig);
	uid = getCookie("uid");
	$("#test_btn1").click(function(){
		googlesign();
		console.log("sign ok")
	});
	$("#test_btn2").click(function(){
		storage(uid);
		console.log("storage up")
	});
	$("#test_btn3").click(function(){
		src(uid);
		console.log("storage src")
	});
});
