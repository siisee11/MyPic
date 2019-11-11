function mypic_init(){
	console.log("mypic");
};

mypic_init();
$(function(){
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
//document.getElementById("currentTime").value = new Date().toISOString().slice(0,16);
