var $;
layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage;
		$ = layui.jquery;
	$.post(cometodown_url+"/getUserTypes",{loginId:cometodown_loginId},function(data){
		if(data.data != "wdl"){
				
			var datas = data.data;
			var html;
			for(var i in datas){
				if(datas[i].recid == 1 || datas[i].recid ==2 || datas[i].recid ==6){
					continue;
				}else{
					html = html + '<option value="'+datas[i].recid+'">'+datas[i].usertypeName+'</option>'
					
				}
			}
			
			$("#utypeRecid").html(html)
			form.render();
		}else{
			alertLoginMsg()
			
		}
	})
 	var recid = GetQueryString("msg");
	if(recid.toString() != "add"){
		$.post(cometodown_url+"/getAdminUsers",{loginId:cometodown_loginId,recid:recid},function(data){
			if(data.data != "wdl"){
				var data = data.data;
				for(var i in data[0]){
					$("#"+i).val(data[0][i]);
					
				}
				setTimeout(function(){
					form.render();
				},150)
			    
		 		
			}else{
				alertLoginMsg()
				
			}
			
		})
	}
 	
 	$("#loginname").blur(function(){
 		var loginname = $("#loginname").val();
 		$.post(cometodown_url+"/AdminLoginNameVerification",{loginId:cometodown_loginId,loginname:loginname},function(data){
 			
			if(data.data != "wdl"){
				if(!data.data){
					layer.msg("登录名重复，请重新填入！")
					$("#loginname").focus();
				}
			}else{
				alertLoginMsg()
				
			}
			
		})
 	});
 	form.on("submit(addUser)",function(data){
 		
		var loginname = $("#adminLoginname").val();
		var uname = $("#adminShowname").val();
		var mobilephone = $("#adminPhone").val();
		var tencent = $("#adminTencent").val();
		var username = $("#adminUsername").val();
		var adminId = $("#adminId").val();
		var utyperecid = $("#utypeRecid").val();
		var data = {loginId:cometodown_loginId,adminLoginname:loginname,adminPasswrod:loginname,adminShowname:uname,utypeRecid:utyperecid,adminPhone:mobilephone,adminTencent:tencent,adminUsername:username,adminId:adminId}
		var srcurl = "saveAdminUser";
		if(recid!="add"){
			srcurl = "UpdateAdminUser";
			data["recid"] = recid;
		}
		
		$.post(cometodown_url+"/"+srcurl,data,function(data){
			if(data != "wdl"){
				top.layer.msg(data.msg);
				layer.closeAll("iframe");
		 		//刷新父页面
		 		var thisdiv = parent.document.getElementById("shuaxin");
		 		$(thisdiv).click();
			}else{
				alertLoginMsg()
				
			}
			
		})
        return false;
 	})
	
})

//格式化时间
function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    var miao = _time.getSeconds()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+miao;
}
