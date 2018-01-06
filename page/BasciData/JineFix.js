var $;
layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		layedit = layui.layedit,
		laypage = layui.laypage,
		$ = layui.jquery;
	
	$.post(cometodown_url+"/getDataFixeds",{loginId:cometodown_loginId},function(data){
		var data = data.data;
		if(data != "wdl"){
			//$("#imgsrcshow").attr("src",cometodown_url+data[0]["relevanting"]);
			$("#showtextone").val(data[0].minMoney);
			$("#showtexttwo").val(data[0].moneyExchange);
		   // form.render();
	 		
		}else{
			alertLoginMsg() 
			
		}
		
	})

	$(".showtextone").click(function(){
		var showtextone = $("#showtextone").val();
		if(showtextone==""){
			layer.msg("请输入值");
			return false;
		}
		$.post(cometodown_url+"/UpdateDataFixed",{loginId:cometodown_loginId,minMoney:showtextone,recid:1},function(data){
			
			if(data.data != "wdl"){
				layer.msg(data.msg);
			}else{
				alertLoginMsg()
				
			}
			
		})
	});
	$(".showtexttwo").click(function(){
		var showtexttwo = $("#showtexttwo").val();
		if(showtextone==""){
			layer.msg("请输入值");
			return false;
		}
		$.post(cometodown_url+"/UpdateDataFixed",{loginId:cometodown_loginId,moneyExchange:showtexttwo,recid:1},function(data){
			if(data.data != "wdl"){
				layer.msg(data.msg);
		 		
			}else{
				alertLoginMsg()
				
			}
			
		})
	});

 	

	
})

