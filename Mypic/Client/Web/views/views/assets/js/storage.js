function upload(){
	
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
	$("#test_btn1").click(function(){
		console.log("hihi")
	});
});
