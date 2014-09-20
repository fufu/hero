//
/// Download from http://www.oslook.com
// author:vicsun
// data:2014/9/20 15:14

var monkeyX,monkeyY;

var intervalId;
var game_state = 0;
var TIMER_TOTAL = 30000;
var TIMER_INTERVAL = 1000;
var timer_remain = TIMER_TOTAL;

var score =0;
var context ;
var stagesize;
var stageleft=0;
var stagetop=0;

function catch_monkey(ev){
	var x = ev.pageX;
	var y = ev.pageY;

	if(game_state ==1){
	score++;
	document.getElementById("score").innerHTML=score;
	}
}

function move(){
	//draw monkey .
	monkeyX = parseInt(Math.random()*(stagesize-80));
	monkeyY = parseInt(Math.random()*(stagesize-80));
	//move
	document.getElementById("myMonkey").style.position="absolute";
	document.getElementById("myMonkey").style.left=stageleft + monkeyX + 'px';
	document.getElementById("myMonkey").style.top=stagetop + monkeyY + 'px';
	
}

//random move
function jump(){
  	
  	//random move
  	move();
  	
	//time update
	timer_remain -= TIMER_INTERVAL;
	document.getElementById("time").style.color="blue";
	document.getElementById("time").innerHTML="00:" + timer_remain/1000;

	if(timer_remain <= 0)
	{
		stopclick();
	}
}


///backgrand
function bgRandom(){
	var arrColor = [
	"#ffdab9",
	"#ff4500",
	"#ffd700",
	"#7b68ee",
	"#f5deb3",
	"#ff1493"
	];

	var id = 0;
	
	id = parseInt(Math.random()*(6));
	//console.warn(id);
	document.bgColor=arrColor[id];
}


///init
function init_each(){
	bgRandom();
	//bgcolor random

	score=0;
	document.getElementById("score").innerHTML=score;
	timer_remain = TIMER_TOTAL;
	game_state = 1;

	document.getElementById("myscore").style.width ='1px';
	document.getElementById("myscore").style.height ='1px';
	document.getElementById("myscore").style.fontSize="1px";
	document.getElementById("myscore").innerHTML="";
	document.getElementById("stage").style.visibility='visible';
	var width=window.innerWidth;
	var height=window.innerHeight;
	stagesize=width;
	if (width>height)stagesize = height;
	//	console.warn("size"+stagesize);
	document.getElementById("stage").style.width =stagesize*0.95 +'px';
	document.getElementById("stage").style.height =stagesize*0.95 +'px';
	document.getElementById("stage").style.border='1px solid #000';

	stageleft=document.getElementById("stage").getBoundingClientRect().left;
	stagetop=document.getElementById("stage").getBoundingClientRect().top;
	
	move();
	//	console.warn("left:"+stageleft +"top:"+  stagetop);

}

///start button
function startclick(){
	init_each();

	document.getElementById("start_btn").disabled = "disabled";
	document.getElementById("stop_btn").disabled = "";

	//first time
	jump();

	intervalId = setInterval("jump()",TIMER_INTERVAL);
}

//stop button
function stopclick(){
	
	//timer clear
	clearInterval(intervalId);
	game_state=0;
	
	// button init
	document.getElementById("start_btn").disabled = "";
	document.getElementById("stop_btn").disabled = "disabled";

	//stage hidden for score
 	document.getElementById("stage").style.height='1px';
	document.getElementById("stage").style.visibility='hidden';

 	document.getElementById("myscore").style.width =stagesize*0.90 +'px';
 	document.getElementById("myscore").style.height =stagesize*0.50 +'px';
	document.getElementById("myscore").style.fontSize="45px";
	document.getElementById("myscore").style.color="#4d4d4d";
	document.getElementById("myscore").innerHTML="本次成绩:" + score;

	// Check browser support
	if (typeof(Storage) != "undefined") {
		if(localStorage.getItem("highscore") < score)
		{
			// Store
			localStorage.setItem("highscore", score);
		}
		// Retrieve
		document.getElementById("myscore").innerHTML += "<br>最好成绩:" + localStorage.getItem("highscore");
	}
	document.getElementById("myscore").innerHTML += "<br><a style='font-size: 12px;'>使用浏览器："+navigator.appName +"</a>";
	
	contextShare(localStorage.getItem("highscore"));

}

////window starts
function windowLoad(){
        
	document.getElementById("myMonkey").onclick = catch_monkey;
	document.getElementById("stop_btn").disabled = "";
	document.getElementById("score").style.color="blue";

	var img = new Image(); 
	img.src ="http://i.oslook.com/hero/monkey.jpg";
	img.onload = function() {
	document.getElementById("myMonkey").src = img.src;
	}

	init_each();
}

////weixin sharing
var imgUrl = "http://i.oslook.com/hero/monkey.jpg";
var lineLink = "http://i.oslook.com/hero";
var descContent = '';
var shareTitle = '无聊的时候想不想打猴子玩？ via oslook.com';
var appid = '';
 
funtion contextShare(score){
	
	if(score > 40){
	    descContent = "抓神猿-根本停不下来，玩过之后我整个人都精神了！"
	}
	else if(score > 30){
	    descContent = "我30秒抓了"+localStorage.getItem("highscore")+"只贱贱的神猿，击败99%的人，你能超过我吗？"
	}
	else if(score < 10){
	    descContent = "我抓的神猿太少，谁能帮个忙？"
	}
}

function shareFriend() {
    WeixinJSBridge.invoke('sendAppMessage',{
        "appid": appid,
        "img_url": imgUrl,
        "img_width": "200",
        "img_height": "200",
        "link": lineLink,
        "desc": descContent,
        "title": shareTitle
    }, function(res) {
        //_report('send_msg', res.err_msg);
    })
}
function shareTimeline() {
    WeixinJSBridge.invoke('shareTimeline',{
        "img_url": imgUrl,
        "img_width": "200",
        "img_height": "200",
        "link": lineLink,
        "desc": descContent,
        "title": shareTitle
    }, function(res) {
           //_report('timeline', res.err_msg);
    });
}

function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo',{
        "content": descContent,
        "url": lineLink,
    }, function(res) {
        //_report('weibo', res.err_msg);
    });
}
// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() 
{
	
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        shareFriend();
    });
    
    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        shareTimeline();
    });
    
    // 分享到微博
    WeixinJSBridge.on('menu:share:weibo', function(argv){
        shareWeibo();
    });
}, false);