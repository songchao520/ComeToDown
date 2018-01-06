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
	var showAnchorData = '';
	if(msg == "add"){
		//新增客户
		$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId,createTime:newdate},function(data){
			var data =data.data;
			if(data != "wdl"){
					
				maxlength = data;
				showAnchorList();
			}else{
				alertLoginMsg()
				
			}
		})

	}else if(msg == "all"){
		$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId},function(data){
			var data =data.data;
			if(data != "wdl"){
					
				maxlength = data;
				showAnchorList();
			}else{
				alertLoginMsg()
				
			}
		})
	}
	//排序字段查询
	var sortZiduan;	
	$(".sortZiduan").click(function(){
		sortZiduan = $(this).attr("sortZiduan");
		$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId},function(data){
			var data =data.data;
			if(data != "wdl"){
				msg = "sort";
					
				maxlength = data;
				showAnchorList();
				
			}else{
				alertLoginMsg()
				
			}
		})
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
				var r = /^\+?[0-9][0-9]*$/;
					if(!r.test(updateText)){
				        layer.msg("请输入非负整数!");
				        $(this).focus();
				        return false;
				    }
				var data = new Object();
				data["loginId"] = cometodown_loginId;
				data["recid"] = recid;	
				
				data[shux] = updateText;
				$.post(cometodown_url+"/UpdateAnchorSheet",data,function(data){
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
	
	//查询
	$(".search_btn").click(function(){
		var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
		if($(".search_input").val() != ''){
			if(msg == "sort"){
				msg = "all";
			}
			if(msg == "add" || msg == "addcxtj"){
				msg = "addcxtj";
				$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,createTime:newdate},function(data){
					var data =data.data;
					if(data != "wdl"){
						
							
						maxlength = data;
						showAnchorList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
		
			}else if(msg == "all" || msg == "allcxtj"){
				msg = "allcxtj";
				$.post(cometodown_url+"/getAnchorSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr},function(data){
					var data =data.data;
					if(data != "wdl"){
						
							
						maxlength = data;
						showAnchorList();
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

	//操作
	$("body").on("click",".showAnchor_details",function(){
		var recid = $(this).attr("data-userid");
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
		    	+  '<td>'+currData[i].userName+'</td>'
		    	+  '<td>'+currData[i].accumulativeGift+'</td>'
		    	+  '<td>'+currData[i].beconsumedAmount+'</td>'
		    	+  '<td>'+currData[i].amountOfcash+'</td>'
		    	+  '<td>'+currData[i].balance+'</td>'
		    	+  '<td>'+currData[i].anchorGrade+'</td>'		    	
		    	+  '<td>'+currData[i].accumulativeTime+'</td>'
		    	+  '<td>'+currData[i].voiceChat+'</td>'
		    	+  '<td>'+currData[i].videoChat+'</td>'
		    	+  '<td>'+currData[i].anchorGlamour+'</td>'
		    	+  '<td class="thisimg" ><img src="'+cometodown_url+"/"+currData[i].myPhoto+'" style="width:30px;"></td>'
		    	+  '<td class="clickthis" shux="isRecommend" recid="'+currData[i].recid+'">'+currData[i].isRecommend+'</td>'
		    	+  '<td class="clickthis" shux="isHot" recid="'+currData[i].recid+'">'+currData[i].isHot+'</td>'
		    	
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini showAnchor_details" index="'+i+'"><i class="layui-icon" data-userid="'+currData[i].userRecid+'">&#xe60a;</i> 查看用户信息</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="13">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getAnchorImgData(){
		var selectStr = $(".search_input").val();
		if(msg == "add"){
			//新增客户
			$.post(cometodown_url+"/getAnchorSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,createTime:newdate},function(data){
				var data =data.data;
				if(data != "wdl"){
					showAnchorData = data;
					$(".showAnchor_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
	
		}else if(msg == "addcxtj"){
			$.post(cometodown_url+"/getAnchorSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,createTime:newdate,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					showAnchorData = data;
					$(".showAnchor_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		else if(msg == "all"){
			$.post(cometodown_url+"/getAnchorSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage},function(data){
				var data =data.data;
				if(data != "wdl"){
					showAnchorData = data;
					$(".showAnchor_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			
			$.post(cometodown_url+"/getAnchorSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				var data =data.data;
				if(data != "wdl"){
					showAnchorData = data;
					$(".showAnchor_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "sort"){
			
			$.post(cometodown_url+"/getAnchorSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,sortZiduan:sortZiduan},function(data){
				var data =data.data;
				if(data != "wdl"){
					showAnchorData = data;
					$(".showAnchor_content").html(renderDate(data,currpage));
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function showAnchorList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			showAnchorData = that;
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
        
})