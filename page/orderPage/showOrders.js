layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
		pagesize = cometodown_pagesize;
		currpage = 1;
		maxlength = 0;
	//加载页面数据
	var msg = GetQueryString("msg");
	var ordersheetData = '';
	if(msg == "add"){
		$.post(cometodown_url+"/getOrderSheetsCount",{loginId:cometodown_loginId,createTime:newdate},function(data){
			var data =data.data;
			if(data != "wdl"){
					
				maxlength = data;
				ordersheetList();
			}else{
				alertLoginMsg()
				
			}
		})
	}else if(msg == "all"){
		$.post(cometodown_url+"/getOrderSheetsCount",{loginId:cometodown_loginId},function(data){
			var data =data.data;
			if(data != "wdl"){
					
				maxlength = data;
				ordersheetList();
			}else{
				alertLoginMsg()
				
			}
		})
	}
	
		
		
	
	//查询
	$(".search_btn").click(function(){
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
           	if(msg == "add" || msg == "addcxtj"){
				msg = "addcxtj";
				$.post(cometodown_url+"/getOrderSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,createTime:newdate},function(data){
					var data =data.data;
					if(data != "wdl"){
						
							
						maxlength = data;
						ordersheetList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
           	}else if(msg == "all" || msg == "allcxtj"){
           		msg = "allcxtj";
				$.post(cometodown_url+"/getOrderSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
					var data =data.data;
					if(data != "wdl"){
						
							
						maxlength = data;
						ordersheetList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
           	}
           	
			
            
		}else{
			layer.msg("请输入需要查询的内容");
		}
	})

    //全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="status"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="status"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="status"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})

	//操作
	$("body").on("click",".ordersheet_details",function(){
		var index = $(this).attr("index");
		var dataobj = ordersheetData[index];
		var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';
		innerhtml = innerhtml+'<div class="layui-row">用户名称：'+dataobj["userLoginname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">订单状态：'+dataobj["orderStatusname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">开始时间：'+dataobj["startTime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">结束时间：'+dataobj["endTime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">下单时间：'+dataobj["purchaseTime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">总共时长：'+dataobj["purchaseTime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">已用时间：'+dataobj["useTime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">订单价格：'+dataobj["tipAnchor"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">订单评分：'+dataobj["orderScore"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">创建时间：'+dataobj["createTime"]+'</div>';	
		innerhtml = innerhtml+'<div class="layui-row">主播昵称：'+dataobj["anchorShowname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">主播登录：'+dataobj["anchorLoginname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">订单评价：'+dataobj["orderEvaluate"]+'</div>';
		
		innerhtml = innerhtml+"</div>";
		
		layer.open({
		  type: 1,
		  skin: 'layui-layer-demo', //样式类名
		  closeBtn: 1, //不显示关闭按钮
		  anim: 2,
		  shadeClose: true, //开启遮罩关闭
		  content: innerhtml
		});
	})
	//用户详情
	$("body").on("click",".thisuser",function(){
		var recid = $(this).attr("userrecid")
		$.post(cometodown_url+"/getUserSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,recid:recid},function(data){
			var data =data.data;
			if(data != "wdl"){
				var dataobj = data[0];
				var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';
				innerhtml = innerhtml+'<div class="layui-row">用户名称：'+dataobj["userLoginname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">用户昵称：'+dataobj["userShowname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">用户备注：'+dataobj["userRemarks"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">创建时间：'+dataobj["userCreatetime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">登录时间：'+dataobj["userLasttime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">登录地址：'+dataobj["userLastaddress"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">会员等级：'+dataobj["userVip"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">财富余额：'+dataobj["wealthAmount"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">财富等级：'+dataobj["wealthGrade"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">用户电话：'+dataobj["userMobilephone"]+'</div>';	
				innerhtml = innerhtml+'<div class="layui-row">定位城市：'+dataobj["userCity"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">标签  一：'+dataobj["labelNameOne"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">标签  二：'+dataobj["labelNameTwo"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">标签  三：'+dataobj["labelNameThree"]+'</div>';
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
				alertLoginMsg()
				
			}
		})
	})
	//主播详情
	$("body").on("click",".thisanchor",function(){
		var recid = $(this).attr("userrecid")
		$.post(cometodown_url+"/getUserSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,recid:recid},function(data){
			var data =data.data;
			if(data != "wdl"){
				var dataobj = data[0];
				var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';
				innerhtml = innerhtml+'<div class="layui-row">主播名称：'+dataobj["userLoginname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">主播昵称：'+dataobj["userShowname"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">主播备注：'+dataobj["userRemarks"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">创建时间：'+dataobj["userCreatetime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">登录时间：'+dataobj["userLasttime"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">登录地址：'+dataobj["userLastaddress"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">会员等级：'+dataobj["userVip"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">主播余额：'+dataobj["wealthAmount"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">财富等级：'+dataobj["wealthGrade"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">主播电话：'+dataobj["userMobilephone"]+'</div>';	
				innerhtml = innerhtml+'<div class="layui-row">定位城市：'+dataobj["userCity"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">标签  一：'+dataobj["labelNameOne"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">标签  二：'+dataobj["labelNameTwo"]+'</div>';
				innerhtml = innerhtml+'<div class="layui-row">标签  三：'+dataobj["labelNameThree"]+'</div>';
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
				alertLoginMsg()
				
			}
		})
	})

	$(document).on("click",".thisimg",function(){
		var src = $(this).children("img").attr("src");

		layer.open({
			type:1,
			title:"图片详情，可拉伸",
			area: ['420px'], //宽高
			shadeClose:true,
			skin: 'layui-layer-demo', //样式类名
		    content: '<div style="padding:10px"><img src="'+src+'" style="width:100%;"></div>' //格式见API文档手册页
		});
	})
	//渲染数据
	function renderDate(data,curr){
		var dataHtml = '';
		var currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].startTime+'</td>'
		    	+  '<td>'+currData[i].endTime+'</td>'
		    	+  '<td>'+currData[i].createTime+'</td>'
		    	+  '<td>'+currData[i].purchaseTime+'</td>'
		    	+  '<td>'+currData[i].useTime+'</td>'
		    	+  '<td>'+currData[i].orderScore+'</td>'
		    	+  '<td>'+currData[i].tipAnchor+'</td>'
		    	+  '<td>'+currData[i].orderStatusname+'</td>'
		    	+  '<td>'+currData[i].anchorShowname+'</td>'
		    	+  '<td class="gaoliangtd thisuser" userrecid="'+currData[i].userRecid+'"  >'+currData[i].userLoginname+'</td>'
		    	+  '<td class="gaoliangtd thisanchor" userrecid="'+currData[i].anchorUser+'" anchorrecid="'+currData[i].anchorRecid+'"  >'+currData[i].anchorLoginname+'</td>'
		    	+  '<td>'
				+ 	 '<a class="layui-btn layui-btn-mini ordersheet_details" index="'+i+'"><i class="layui-icon">&#xe60a;</i> 查看详情</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="13">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getOrderSheetData(){
		var selectStr = $(".search_input").val();
		if(msg == "add"){
			$.post(cometodown_url+"/getOrderSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,createTime:newdate},function(data){
				var data =data.data;
				if(data != "wdl"){
					ordersheetData = data;
					$(".ordersheet_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "addcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getOrderSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,createTime:newdate},function(data){
				var data =data.data;
				if(data != "wdl"){
					ordersheetData = data;
					$(".ordersheet_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "all"){
			$.post(cometodown_url+"/getOrderSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					ordersheetData = data;
					$(".ordersheet_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			
			$.post(cometodown_url+"/getOrderSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					ordersheetData = data;
					$(".ordersheet_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function ordersheetList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			ordersheetData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getOrderSheetData();
			}
		})
	}
	

        
})