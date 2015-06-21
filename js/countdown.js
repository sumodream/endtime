//全局变量
var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=500;
var RADIUS=8;
//每个数字距离画布上边距离
var MARGIN_TOP = 60;
//每个数字距离画布左边距离
var MARGIN_LEFT =30;

//倒记截止的时间,月数是从0——11这之间，小时只有两位位置，最多倒记14天
//const endTime=new Date(2015,4,20,10,11,52);固定时间倒计时

var endTime=new Date();//不能设置成const
endTime.setTime(endTime.getTime()+3600*1000);//距离当前的时间
//js中Date对象提供getTime方法

//现在倒计时秒
var curShowTimeSeconds=0;

//小球颜色
var balls=[];
const colors=["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload=function(){

	//屏幕自适应，不能将宽高设为固定值
	WINDOW_WIDTH = document.body.clientWidth
    WINDOW_HEIGHT = document.body.clientHeight

    MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1;

    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);

	var canvas=document.getElementById('canvas');
	var context=canvas.getContext("2d");

	//屏幕大小改变特别方便，对后期屏幕自适应时只需要计算这两个变量
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;

	//具体计算倒计时封装到此函数中
	curShowTimeSeconds=getCurrentShowTimeSeconds();


	//动画效果
	 setInterval(
	 		function(){
	 			//处理绘制过程
				render(context);//渲染
				update();//刷新
	 		}
	 		,
			50
	 	);
	
}
//获取当前时间
function getCurrentShowTimeSeconds(){
	var curTime=new Date();
	var ret = endTime.getTime()-curTime.getTime();
	ret =Math.round(ret/1000);

	return ret >=0?ret:0; //判断是否时间大于0
}

//刷新时间，获取当前时间  ，已经产生小球运动的更新
function update(){
	//下一秒时间
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();
	var nextHours=parseInt(nextShowTimeSeconds/3600);
	var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds=nextShowTimeSeconds%60;//总秒数

	//当前时间
	var curHours=parseInt(curShowTimeSeconds/3600);
	var curMinutes=parseInt((curShowTimeSeconds-nextHours*3600)/60);
	var curSeconds=curShowTimeSeconds%60;//

	//判断下一秒时间是否等于当前时间
	if( nextSeconds != curSeconds ){
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }


		curShowTimeSeconds=nextShowTimeSeconds;
	}
	updateBalls();
	//console.log(balls.length);//计算小球个数  让小球保持一定的量

}

//更新小球运动
function updateBalls(){
	for( var i = 0 ;i < balls.length ; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;//重力

		//碰撞检测
		if( balls[i].y >= WINDOW_HEIGHT -RADIUS){
			balls[i].y = WINDOW_HEIGHT -RADIUS;
			balls[i].vy = - balls[i].vy*0.7;//摩擦系数  弹跳更长
		}
	}
	//检测小球数量
	var cnt=0;
	for (var i=0;i<balls.length;i++)
		if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH)
			balls[cnt++]=balls[i];
	while(balls.length>Math.min(300,cnt)){//计算小球数量
		balls.pop();//删除多余小球
	}
}


//随着时间变化小球变化
function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++)
		for(var j=0;j<digit[num][i].length;j++)
			if(digit[num][i][j]==1){
				var aBall={
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),//小球加速度
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				//增加小球数量
				balls.push(aBall);
			}
}

//获取当前时间距离截止日期时间
function render(cxt){

	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//矩形刷新  让新显示的时间覆盖原来的时间

	var hours=parseInt(curShowTimeSeconds/3600);//当前时间除以秒数
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds%60;//总秒数

	//renderDigit(距离左边距离，距离右边距离，本身数字，传参cxt);
	
	//第一个数字，传参过程中小时除以10
	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )

	//第二个数字小时的个位数，在marginleft基础上加上第一个数字的横向距离，数组是digit 7倍数组 *dadius+1,为了和右侧数据留有空气，即15倍距离
	//小时与10的求余便是小时个位上的数字
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt );

    //第三个位置放置的是小时后面的：，该位置在digit中是第10个变量，因此在第三个位置中填入10
   renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cxt );

    //第四个位置是分钟十位上的数字，此处数组是digit 4倍的数组 即9倍距离
     renderDigit( MARGIN_LEFT +39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);

    //第五个位置是分钟个位上的数字
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);

    //第六个位置放置的是分钟后面的：
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);

    //第七个位置是秒钟十位上的数字
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);

    //第八个位置是秒钟个位上的数字
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);


    //绘制小球
    for(var i=0;i<balls.length;i++){
    	cxt.fillStyle=balls[i].color;

    	cxt.beginPath();
    	cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
    	cxt.closePath();

    	cxt.fill();
    }
}

//圆球绘制
function renderDigit(x,y,num,cxt){
	cxt.fillStyle="rgb(0,102,153)";

	//对num进行遍历
	for(var i=0;i < digit[num].length;i++)
		for(var j=0;j<digit[num][i].length;j++)
			if(digit[num][i][j]==1){
				cxt.beginPath();
				//第（i,j)个圆心的位置              
				        //横坐标                     //纵坐标
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);//参数计算
				cxt.closePath();

				cxt.fill();
			}
}


