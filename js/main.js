layui.config({
	base : "js/"
}).use(['form','element','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		element = layui.element(),
		$ = layui.jquery;
	
	

						
	$(".panel a").on("click",function(){
		window.parent.addTab($(this));
	})
	
	//动态获取文章总数和待审核文章数量,最新文章
	/*$.get("../../json/newsList.json",
		function(data){

			//加载最新文章
			var hotNewsHtml = '';
			for(var i=0;i<5;i++){
				hotNewsHtml += '<tr>'
		    	+'<td align="left">'+data[i].newsName+'</td>'
		    	+'<td>'+data[i].newsTime+'</td>'
		    	+'</tr>';
			}
			$(".hot_news").html(hotNewsHtml);
		}
	)*/
	//订单显示
	$.post(cometodown_url+"/getOrderSheets",{loginId:cometodown_loginId},function(data){
		var data = data.data;
		var maxnum = 5;
		if(data.length<maxnum){
			maxnum = data.length;
		}
		var hotNewsHtml = '';
		for(var i=0;i<maxnum;i++){

			hotNewsHtml += '<tr class="mainClicktr" recid="'+data[i].recid+'">'
	    	+'<td align="left">用户：'+data[i].userLoginname+'->主播：'+data[i].anchorLoginname+' 金额：'+data[i].tipAnchor+'</td>'
	    	+'<td style="width:150px;">'+newdate+'</td>'
	    	+'</tr>';
		}
		$(".hot_news").html(hotNewsHtml);
	})
	//首页订单点击事件
	$(document).on("click",".mainClicktr",function(){
		var recid = $(this).attr("recid");
		$.post(cometodown_url+"/getOrderSheets",{loginId:cometodown_loginId,recid:recid},function(data){
			if(data  != "wdl"){
				var dataobj = data.data[0];
				var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';
				innerhtml = innerhtml+'<div class="layui-row">用户名称：'+dataobj["userLoginname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">订单状态：'+dataobj["orderStatusname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">开始时间：'+dataobj["startTime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">结束时间：'+dataobj["endTime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">下单时间：'+dataobj["purchaseTime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">已用时间：'+dataobj["useTime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">订单价格：'+dataobj["tipAnchor"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">订单评分：'+dataobj["orderScore"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">创建时间：'+dataobj["createTime"]+'</div>';	
				innerhtml = innerhtml+'<div class="layui-row">主播昵称：'+dataobj["anchorShowname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">主播登录：'+dataobj["anchorLoginname"]+'</div>';
				innerhtml = innerhtml+"</div>";
				
				layer.open({
				  type: 1,
				  skin: 'layui-layer-demo', //样式类名
				  closeBtn: 1, //不显示关闭按钮
				  anim: 2,
				  shadeClose: true, //开启遮罩关闭
				  content: innerhtml
				});
				
			}else{
				alertLoginMsg();
			}
			

		})
	})
	
	//今日订单
	$.post(cometodown_url+"/getOrderSheetsCount",{loginId:cometodown_loginId,createTime:newdate},function(data){
		if(data != "wdl"){
				
			$(".addOrders span").text(data.data);
		}
	})
	//订单总数
	$.post(cometodown_url+"/getOrderSheetsCount",{loginId:cometodown_loginId},function(data){
		if(data != "wdl"){
				
			$(".allOrders span").text(data.data);
		}
	})
	

	//新增客户
	$.post(cometodown_url+"/getUserSheetsCount",{loginId:cometodown_loginId,userCreatetime:newdate},function(data){
		if(data != "wdl"){
				
			$(".addUser span").text(data.data);
		}
	})
	/*$.get("../../json/usersList.json",
		function(data){
			$(".addUser span").text(2);
		}
	)*/
	//新增主播
	$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId,createTime:newdate},function(data){
		if(data != "wdl"){
				
			$(".addAnchor span").text(data.data);
		}
	})
	/*$.get("../../json/usersList.json",
		function(data){
			$(".userAll span").text(data.length);
		}
	)*/
	
	//主播总数
	$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId},function(data){
		if(data != "wdl"){
				
			$(".AllAnchor span").text(data.data);
		}
	})
	/*$.get("../../json/images.json",
		function(data){
			$(".addDriver span").text(data.length);
		}
	)*/

	//要审核消息
	$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,examineStatus:2},function(data){
		if(data != "wdl"){
			$(".newMessage span").text(data.data);
		}
	})
	/*$.get("../../json/message.json",
		function(data){
			$(".newMessage span").text(data.length);
		}
	)*/
	//内部公告
	$.post(cometodown_url+"/getPushActivitys",{loginId:cometodown_loginId,source:4},function(data){
		var data = data.data;
		if(data != "wdl"){
			if(data.length != 0){
				$("#noticeNeibu").html(data[0]["messageContent"]);
			}
			
		}
	})
	//版本更新
	$.post(cometodown_url+"/getPushActivitys",{loginId:cometodown_loginId,source:3},function(data){
		var data = data.data;
		if(data != "wdl"){
			if(data.length != 0){
				$("#noticeBanben").html(data[0]["messageContent"]);
			}
			
		}
	})

	//数字格式化
	$(".panel span").each(function(){
		$(this).html($(this).text()>9999 ? ($(this).text()/10000).toFixed(2) + "<em>万</em>" : $(this).text());	
	})

	//系统基本参数
	if(window.sessionStorage.getItem("systemParameter")){
		var systemParameter = JSON.parse(window.sessionStorage.getItem("systemParameter"));
		fillParameter(systemParameter);
	}else{
		$.ajax({
			url : "../../json/systemParameter.json",
			type : "get",
			dataType : "json",
			success : function(data){
				fillParameter(data);
			}
		})
	}

	//填充数据方法
 	function fillParameter(data){
 		//判断字段数据是否存在
 		function nullData(data){
 			if(data == '' || data == "undefined"){
 				return "未定义";
 			}else{
 				return data;
 			}
 		}
		$(".homePage").text(nullData(data.homePage));    //网站首页
		$(".server").text(nullData(data.server));        //服务器环境
		$(".dataBase").text(nullData(data.dataBase));    //数据库版本
		$(".maxUpload").text(nullData(data.maxUpload));    //最大上传限制
		$(".userRights").text(nullData(data.userRights));//当前用户权限
 	}
 	

})
