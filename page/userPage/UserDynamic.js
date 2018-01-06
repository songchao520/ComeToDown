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
	var userdynamicData = '';
	
	$.post(cometodown_url+"/getUserDynamicsCount",{loginId:cometodown_loginId},function(data){
		var data =data.data;
		if(data != "wdl"){
				
			maxlength = data;
			userdynamicList();
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
			$.post(cometodown_url+"/getUserDynamicsCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					
						
					maxlength = data;
					userdynamicList();
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

	//点击图片变大
	$(document).on("click",".thisimg",function(){
		var htmls = $(this).html().replace(/width:30px;/g,"width:390px;");

		layer.open({
			type:1,
			title:"图片详情，可拉伸",
			area: ['420px',"600px"], //宽高
			shadeClose:true,
			skin: 'layui-layer-demo', //样式类名
		    content: '<div style="padding:10px">'+htmls+'</div>' //格式见API文档手册页
		});
	})
	//删除动态
	$(document).on("click",".userdynamic_delete",function(){
		var index = $(this).attr("index");
		var data = userdynamicData[index];
		layer.confirm('确定删除此动态？',{icon:3, title:'提示信息'},function(index){
			$.post(cometodown_url+"/DeleteUserDynamic",{loginId:cometodown_loginId,recid:data["recid"]},function(data){
				if(data.data != "wdl"){
					layer.msg(data.msg);	
					userdynamicList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
		    layer.close(index);
		 	
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
				var imgs = currData[i].dynamicImages;
				var html = "";
				if(imgs!="" || imgs!=null || imgs.length !=0){
					for(var j in imgs){
						html = html+ '<img src="'+cometodown_url+"/"+imgs[j]+'" style="width:30px;padding:5px;">'
					}
				}
				
				
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].dynamicContent+'</td>'
		    	+  '<td>'+currData[i].createTime+'</td>'
		    	+  '<td class="thisimg" shux="dynamicImages">'+html+'</td>'
		    	+  '<td>'+currData[i].dynamicAddress+'</td>'
		    	+  '<td>'+currData[i].userLoginname+'</td>'
		    	+  '<td>'+currData[i].userShowname+'</td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini layui-btn-danger userdynamic_delete" index="'+i+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getuserDynamicData(){
		if(msg == "all"){
			$.post(cometodown_url+"/getUserDynamics",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					userdynamicData = data;
					$(".dynamic_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getUserDynamics",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					userdynamicData = data;
					$(".dynamic_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function userdynamicList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			userdynamicData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getuserDynamicData();
			}
		})
	}
	
    
})