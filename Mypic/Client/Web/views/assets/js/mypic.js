function mypic_init(){
	console.log("mypic init");
};
var getCookie = function(name) {
	console.log("mypic getCookie");
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
};

$(function(){
	mypic_init();
	console.log("Cookie : ", getCookie("uid"));
	$("#signin_btn").click(function(){
		$("#login_form").slideToggle();
	});
	$("#login_btn").click(function(){
		var formData = $("#login_form").serialize();
		console.log("DATA : ",formData);
		$.ajax({
			type : "POST",
			url : "/user/create",
			data : formData,
			success : function(res){
				if(res.result == "success"){
					console.log("success");
				}else{
					console.log("fail");
				}
			}
		});
	});
});
