function fire_init(){
	console.log("fire init");
};

function getCookie(name){
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
};

function GoogleSign(){
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

function URL_TO_BLOB(url) {
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
};

function Upload(storageRef, uid, file, num_of_files){
	console.log(uid);
	var reader = new FileReader();
	i=0;
	uris = []
	db = firebase.firestore();
	reader.onload = function(f) {
		var metadata = { contentType : file.type, };
		var filename = file.name;
		URL_TO_BLOB(f.target.result).then(function(BLOB) {
			var path = "user_images/"+uid+"/"+filename;
			//var path = "tour_images/test_tour3/"+filename;
			var uploadTask = storageRef.child(path).put(BLOB, metadata).then(function(){
				storageRef.child(path).getDownloadURL().then(function(url){
					i+=1
					uris.push(url)
					if(i==num_of_files){
						db.collection("User").doc(uid).update({
							uris : uris
						});
					}
				}).catch(function(error){
					console.log("Error : ",error);
				});
			});
		});
	};
	reader.readAsDataURL(file);
};

function ReadURL(uid, input) {
	//We can parse "lastModifiedData, name, size, type"

	var storageRef = firebase.storage().ref();
	console.log(input.files.length)
	num_of_files = input.files.length;
	if(input.files){
		for(var i=0; i<num_of_files; i++){
			if(input.files[i]){
				Upload(storageRef, uid, input.files[i], num_of_files);
			} else{
				console.log("File isn't exist !");
			}
		}
	};
};

function Download(uid){
	console.log(uid);
	var storageRef = firebase.storage().ref();
	var from_tour = "tour_images/"
	var from_user = "user_images/"+uid
	storageRef.child(from_user).listAll().then(function(list){	
		list.items.forEach(function(foref) {
			var path = "user_images/"+uid+"/"+foref.name;
			var imageRef = storageRef.child(path);
			cnt = 0;
			imageRef.getDownloadURL().then(function(url) {
				var img = document.createElement('img');
				var div = document.createElement('div');
				img.id = "test_img"+cnt
				img.name = "test_img"+cnt
				img.src = url
				cnt+=1;
				div.appendChild(img);
				//document.getElementById("test_thumb").appendChild(div);
				document.getElementById("thumbnails").appendChild(div);
			}).catch(function(error) {
				console.log("Error : ",error);
			});
		});
		
	}).catch(function(error){
		console.log("Error : ",error);
	});
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
	var uid = getCookie("uid");
	$("#test_btn1").click(function(){
		GoogleSign();
		console.log("sign ok")
	});
	$("#test_btn2").click(function(){
		Upload(uid);
		console.log("storage up")
	});
	$("#test_btn3").click(function(){
		Download(uid);
		console.log("storage src")
	});
	$("#travel_load").click(function(){
		Download(uid);
		console.log("storage src")
	});
});
