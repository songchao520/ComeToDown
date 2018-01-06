var cometodown_url = "http://127.0.0.1:8080/ComeToD";
//var cometodown_url = "http://songclovelij.top/ComeToD";
//var cometodown_url = "http://192.168.0.155:8080/ComeToD"
//var cometodown_url = "http://cometodown.fzbox.net/Cargo";

var cometodown_username = getCookie("cometodown_username");
var cometodown_loginId = getCookie("cometodown_loginId");
var cometodown_pagesize = 3;

var newdate = formatTime(new Date());

if(cometodown_username == null){
	var  html  = getHtmlDocName();
	if(html == "index"){
		location = "login.html";
	}else{
		location = "../../login.html";
	}
	
}else{
	if(sessionStorage.getItem("cometodown_loginuser")==null || sessionStorage.getItem("cometodown_loginuser")==""){
		var  html  = getHtmlDocName();
		alert("在新标签打开页面，请重新登陆！")
		if(html == "index"){
			location = "login.html";
		}else{
			location = "../../login.html";
		}
	}
	
}


function getHtmlDocName() {
    var str = window.location.href;
    str = str.substring(str.lastIndexOf("/") + 1);
    str = str.substring(0, str.lastIndexOf("."));
    return str;
}
//读取cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
} 
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null){
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
} 
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function alertLoginMsg(){
	var  html  = getHtmlDocName();
		alert("此账号在其他地点登录，请重新登陆！")
		if(html == "index"){
			parent.location = "login.html";
		}else{
			parent.location = "../../login.html";
		}
}
function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    var miao = _time.getSeconds()<10 ? "0"+_time.getSeconds() : _time.getSeconds();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+miao;
}

