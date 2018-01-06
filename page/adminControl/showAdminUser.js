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
	var adminuserData = '';
	
	$.post(cometodown_url+"/getAdminUsersCount",{loginId:cometodown_loginId},function(data){
		var data =data.data;
		if(data != "wdl"){
				
			maxlength = data;
			adminuserList();
		}else{
			alertLoginMsg()
			
		}
	})
		
		//添加客服
	$("#add_adminuser").click(function(){
		var index = layui.layer.open({
			title : "添加后台用户",
			type : 2,
			content : "addAdminUser.html?msg=add",

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})
	$(document).on("click",".adminuser_update",function(){
		var recid = $(this).attr("recid");
		var index = layui.layer.open({
			title : "添加后台用户",
			type : 2,
			content : "addAdminUser.html?msg="+recid,

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})
	//查询
	$(".search_btn").click(function(){
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
           	msg = "allcxtj";
			$.post(cometodown_url+"/getAdminUsersCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					
						
					maxlength = data;
					adminuserList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
            
		}else{
			layer.msg("请输入需要查询的内容");
		}
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
	$("#shuaxin").click(function(){
		getAadminUserData();
	})
	//渲染数据
	function renderDate(data,curr){
		var dataHtml = '';
		var currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				if(currData[i].adminStatus == 0){
					flag = "checked"
				}else{
					flag = ""
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].adminLoginname+'</td>'
		    	+  '<td>'+currData[i].utypeName+'</td>'
		    	+  '<td>'+currData[i].adminShowname+'</td>'
		    	+  '<td>'+currData[i].adminPhone+'</td>'
		    	+  '<td>'+currData[i].adminTencent+'</td>'
		    	+  '<td>'+currData[i].adminUsername+'</td>'
		    	+  '<td>'+currData[i].adminId+'</td>'
		    	
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="否|是" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'"></td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini adminuser_update" index="'+i+'" recid="'+currData[i].recid+'"><i class="layui-icon">&#xe60a;</i> 修改</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getAadminUserData(){
		if(msg == "all"){
			$.post(cometodown_url+"/getAdminUsers",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					adminuserData = data;
					$(".admin_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getAdminUsers",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					adminuserData = data;
					$(".admin_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function adminuserList(that){
		
		//分页
		
		var nums = pagesize; //每页出现的数据量
		if(that){
			adminuserData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getAadminUserData();
			}
		})
	}
	
	//是否禁用
	form.on('switch(isDisable)', function(data){
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
		var recid = $(this).attr("recid");
		var checkint = 1;
		if($(this).is(':checked')) {
		    checkint = 0;
		}
		$.post(cometodown_url+"/UpdateAdminUser",{loginId:cometodown_loginId,recid:recid,adminStatus:checkint},function(data){
			if(data != "wdl"){
					
				 layer.close(index);
				 if(checkint == 0){
				 	layer.msg("解禁成功！");
				 }else{
				 	layer.msg("禁用成功！");
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