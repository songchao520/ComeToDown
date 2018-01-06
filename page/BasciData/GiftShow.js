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
	var gifshowData = '';
	
	$.post(cometodown_url+"/getGiftSheetsCount",{loginId:cometodown_loginId},function(data){
		var data =data.data;
		if(data != "wdl"){
				
			maxlength = data;
			gifshowList();
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
			$.post(cometodown_url+"/getGiftSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					
						
					maxlength = data;
					gifshowList();
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
	//修改数字
	$(document).on("dblclick",".clickthis",function(){
		var showText = $(this).text();
		$(this).html('<input type="text" />');
		$(this).children("input").focus().val(showText);
		$(this).children("input").blur(function(){
			var updateText = $(this).val();
			if(showText == updateText){
				layer.msg("你并未做修改");
				$(this).parent().html(showText);
			}else if(updateText == ""){
				layer.msg("不能为空");
				$(this).focus();
			}else{
				var shux = $(this).parent().attr("shux");
				var recid = $(this).parent().attr("recid");
				if(shux == "giftMoney"){
					var r = /^\+?[0-9][0-9]*$/;
					if(!r.test(updateText)){
				        layer.msg("请输入非负整数!");
				        $(this).focus();
				        return false;
				    }
				}
				var data = new Object();
				data["loginId"] = cometodown_loginId;
				data["recid"] = recid;			
				data[shux] = updateText;
				$.post(cometodown_url+"/UpdateGiftSheet",data,function(data){
					var data =data.data;
					if(data != "wdl"){
						layer.msg("修改成功");
							
						
					}else{
						alertLoginMsg()
						
					}
				})
				$(this).parent().html(updateText);
			}
		})
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
		    	+  '<td class="clickthis" shux="giftName" recid="'+currData[i].recid+'">'+currData[i].giftName+'</td>'
		    	+  '<td class="clickthis" shux="giftMoney" recid="'+currData[i].recid+'">'+currData[i].giftMoney+'</td>'
		    	+  '<td>'+currData[i].createTime+'</td>'
		    	+  '<td class="thisimg" shux="giftPath"><img src="'+cometodown_url+"/"+currData[i].giftPath+'" style="width:30px;"></td>'		    	
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="是|否" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'"></td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="6">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getAnchorImgData(){
		if(msg == "all"){
			$.post(cometodown_url+"/getGiftSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					gifshowData = data;
					$(".gifshow_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getGiftSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					gifshowData = data;
					$(".gifshow_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function gifshowList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			gifshowData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getAnchorImgData();
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
		$.post(cometodown_url+"/UpdateGiftSheet",{loginId:cometodown_loginId,recid:recid,isShow:checkint},function(data){
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