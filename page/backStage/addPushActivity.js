var $;
layui.config({
	base : "js/"
}).use(['form','layer','jquery','layedit','laydate'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		layedit = layui.layedit,
		laypage = layui.laypage,
		laydate = layui.laydate,
		$ = layui.jquery;
		var editIndex;
		
		var recid = GetQueryString("msg");
		if(recid.toString() != "false"){
			$.post(cometodown_url+"/getPushActivitys",{loginId:cometodown_loginId,recid:recid},function(data){
				var data  = data.data;
				if(data != "wdl"){
					$("#imgsrcshow").attr("src",cometodown_url+data[0]["relevantImg"]);
					delete data[0]["relevantImg"];
					$("#messageContent").html(data[0]["messageContent"]);
					delete data[0]["messageContent"];
					$("#selectSource").val(data[0]["source"]);
					$("#selectUserType").val(data[0]["userType"]);
					for(var i in data[0]){
						$("#"+i).val(data[0][i]);
						
					}
					editIndex = layedit.build('messageContent',{
				        height:100,
				        hideTool:['image']
				    });
				    form.render();
			 		
				}else{
					alertLoginMsg()
					
				}
				
			})
		}else{
			editIndex = layedit.build('content',{
		        height:100,
		        hideTool:['image']
		    });
		}
	
 	form.on("submit(addnotice)",function(data){
 		if(layedit.getContent(editIndex) != ''){
 			
 		}else{
 			layer.msg("请输入内容");
 			return false;
 		}
 		var activityHttp = $("#activityHttp").val();
		var messageTitle = $("#messageTitle").val();
		var loginuser =JSON.parse(sessionStorage.getItem("cometodown_loginuser"));
		var author = loginuser["adminLoginname"];
		var adminRecid = loginuser["recid"];
    	if(author!=null && author!=""){
    		author = $("#author").val();
    	}
		var messageContent = layedit.getContent(editIndex);
		var source = $("#selectSource").val();
		var userType = $("#selectUserType").val();
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		
		if(recid.toString() == "false"){
 			$.post(cometodown_url+"/savePushActivity",{loginId:cometodown_loginId,messageTitle:messageTitle,author:author,adminRecid:adminRecid,source:source,messageContent:messageContent,userType:userType,startTime:startTime,endTime:endTime,activityHttp:activityHttp},function(data){
 				var data = data.data;
				if(data != "wdl"){
					if($("#imgsrc").val()!=null && $("#imgsrc").val()!=""){
						compressImages(data);
					}else{
						top.layer.msg("提交成功！");
						layer.closeAll("iframe");
						//刷新父页面
			 			var thisdiv = parent.document.getElementById("shuaxin");
		 				$(thisdiv).click();
					}
					
					
			 		
				}else{
					alertLoginMsg()
					
				}
				
			})
 		}else{
 			$.post(cometodown_url+"/UpdatePushActivity",{loginId:cometodown_loginId,messageTitle:messageTitle,author:author,adminRecid:adminRecid,source:source,messageContent:messageContent,userType:userType,startTime:startTime,endTime:endTime,recid:recid,activityHttp:activityHttp},function(data){
 				var data = data.data;
				if(data != "wdl"){
					if($("#imgsrc").val()!=null && $("#imgsrc").val()!=""){
						compressImages(recid);
					}else{
						top.layer.msg("提交成功！");
						layer.closeAll("iframe");
						//刷新父页面
			 			var thisdiv = parent.document.getElementById("shuaxin");
		 				$(thisdiv).click();
					}
					
					
			 		
				}else{
					alertLoginMsg()
					
				}
				
			})
 		}
		
        return false;
 	})
 	
 	
    $("#imgsrc").change(function () {
        $("#imgsrcshow").attr("src", getObjectURL(document.getElementById("imgsrc")));//将图片的src变为获取到的路径
    })


   function compressImages(recid){
		var files=null;
	    	
        var that = document.getElementById("imgsrcshow");
        //生成比例 
        var w = that.width,
            h = that.height,
            scale = w / h; 
            w = 100 || w;              //480  你想压缩到多大，改这里
            h = w / scale;

        //生成canvas
        var canvas = document.createElement('canvas');

        var ctx = canvas.getContext('2d');

        $(canvas).attr({width : w, height : h});

        ctx.drawImage(that, 0, 0, w, h);

        var base64 = canvas.toDataURL('image/jpg', 1);   //1最清晰，越低越模糊。弹出 base64 开头的一段 data：image/png;却是png。
//              alert(base64);      

       	files =base64;   // 把base64数据丢过去，上传要用。
       	
       	uploadImages(files,recid);
	        
	
	}
	function uploadImages(files,recid){
		var datas = files.substring(22);
		
		$.post({
				
			url: cometodown_url+"/UploadImages",
			data:{
					loginId:cometodown_loginId,
					images:datas,
					recid:recid,
					index:"activityImg"
			},			 
			success: function(data) {
				
				if(data.result == "success"){
					parent.layer.msg("提交成功！");
					layer.closeAll("iframe");
			 		//刷新父页面
			 		var thisdiv = parent.document.getElementById("shuaxin");
		 			$(thisdiv).click();
				}else if(data == "wdl"){
					alertLoginMsg()
				}else{

				}
				
			},
			error: function(xhr, type, errorThrown) { 
				layer.msg("网络及其他原因");
				
				console.log(errorThrown);
			}
		
		})
	}
	
})


 function getObjectURL(node) {
    var imgURL = "";
    try {
        var file = null;
        if (node.files && node.files[0]) {
            file = node.files[0];
        } else if (node.files && node.files.item(0)) {
            file = node.files.item(0);
        }
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try {
            //Firefox7.0
            imgURL = file.getAsDataURL();
            //alert("//Firefox7.0"+imgRUL);
        } catch (e) {
            //Firefox8.0以上
            imgURL = window.URL.createObjectURL(file);
            //alert("//Firefox8.0以上"+imgRUL);
        }
    } catch (e) {      //这里不知道怎么处理了，如果是遨游的话会报这个异常
        //支持html5的浏览器,比如高版本的firefox、chrome、ie10
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }
    return imgURL;
}
 
