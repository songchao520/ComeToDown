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
	var anchorIngData = '';
	
	$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,examineStatus:2},function(data){
		var data =data.data;
		if(data != "wdl"){
				
			maxlength = data;
			anchorIngList();
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
			$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,examineStatus:2},function(data){
				var data =data.data;
				if(data != "wdl"){
					
						
					maxlength = data;
					anchorIngList();
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

	//操作
	$("body").on("click",".anchorIng_details",function(){
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
	$("body").on("click",".anchorIng_pass",function(){  //删除
		var _this = $(this);
		var recid = _this.attr("data-id");
		var examineStatus = _this.attr("data-examineStatus");
		var userRecid = _this.attr("data-userid");
		var atext = _this.text();
		layer.confirm('确定'+atext+'审核？',{icon:3, title:'提示信息'},function(index){
			//_this.parents("tr").remove();
			$.post(cometodown_url+"/UpdateAnchorStatusSheet",{loginId:cometodown_loginId,recid:recid,examineStatus:examineStatus,userRecid:userRecid},function(data){
				var data = data.data;
				if(data != "wdl"){
					layer.msg("操作成功！");
					if(examineStatus == "3"){
						$.post(cometodown_url+"/saveAnchorSheet",{loginId:cometodown_loginId,userRecid:userRecid},function(data){
							 if(data != "wdl" && data != ""){
								
							 	parent.document.getElementById('mainiframe').contentWindow.location.reload(true);
								if(msg == "all"){
									$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,examineStatus:2},function(data){
										var data = data.data;
										if(data != "wdl"){
											maxlength = data;
											anchorIngList();
										}else{
											alertLoginMsg()
											
										}
									})
								}else if(msg == "allcxtj"){
									var selectStr = $(".search_input").val();
									$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,examineStatus:2},function(data){
										var data = data.data;
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
								alertLoginMsg()
								
							}
						})
					}else  if(examineStatus == "4"){
						if(msg == "all"){
							$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,examineStatus:2},function(data){
								var data = data.data;
								if(data != "wdl"){
									maxlength = data;
									anchorIngList();
								}else{
									alertLoginMsg()
									
								}
							})
						}else if(msg == "allcxtj"){
							var selectStr = $(".search_input").val();
							$.post(cometodown_url+"/getAnchorStatusSheetsCount",{loginId:cometodown_loginId,cxtj:selectStr,examineStatus:2},function(data){
								var data = data.data;
								if(data != "wdl"){
									
										
									maxlength = data;
									anchorIngList();
									layer.close(index);
								}else{
									alertLoginMsg()
									
								}
							})
						}
					}
					 layer.close(index);
					
				
				}else{
					alertLoginMsg()
					
				}
			})
			layer.close(index);
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
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].anchorName+'</td>'
		    	+  '<td>'+currData[i].anchorIdcord+'</td>'
		    	+  '<td class="thisimg"><img src="'+cometodown_url+"/"+currData[i].myPhoto+'" style="width:30px;"></td>'
		    	+  '<td class="thisimg"><img src="'+cometodown_url+"/"+currData[i].smallPhoto+'" style="width:30px;"></td>'
		    	+  '<td>'+currData[i].userBirthday+'</td>'
		    	+  '<td>'+currData[i].userAddress+'</td>'
		    	+  '<td>'+currData[i].userOccupation+'</td>'
		    	+  '<td class="thisimg" ><img src="'+cometodown_url+"/"+currData[i].examinePhoto+'" style="width:30px;"></td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini anchorIng_details" index="'+i+'"><i class="layui-icon" data-userid="'+currData[i].userRecid+'">&#xe60a;</i> 查看用户信息</a>'
				+    '<a class="layui-btn layui-btn-mini anchorIng_pass" data-id="'+currData[i].recid+'" data-userid="'+currData[i].userRecid+'" data-examineStatus="3"> 通过</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini anchorIng_pass" data-id="'+currData[i].recid+'"  data-userid="'+currData[i].userRecid+'" data-examineStatus="4"> 不通过</a>'
			//	+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+data[i].usersId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getAnchorImgData(){
		if(msg == "all"){
			$.post(cometodown_url+"/getAnchorStatusSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,examineStatus:2},function(data){
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
			var selectStr = $(".search_input").val();
			$.post(cometodown_url+"/getAnchorStatusSheets",{loginId:cometodown_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,examineStatus:2},function(data){
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
        
})