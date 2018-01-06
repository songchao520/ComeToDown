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
	var msg = "all";
	var pushActivityData = '';
	
	$.post(cometodown_url+"/getPushActivitysCount",{loginId:cometodown_loginId},function(data){
		var data =data.data;
		if(data != "wdl"){
				
			maxlength = data;
			pushActivityList();
		}else{
			alertLoginMsg()
			
		}
	})
		
		
	
	//查询
	$(".search_btn").click(function(){
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
           	msg = "allcxtj";
			$.post(cometodown_url+"/getPushActivitysCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					
						
					maxlength = data;
					pushActivityList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
            
		}else{
			layer.msg("请输入需要查询的内容");
		}
	})
	//添加活动
	$(".addNotice").click(function(){
		var index = layui.layer.open({
			title : "添加活动",
			type : 2,
			content : "addPushActivity.html?msg=false",

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})
	$(document).on("click",".pushActivity_update",function(){
		var _this = $(this);
		var recid = _this.attr("recid");
		
		var index = layui.layer.open({
			title : "修改活动",
			type : 2,
			content : "addPushActivity.html?msg="+recid,

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})

    //全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
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
	//刷新页面
	$("#shuaxin").click(function(){
		getPushActivityData();
	})
	//渲染数据
	function renderDate(data,curr){
		var dataHtml = '';
		var currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				var flag;
				if(currData[i].isShow == 1){
					flag = "checked"
				}else{
					flag = ""
				}
				var sources = "";
				if(currData[i].source == 1){
					sources = "启动预告"
				}else if(currData[i].source == 2){
					sources = "活动"
				}else if(currData[i].source == 3){
					sources = "版本更新"
				}else if(currData[i].source == 4){
					sources = "内部公告"
				}
				var userTypes = "";
				if(currData[i].userType == 0){
					userTypes = "主播用户"
				}else if(currData[i].userType == 1){
					userTypes = "用户"
				}else if(currData[i].userType == 2){
					userTypes = "主播"
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].activityHttp+'</td>'
		    	+  '<td>'+currData[i].messageTitle+'</td>'
		    	+  '<td>'+currData[i].messageContent+'</td>'
		    	+  '<td>'+currData[i].author+'</td>'
		    	+  '<td>'+currData[i].createTime+'</td>'
		    	+  '<td>'+sources+'</td>'
		    	+  '<td class="thisimg"><img src="'+cometodown_url+"/"+currData[i].relevantImg+'" style="width:30px;"></td>'
		    	+  '<td>'+userTypes+'</td>'
		    	+  '<td>'+currData[i].startTime+'</td>'
		    	+  '<td>'+currData[i].endTime+'</td>'
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="否|是" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'"></td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini pushActivity_update" index="'+i+'" recid="'+currData[i].recid+'"><i class="layui-icon">&#xe60a;</i> 修改</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="13">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getPushActivityData(){
		if(msg == "all"){
			$.post(cometodown_url+"/getPushActivitys",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					pushActivityData = data;
					$(".pushActivity_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getPushActivitys",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					pushActivityData = data;
					$(".pushActivity_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function pushActivityList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			pushActivityData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getPushActivityData();
			}
		})
	}
	
	//是否禁用
	form.on('switch(isDisable)', function(data){
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
		var recid = $(this).attr("recid");
		var checkint = 0;
		if($(this).is(':checked')) {
		    checkint = 1;
		}
		$.post(cometodown_url+"/UpdatePushActivity",{loginId:cometodown_loginId,recid:recid,isShow:checkint},function(data){
			if(data != "wdl"){
					
				 layer.close(index);
				 if(checkint == 1){
				 	layer.msg("显示成功！");
				 }else{
				 	layer.msg("隐藏成功！");
				 }
			
			}else{
				alertLoginMsg()
				
			}
		})
	    /*setTimeout(function(){
	        layer.close(index);
			layer.msg("展示状态修改成功！");
	    },500);*/
	})
    
})