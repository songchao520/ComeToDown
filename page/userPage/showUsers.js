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
	var anchorIngData = '';
	if(msg == "add"){
		$.post(cometodown_url+"/getUserSheetsCount",{loginId:cometodown_loginId,utypeRecid:1,userCreatetime:newdate},function(data){
			var data =data.data;
			if(data != "wdl"){
					
				maxlength = data;
				anchorIngList();
			}else{
				alertLoginMsg()
				
			}
		})
	}else if(msg == "all"){
		$.post(cometodown_url+"/getUserSheetsCount",{loginId:cometodown_loginId,utypeRecid:1},function(data){
			var data =data.data;
			if(data != "wdl"){
					
				maxlength = data;
				anchorIngList();
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
				$.post(cometodown_url+"/getUserSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,utypeRecid:1,userCreatetime:newdate},function(data){
					var data =data.data;
					if(data != "wdl"){
						
							
						maxlength = data;
						anchorIngList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
           	}else if(msg == "all" || msg == "allcxtj"){
           		msg = "allcxtj";
				$.post(cometodown_url+"/getUserSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,utypeRecid:1},function(data){
					var data =data.data;
					if(data != "wdl"){
						
							
						maxlength = data;
						anchorIngList();
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
	$("body").on("click",".anchorIng_details",function(){
		var index = $(this).attr("index");
		var dataobj = anchorIngData[index];
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
				if(currData[i].userStatus == 0){
					flag = "checked"
				}else{
					flag = ""
				}
				var imgurl = currData[i].userHeadimg;
				if(imgurl.indexOf("http")==-1){
					imgurl = cometodown_url+"/"+currData[i].userHeadimg;
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].userLoginname+'</td>'
		    	+  '<td>'+currData[i].userShowname+'</td>'
		    	+  '<td class="thisimg"><img src="'+imgurl+'" style="width:30px;"></td>'
		    	+  '<td>'+currData[i].userLastaddress+'</td>'
		    	+  '<td>'+currData[i].userLasttime+'</td>'
		    	+  '<td>'+currData[i].wealthAmount+'</td>'
		    	+  '<td>'+currData[i].wealthGrade+'</td>'
		    	+  '<td>'+currData[i].userMobilephone+'</td>'
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="否|是" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'"></td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini anchorIng_details" index="'+i+'"><i class="layui-icon">&#xe60a;</i> 用户详情</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getAnchorImgData(){
		var selectStr = $(".search_input").val();
		if(msg == "add"){
			$.post(cometodown_url+"/getUserSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,utypeRecid:1,userCreatetime:newdate},function(data){
				var data =data.data;
				if(data != "wdl"){
					anchorIngData = data;
					$(".anchorIng_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "addcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getUserSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utypeRecid:1,userCreatetime:newdate},function(data){
				var data =data.data;
				if(data != "wdl"){
					anchorIngData = data;
					$(".anchorIng_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "all"){
			$.post(cometodown_url+"/getUserSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,utypeRecid:1},function(data){
				var data =data.data;
				if(data != "wdl"){
					anchorIngData = data;
					$(".anchorIng_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			
			$.post(cometodown_url+"/getUserSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utypeRecid:1},function(data){
				var data =data.data;
				if(data != "wdl"){
					anchorIngData = data;
					$(".anchorIng_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function anchorIngList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			anchorIngData = that;
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
		var checkint = 1;
		if($(this).is(':checked')) {
		    checkint = 0;
		}
		$.post(cometodown_url+"/UpdateUserSheet",{loginId:cometodown_loginId,recid:recid,userStatus:checkint},function(data){
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