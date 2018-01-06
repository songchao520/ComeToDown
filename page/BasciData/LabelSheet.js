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
	var labelsheetData = '';
	
	$.post(cometodown_url+"/getLabelSheetsCount",{loginId:cometodown_loginId},function(data){
		var data =data.data;
		if(data != "wdl"){
				
			maxlength = data;
			labelsheetList();
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
			$.post(cometodown_url+"/getLabelSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					
						
					maxlength = data;
					labelsheetList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
            
		}else{
			layer.msg("请输入需要查询的内容");
		}
	})
	
	$(".labelsheet_add").click(function(){
		layer.prompt({title: '请输入标签名称，并确认', formType: 0,maxlength: 5}, function(pass, index){
			$.post(cometodown_url+"/saveLabelSheet",{loginId:cometodown_loginId,labelName:pass},function(data){
				var data =data.data;
				if(data != "wdl"){
					
					layer.msg('添加成功');	
					labelsheetList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
		    layer.close(index);
		 	
		});
	})
	$(document).on("click",".labelsheet_update",function(){
		var index = $(this).attr("index");
		var data = labelsheetData[index];
		layer.prompt({title: '请输入你要修改后的标签名称，并确认', formType: 0,value: data["labelName"],maxlength: 5}, function(pass, index){
			$.post(cometodown_url+"/UpdateLabelSheet",{loginId:cometodown_loginId,labelName:pass,recid:data["recid"]},function(data){
				var data =data.data;
				if(data != "wdl"){
					layer.msg('修改成功');	
					labelsheetList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
		    layer.close(index);
		 	
		});
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
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].labelName+'</td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini labelsheet_update" index="'+i+'"><i class="layui-icon">&#xe60a;</i> 修改</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="6">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getLabelSheetData(){
		if(msg == "all"){
			$.post(cometodown_url+"/getLabelSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					labelsheetData = data;
					$(".labelsheet_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getLabelSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					labelsheetData = data;
					$(".labelsheet_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function labelsheetList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			labelsheetData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getLabelSheetData();
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
		$.post(cometodown_url+"/UpdateLabelSheet",{loginId:cometodown_loginId,recid:recid,isShow:checkint},function(data){
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